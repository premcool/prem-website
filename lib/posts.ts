import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Resolve posts directory - handle both development and production (standalone) builds
function getPostsDirectory(): string {
  const cwd = process.cwd();
  
  // Try multiple possible locations
  const possiblePaths = [
    path.join(cwd, 'content/blog'),           // Standard location
    path.join(cwd, '..', 'content/blog'),     // If cwd is in .next/standalone
  ];
  
  for (const dirPath of possiblePaths) {
    if (fs.existsSync(dirPath)) {
      return dirPath;
    }
  }
  
  // Fallback to standard location
  return path.join(cwd, 'content/blog');
}

// Get posts directory at runtime (not module load time) to handle different execution contexts
function getPostsDirectoryPath(): string {
  return getPostsDirectory();
}

export type BlogCategory = 'AI Roundup' | 'Crypto Roundup' | 'Industry Updates';

export interface Post {
  slug: string;
  title: string;
  date: string;
  category?: BlogCategory;
  image?: string;
  content: string;
  contentHtml: string;
}

interface PostFrontmatter {
  title?: string;
  date?: string;
  slug?: string;
  category?: BlogCategory;
  image?: string;
}

/** URL slug: frontmatter `slug` when set, otherwise the filename (without .md). */
function canonicalSlugFromFrontmatter(data: PostFrontmatter, fileNameWithoutExt: string): string {
  const s = data.slug;
  if (s != null && String(s).trim() !== '') {
    return String(s).trim();
  }
  return fileNameWithoutExt;
}

function resolvePublicRoot(): string {
  const cwd = process.cwd();
  const candidates = [path.join(cwd, 'public'), path.join(cwd, '..', 'public')];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return path.join(cwd, 'public');
}

/**
 * Find markdown file for a URL slug: `slug.md` first, then any file whose canonical slug matches.
 */
function findMarkdownPathForSlug(postsDirectory: string, slug: string): string | null {
  const direct = path.join(postsDirectory, `${slug}.md`);
  if (fs.existsSync(direct)) {
    return direct;
  }

  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'));
  } catch {
    return null;
  }

  for (const fileName of fileNames) {
    const fileBase = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    try {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      const data = matterResult.data as PostFrontmatter;
      if (canonicalSlugFromFrontmatter(data, fileBase) === slug) {
        return fullPath;
      }
    } catch {
      continue;
    }
  }
  return null;
}

export function getAllPosts(): Post[] {
  const postsDirectory = getPostsDirectoryPath();
  const publicRoot = resolvePublicRoot();

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.error(`Posts directory not found: ${postsDirectory}`);
    console.error(`Current working directory: ${process.cwd()}`);
    return [];
  }

  try {
    // Get all file names in the posts directory
    const fileNames = fs.readdirSync(postsDirectory);

    type Draft = { post: Post; fileBase: string };
    const drafts: Draft[] = [];

    for (const fileName of fileNames.filter((f) => f.endsWith('.md'))) {
      const fileBase = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const data = matterResult.data as PostFrontmatter;
        const slug = canonicalSlugFromFrontmatter(data, fileBase);

        if (!data.title || !data.date) {
          console.warn(`Post ${fileBase}.md is missing required frontmatter fields (title, date)`);
          continue;
        }

        const image =
          data.image && fs.existsSync(path.join(publicRoot, data.image.replace(/^\//, '')))
            ? data.image
            : undefined;

        drafts.push({
          fileBase,
          post: {
            slug,
            title: data.title,
            date: data.date,
            category: data.category,
            image,
            content: matterResult.content,
            contentHtml: '',
          },
        });
      } catch (error) {
        console.error(`Error reading post file ${fileName}:`, error);
      }
    }

    // Newest first, then stable by filename — first wins for duplicate canonical slugs
    drafts.sort((a, b) => {
      if (a.post.date !== b.post.date) {
        return a.post.date < b.post.date ? 1 : -1;
      }
      return a.fileBase.localeCompare(b.fileBase);
    });

    const bySlug = new Map<string, Post>();
    for (const d of drafts) {
      if (!bySlug.has(d.post.slug)) {
        bySlug.set(d.post.slug, d.post);
      } else {
        console.warn(
          `Skipping ${d.fileBase}.md: duplicate canonical slug "${d.post.slug}" (already used by another file)`
        );
      }
    }

    return Array.from(bySlug.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postsDirectory = getPostsDirectoryPath();
  const fullPath = findMarkdownPathForSlug(postsDirectory, slug);

  if (!fullPath) {
    console.error(`No markdown file found for slug: ${slug}`);
    console.error(`Posts directory: ${postsDirectory}`);
    console.error(`Current working directory: ${process.cwd()}`);
    try {
      if (fs.existsSync(postsDirectory)) {
        const files = fs.readdirSync(postsDirectory);
        console.error(`Available files in posts directory: ${files.join(', ')}`);
      }
    } catch (err) {
      console.error(`Could not list files in posts directory: ${err}`);
    }
    return null;
  }

  const fileBase = path.basename(fullPath, '.md');

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const data = matterResult.data as PostFrontmatter;

    if (!data.title || !data.date) {
      console.warn(`Post ${fileBase} is missing required frontmatter fields (title, date)`);
      return null;
    }

    const canonicalSlug = canonicalSlugFromFrontmatter(data, fileBase);

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug: canonicalSlug,
      title: data.title,
      date: data.date,
      category: data.category,
      image: data.image,
      content: matterResult.content,
      contentHtml,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  // Must match canonical slugs used in getAllPosts / getPostBySlug (frontmatter wins)
  return getAllPosts().map((p) => p.slug);
}

export function getPostsByCategory(category: BlogCategory): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): BlogCategory[] {
  const categories = new Set<BlogCategory>();
  getAllPosts().forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  // Return all available categories, even if no posts have them yet
  // This ensures the filter UI is always visible
  const allAvailableCategories: BlogCategory[] = ['AI Roundup', 'Crypto Roundup', 'Industry Updates'];
  return allAvailableCategories;
}

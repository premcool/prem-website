import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/blog');

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

export function getAllPosts(): Post[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  try {
    // Get all file names in the posts directory
    const fileNames = fs.readdirSync(postsDirectory);
    
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          // Remove .md extension to get slug
          const slug = fileName.replace(/\.md$/, '');

          // Read markdown file as string
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents);
          const data = matterResult.data as PostFrontmatter;

          // Validate required fields
          if (!data.title || !data.date) {
            console.warn(`Post ${slug} is missing required frontmatter fields (title, date)`);
            return null;
          }

          // Combine the data with the slug
          return {
            slug,
            title: data.title,
            date: data.date,
            category: data.category,
            image: data.image,
            content: matterResult.content,
            contentHtml: '', // Will be populated when needed
          };
        } catch (error) {
          console.error(`Error reading post file ${fileName}:`, error);
          return null;
        }
      })
      .filter((post): post is Post => post !== null);

    // Sort posts by date descending
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const data = matterResult.data as PostFrontmatter;

    // Validate required fields
    if (!data.title || !data.date) {
      console.warn(`Post ${slug} is missing required frontmatter fields (title, date)`);
      return null;
    }

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
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
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return [];
  }
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

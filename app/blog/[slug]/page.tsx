import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import Section from '@/components/Section';
import SocialShare from '@/components/SocialShare';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://premsaktheesh.com';

export const revalidate = 3600;

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${baseUrl}/blog/${slug}`;
  const excerpt = post.content.substring(0, 160).replace(/\n/g, ' ').trim();

  return {
    title: post.title,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      publishedTime: post.date,
      url,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="py-12">
      <Section>
        <article>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <p className="text-slate-400 mb-8">{formatDate(post.date)}</p>
          {/* Safe to use dangerouslySetInnerHTML: content is from owner-controlled markdown files processed by remark-html */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white
              prose-p:text-slate-300
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
              prose-strong:text-white
              prose-code:text-blue-400 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
              prose-li:text-slate-300
              prose-blockquote:text-slate-300 prose-blockquote:border-slate-700"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <SocialShare
            url={`${baseUrl}/blog/${post.slug}`}
            title={post.title}
            description={post.content.substring(0, 160)}
          />
        </article>
      </Section>
    </div>
  );
}

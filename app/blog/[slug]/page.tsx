import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import Section from '@/components/Section';
import SocialShare from '@/components/SocialShare';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

// Force dynamic rendering in development, use ISR in production
export const dynamic = process.env.NODE_ENV === 'development' ? 'force-dynamic' : 'auto';
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-slate-400 text-sm sm:text-base">{formatDate(post.date)}</p>
            {post.category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
                {post.category}
              </span>
            )}
          </div>
          {/* Blog Post Header Image */}
          {post.image && (
            <div className="mb-8 relative w-full aspect-video overflow-hidden rounded-lg border border-slate-700 shadow-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
              />
            </div>
          )}
          {/* Safe to use dangerouslySetInnerHTML: content is from owner-controlled markdown files processed by remark-html */}
          <div
            className="prose prose-invert prose-sm sm:prose-base md:prose-lg max-w-none
              prose-headings:text-white prose-headings:font-semibold
              prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl
              prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl
              prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl
              prose-p:text-slate-300 prose-p:text-sm sm:prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
              prose-strong:text-white
              prose-code:text-blue-400 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
              prose-li:text-slate-300 prose-li:text-sm sm:prose-li:text-base
              prose-blockquote:text-slate-300 prose-blockquote:border-slate-700
              prose-img:rounded-lg prose-img:border prose-img:border-slate-700 prose-img:shadow-lg prose-img:max-w-full prose-img:h-auto
              prose-img:mx-auto"
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

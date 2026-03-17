import { getAllPosts, getAllCategories } from '@/lib/posts';
import Section from '@/components/Section';
import BlogFilter from '@/components/BlogFilter';
import type { Metadata } from 'next';

export const dynamic = process.env.NODE_ENV === 'development' ? 'force-dynamic' : 'auto';
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

export const metadata: Metadata = {
  title: 'Blog',
};

export default function Blog() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Prem Saktheesh Blog',
    url: `${baseUrl}/blog`,
    description: 'Insights on AI, cloud transformation, enterprise architecture, and technology leadership',
    author: {
      '@type': 'Person',
      name: 'Prem Saktheesh',
    },
    blogPost: allPosts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Section>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8">
          Insights on AI, cloud transformation, enterprise architecture, and technology leadership.
        </p>

        <BlogFilter posts={allPosts} categories={categories} />
      </Section>
    </div>
  );
}

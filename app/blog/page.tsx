import { getAllPosts, getAllCategories } from '@/lib/posts';
import Section from '@/components/Section';
import BlogFilter from '@/components/BlogFilter';
import type { Metadata } from 'next';

// Force dynamic rendering in development, use ISR in production
export const dynamic = process.env.NODE_ENV === 'development' ? 'force-dynamic' : 'auto';
export const revalidate = process.env.NODE_ENV === 'development' ? 0 : 3600;

export const metadata: Metadata = {
  title: 'Blog',
};

export default function Blog() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="py-12">
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

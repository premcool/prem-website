import { getAllPosts } from '@/lib/posts';
import Section from '@/components/Section';
import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="py-12">
      <Section>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
        <p className="text-xl text-slate-300 mb-12">
          Insights on AI, cloud transformation, enterprise architecture, and technology leadership.
        </p>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-300">
              No blog posts yet. Check back soon for updates.
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}

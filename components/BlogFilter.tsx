'use client';

import { useState, useMemo } from 'react';
import { Post, BlogCategory } from '@/lib/posts';
import BlogCard from './BlogCard';

interface BlogFilterProps {
  posts: Post[];
  categories: BlogCategory[];
}

export default function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All');

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') {
      return posts;
    }
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter posts by category">
          <button
            onClick={() => setSelectedCategory('All')}
            aria-pressed={selectedCategory === 'All'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
          <p className="text-slate-300">
            {selectedCategory === 'All'
              ? 'No blog posts yet. Check back soon for updates.'
              : `No posts found in ${selectedCategory}.`}
          </p>
        </div>
      )}
    </>
  );
}

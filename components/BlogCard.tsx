'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/posts';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);

  const excerpt = post.content.substring(0, 160).replace(/\n/g, ' ').trim();
  const excerptWithEllipsis = excerpt.length < post.content.length ? `${excerpt}...` : excerpt;

  const wordCount = post.content.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-slate-700/60 bg-slate-800/50 overflow-hidden hover:shadow-lg hover:shadow-blue-500/[0.04] hover:border-blue-500/25 transition-all duration-500"
    >
      {post.image && !imageError ? (
        <div className="relative w-full h-44 sm:h-48 bg-slate-900 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 50vw"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-purple-500" />
      )}

      <div className="p-5 sm:p-6">
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            {post.category}
          </span>
        )}

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
          {excerptWithEllipsis}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{readTime}</span>
            <span className="mx-1">&middot;</span>
            <span>{formattedDate}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:gap-2 transition-all duration-300">
            Read more
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

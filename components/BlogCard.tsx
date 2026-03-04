import Link from 'next/link';
import { Post } from '@/lib/posts';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract excerpt from content (first 150 characters)
  const excerpt = post.content.substring(0, 150).replace(/\n/g, ' ').trim();
  const excerptWithEllipsis = excerpt.length < post.content.length ? `${excerpt}...` : excerpt;

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-white hover:text-blue-400 transition-colors flex-1">
            {post.title}
          </h3>
          {post.category && (
            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20 flex-shrink-0">
              {post.category}
            </span>
          )}
        </div>
        <p className="text-slate-400 text-sm mb-4">{formatDate(post.date)}</p>
        <p className="text-slate-300 text-sm sm:text-base line-clamp-3">{excerptWithEllipsis}</p>
        <div className="mt-4 text-blue-400 text-sm font-medium">
          Read more →
        </div>
      </div>
    </Link>
  );
}

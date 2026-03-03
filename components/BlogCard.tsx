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
        <h3 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-slate-400 text-sm mb-4">{formatDate(post.date)}</p>
        <p className="text-slate-300 line-clamp-3">{excerptWithEllipsis}</p>
        <div className="mt-4 text-blue-400 text-sm font-medium">
          Read more →
        </div>
      </div>
    </Link>
  );
}

import { GitHubRepo } from '@/lib/github';
import Link from 'next/link';

interface ProjectCardProps {
  repo: GitHubRepo;
  featured?: boolean;
}

export default function ProjectCard({ repo, featured = false }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className={`bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors ${
        featured ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      {featured && (
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full">
            Featured
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-white break-words flex-1">
          {repo.name}
        </h3>
        {repo.stargazers_count > 0 && (
          <div className="flex items-center text-slate-400 text-sm flex-shrink-0">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {repo.stargazers_count}
          </div>
        )}
      </div>
      {repo.description && (
        <p className="text-slate-300 mb-4 line-clamp-2">{repo.description}</p>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-400">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {repo.language && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {repo.language}
            </span>
          )}
          <span className="whitespace-nowrap">Updated {formatDate(repo.updated_at)}</span>
        </div>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors font-medium whitespace-nowrap"
        >
          View on GitHub →
        </Link>
      </div>
    </div>
  );
}

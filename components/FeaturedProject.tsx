import { GitHubRepo } from '@/lib/github';
import Link from 'next/link';

interface FeaturedProjectProps {
  repo: GitHubRepo;
}

export default function FeaturedProject({ repo }: FeaturedProjectProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Architecture diagram for ai-coder-buddy
  const architectureDiagram = (
    <div className="mt-6 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
      <h4 className="text-lg font-semibold text-white mb-4">Architecture</h4>
      <div className="space-y-4">
        {/* Architecture Flow */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Planner Agent */}
          <div className="flex-1 bg-slate-800/70 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <h5 className="font-semibold text-white">Planner Agent</h5>
            </div>
            <p className="text-sm text-slate-300">Analyzes requests and generates detailed project plans</p>
          </div>
          
          <div className="hidden md:block text-blue-400 text-2xl">→</div>
          
          {/* Architect Agent */}
          <div className="flex-1 bg-slate-800/70 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <h5 className="font-semibold text-white">Architect Agent</h5>
            </div>
            <p className="text-sm text-slate-300">Breaks down plans into engineering tasks with file context</p>
          </div>
          
          <div className="hidden md:block text-blue-400 text-2xl">→</div>
          
          {/* Coder Agent */}
          <div className="flex-1 bg-slate-800/70 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <h5 className="font-semibold text-white">Coder Agent</h5>
            </div>
            <p className="text-sm text-slate-300">Implements tasks, writes files, and uses developer tools</p>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Built with:</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">LangGraph</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">Python</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">Multi-Agent AI</span>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">Groq API</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors ring-2 ring-blue-500/50">
      <div className="mb-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full">
          Featured
        </span>
      </div>
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-semibold text-white">
          {repo.name}
        </h3>
        {repo.stargazers_count > 0 && (
          <div className="flex items-center text-slate-400 text-sm">
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
        <p className="text-slate-300 mb-4 text-lg leading-relaxed">{repo.description}</p>
      )}
      
      {/* Architecture Diagram - only show for ai-coder-buddy */}
      {repo.name === 'ai-coder-buddy' && architectureDiagram}
      
      <div className="flex items-center justify-between text-sm text-slate-400 mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center space-x-4">
          {repo.language && (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              {repo.language}
            </span>
          )}
          <span>Updated {formatDate(repo.updated_at)}</span>
        </div>
        <Link
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          View on GitHub →
        </Link>
      </div>
    </div>
  );
}

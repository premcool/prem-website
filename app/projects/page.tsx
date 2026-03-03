import { getAllRepos, getFeaturedRepo } from '@/lib/github';
import Section from '@/components/Section';
import ProjectCard from '@/components/ProjectCard';
import FeaturedProject from '@/components/FeaturedProject';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const [allRepos, featuredRepo] = await Promise.all([
    getAllRepos(),
    getFeaturedRepo(),
  ]);

  // Filter out featured repo from all repos list
  const otherRepos = featuredRepo
    ? allRepos.filter((repo) => repo.name !== featuredRepo.name)
    : allRepos;

  return (
    <div className="py-12">
      <Section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Projects</h1>
        <p className="text-xl text-slate-300 mb-12">
          A collection of open-source projects and contributions showcasing expertise in AI, cloud computing, and software engineering.
        </p>

        {/* Featured Project */}
        {featuredRepo && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6">Featured Project</h2>
            <FeaturedProject repo={featuredRepo} />
          </div>
        )}

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">
            {featuredRepo ? 'All Projects' : 'Projects'}
          </h2>
          {otherRepos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherRepos.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-slate-300">
                No projects found. Check back soon for updates.
              </p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  language: string | null;
}

export async function getAllRepos(): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const response = await fetch(
      'https://api.github.com/users/premcool/repos',
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded. Consider setting GITHUB_TOKEN environment variable.');
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Repositories to exclude
    const excludedRepos = ['strapi-deploy'];

    // Validate and filter repos
    const validRepos = repos.filter((repo): repo is GitHubRepo => 
      repo && 
      typeof repo.id === 'number' &&
      typeof repo.name === 'string' &&
      typeof repo.updated_at === 'string' &&
      !excludedRepos.includes(repo.name) &&
      !repo.name.toLowerCase().startsWith('arbi')
    );

    // Sort by updated_at descending
    return validRepos.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

export async function getFeaturedRepo(): Promise<GitHubRepo | null> {
  const repos = await getAllRepos();
  const featured = repos.find((repo) => repo.name === 'ai-coder-buddy');
  return featured || null;
}

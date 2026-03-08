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
      // Handle different error cases gracefully
      if (response.status === 401) {
        // 401 Unauthorized - token missing or invalid (expected in some environments)
        if (!token) {
          console.warn('GitHub API: No token provided. Set GITHUB_TOKEN environment variable to fetch repos.');
        } else {
          console.warn('GitHub API: Invalid or expired token. Please update GITHUB_TOKEN environment variable.');
        }
        return [];
      }
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded. Consider setting GITHUB_TOKEN environment variable.');
        return [];
      }
      // For other errors, log but don't fail the build
      console.warn(`GitHub API error: ${response.status} ${response.statusText}. Continuing without repos.`);
      return [];
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
    // Only log unexpected errors (network issues, JSON parsing, etc.)
    // Expected HTTP errors (401, 403) are already handled above
    console.warn('Unexpected error fetching GitHub repos:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export async function getFeaturedRepo(): Promise<GitHubRepo | null> {
  try {
    const repos = await getAllRepos();
    const featured = repos.find((repo) => repo.name === 'ai-coder-buddy');
    return featured || null;
  } catch (error) {
    // getAllRepos already handles errors and returns [], so this should rarely happen
    return null;
  }
}

import { execSync } from 'child_process';
import { Logger } from '../layer1/Logger.ts';

export interface GitHubRepository {
  name: string;
  fullName: string;
  htmlUrl: string;
  cloneUrl: string;
  sshUrl: string;
}

export class GitHubApi {
  private useGhCli: boolean = false;

  constructor() {
    // Empty constructor following Web4 principles
  }

  /**
   * Initialize GitHub API adapter - detect available tools
   */
  async init(): Promise<this> {
    // Check if gh CLI is available
    try {
      execSync('gh --version', { stdio: 'pipe' });
      this.useGhCli = true;
      Logger.log('[GitHubApi] Using gh CLI for GitHub operations', 'info');
    } catch (error) {
      this.useGhCli = false;
      Logger.log('[GitHubApi] gh CLI not available, will use @octokit/rest fallback', 'warn');
    }
    return this;
  }

  /**
   * Create a new GitHub repository
   */
  async createRepository(org: string, repoName: string, options: {
    private?: boolean;
    description?: string;
  } = {}): Promise<GitHubRepository> {
    const visibility = options.private ?? (process.env.GITHUB_VISIBILITY !== 'public');
    const description = options.description ?? `Web4Articles template project: ${repoName}`;

    if (this.useGhCli) {
      return this.createRepositoryWithGhCli(org, repoName, visibility, description);
    } else {
      return this.createRepositoryWithOctokit(org, repoName, visibility, description);
    }
  }

  /**
   * Create repository using gh CLI
   */
  private createRepositoryWithGhCli(org: string, repoName: string, isPrivate: boolean, description: string): GitHubRepository {
    try {
      const visibility = isPrivate ? '--private' : '--public';
      const cmd = `gh repo create ${org}/${repoName} ${visibility} --description "${description}" --clone=false`;
      
      Logger.log(`[GitHubApi] Creating repository with gh CLI: ${cmd}`, 'info');
      const output = execSync(cmd, { encoding: 'utf8' });
      
      // Parse gh CLI output to extract repository info
      const repoUrl = `https://github.com/${org}/${repoName}`;
      
      return {
        name: repoName,
        fullName: `${org}/${repoName}`,
        htmlUrl: repoUrl,
        cloneUrl: `${repoUrl}.git`,
        sshUrl: `git@github.com:${org}/${repoName}.git`
      };
    } catch (error) {
      Logger.log(`[GitHubApi] gh CLI repository creation failed: ${error}`, 'error');
      throw new Error(`Failed to create repository ${org}/${repoName} via gh CLI: ${error}`);
    }
  }

  /**
   * Create repository using @octokit/rest (fallback)
   */
  private async createRepositoryWithOctokit(org: string, repoName: string, isPrivate: boolean, description: string): Promise<GitHubRepository> {
    try {
      // Dynamic import for @octokit/rest
      const { Octokit } = await import('@octokit/rest');
      
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
      });

      Logger.log(`[GitHubApi] Creating repository with Octokit: ${org}/${repoName}`, 'info');
      
      const response = await octokit.rest.repos.createInOrg({
        org,
        name: repoName,
        private: isPrivate,
        description,
        auto_init: false
      });

      return {
        name: response.data.name,
        fullName: response.data.full_name,
        htmlUrl: response.data.html_url,
        cloneUrl: response.data.clone_url,
        sshUrl: response.data.ssh_url
      };
    } catch (error) {
      Logger.log(`[GitHubApi] Octokit repository creation failed: ${error}`, 'error');
      throw new Error(`Failed to create repository ${org}/${repoName} via Octokit: ${error}`);
    }
  }

  /**
   * Check if repository exists
   */
  async repositoryExists(org: string, repoName: string): Promise<boolean> {
    if (this.useGhCli) {
      try {
        execSync(`gh repo view ${org}/${repoName}`, { stdio: 'pipe' });
        return true;
      } catch {
        return false;
      }
    } else {
      try {
        const { Octokit } = await import('@octokit/rest');
        const octokit = new Octokit({
          auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN
        });
        
        await octokit.rest.repos.get({ owner: org, repo: repoName });
        return true;
      } catch {
        return false;
      }
    }
  }
}
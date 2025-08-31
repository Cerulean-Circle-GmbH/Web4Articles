import { execSync } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import type { Project } from '../layer3/Project.ts';
import { ParameterParser } from '../layer1/ParameterParser.ts';
import type { CLI } from '../layer3/CLI.ts';
import { DefaultCLI } from './DefaultCLI.ts';
import { GitHubApi } from './GitHubApi.ts';
import { SubmoduleManager } from './SubmoduleManager.ts';
import { TemplateGenerator } from './TemplateGenerator.ts';
import { Logger } from '../layer1/Logger.ts';

export class GitScrumProject implements Project {
  private cli: CLI;

  constructor(cli?: CLI) {
    // Compose CLI interface using DefaultCLI by default
    this.cli = cli || new DefaultCLI(async (args: string[]) => await this.create(args));
  }

  // Static entry point for CLI usage
  static start(): void {
    // Developer first principles: resolve git root, set PATH, etc.
    // (execSync and path are now imported at the top for ESM compatibility)
    let gitRoot = process.env.GIT_ROOT;
    if (!gitRoot) {
      try {
        gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
        process.env.GIT_ROOT = gitRoot;
      } catch (e) {
        gitRoot = process.cwd();
      }
    }
    process.env.PATH = path.join(gitRoot, 'node_modules/.bin') + ':' + process.env.PATH;
    new GitScrumProject().cli.start();
  }

  // Project interface method
  public async create(args: string[]): Promise<void> {
    const parser = new ParameterParser(args);
    const parsed = parser.parse();
    const command = parsed.command || 'createProject';

    if (command === 'createTemplateRepo') {
      const argList = [parsed.type, parsed.projectName, ...(parsed.restArgs || [])].filter(
        (v) => typeof v === 'string' && v.length > 0
      ) as string[];
      const [org, newRepo, sourceRepoUrl, submodulePath] = argList;
      try {
        await this.createTemplateRepo(org, newRepo, sourceRepoUrl, submodulePath);
        return;
      } catch (error) {
        Logger.log(`[GitScrumProject] createTemplateRepo failed: ${error}`, 'error');
        process.exit(1);
      }
    }
    if (command === 'linkSource') {
      const [submodulePath, sourceRepoUrl, ref] = parsed.restArgs || [];
      return this.linkSource(submodulePath, sourceRepoUrl, ref);
    }
    if (command === 'overlayRun') {
      const [entryClass, method, ...rest] = parsed.restArgs || [];
      return this.overlayRun(entryClass, method, ...rest);
    }
    if (command === 'releasePlan') {
      const [repoType] = parsed.restArgs || [];
      return this.releasePlan(repoType);
    }

    const projectName = args[0] || 'Web4Scrum';
    this.createProject(projectName);
  }

  // CLI method to create a new project
  // add a defaultvalue for projectName: 'Web4Scrum'
  private createProject(projectName: string = 'Web4Scrum'): void {
    const submodulePath = `./${projectName}`;
    const repoUrl = `git@github.com:<YOUR_GITHUB_ORG_OR_USER>/${projectName}.git`;

    if (fs.existsSync(submodulePath)) {
      console.error(`Directory ${submodulePath} already exists.`);
      process.exit(1);
    }

    console.log(`Cloning current project as template for ${projectName}...`);
    execSync(`git clone --depth 1 . ${submodulePath}`);

    // Remove .git to detach from current repo
    fs.rmSync(`${submodulePath}/.git`, { recursive: true, force: true });

    console.log(`Initializing new git repo for ${projectName}...`);
    execSync(`git init`, { cwd: submodulePath });
    execSync(`git remote add origin ${repoUrl}`, { cwd: submodulePath });

    console.log(`Adding as submodule...`);
    execSync(`git submodule add ${repoUrl} ${projectName}`);

    console.log(`Subproject ${projectName} created as a submodule. Please push the new repo to GitHub manually if needed.`);
  }

  // New commands (implementation)
  private async createTemplateRepo(org?: string, newRepo?: string, sourceRepoUrl?: string, submodulePath?: string): Promise<void> {
    if (process.env.DRY_RUN === '1') {
      console.log(
        `DRY RUN: createTemplateRepo org=${org} newRepo=${newRepo} sourceRepoUrl=${sourceRepoUrl} submodulePath=${submodulePath}`
      );
      return;
    }

    // Validate required parameters
    if (!org || !newRepo || !sourceRepoUrl || !submodulePath) {
      Logger.log('[GitScrumProject] Missing required parameters for createTemplateRepo', 'error');
      console.error('Usage: GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> <submodulePath>');
      process.exit(1);
    }

    try {
      Logger.log(`[GitScrumProject] Creating template repository: ${org}/${newRepo}`, 'info');

      // 1. Initialize GitHub API and create repository
      const github = new GitHubApi();
      await github.init();
      
      // Check if repository already exists
      const exists = await github.repositoryExists(org, newRepo);
      if (exists) {
        Logger.log(`[GitScrumProject] Repository ${org}/${newRepo} already exists`, 'error');
        console.error(`Repository ${org}/${newRepo} already exists`);
        process.exit(1);
      }

      const repository = await github.createRepository(org, newRepo, {
        description: `Web4Articles template project: ${newRepo}`
      });

      Logger.log(`[GitScrumProject] GitHub repository created: ${repository.htmlUrl}`, 'info');

      // 2. Create temporary directory and clone current project as template
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gitscrumproject-'));
      const templateDir = path.join(tempDir, newRepo);
      
      Logger.log(`[GitScrumProject] Cloning current project to: ${templateDir}`, 'info');
      execSync(`git clone --depth 1 . ${templateDir}`, { stdio: 'inherit' });

      // 3. Remove .git directory and re-initialize
      fs.rmSync(path.join(templateDir, '.git'), { recursive: true, force: true });
      execSync('git init', { cwd: templateDir, stdio: 'inherit' });
      execSync(`git remote add origin ${repository.sshUrl}`, { cwd: templateDir, stdio: 'inherit' });

      // 4. Add submodule using SubmoduleManager
      const submoduleManager = new SubmoduleManager().init(templateDir);
      submoduleManager.addSubmodule({
        name: path.basename(submodulePath),
        path: submodulePath,
        url: sourceRepoUrl,
        branch: 'main'
      });

      // 5. Generate CI workflow, recovery docs, and README using TemplateGenerator
      const templateGenerator = new TemplateGenerator();
      
      templateGenerator.writeTemplate(
        templateDir,
        '.github/workflows/ci.yml',
        templateGenerator.generateCIWorkflow(submodulePath, sourceRepoUrl)
      );
      
      templateGenerator.writeTemplate(
        templateDir,
        'recovery.md',
        templateGenerator.generateRecoveryDoc(newRepo, sourceRepoUrl, submodulePath)
      );
      
      templateGenerator.writeTemplate(
        templateDir,
        'README.md',
        templateGenerator.generateReadmeAdditions(newRepo, sourceRepoUrl, submodulePath)
      );

      // 6. Initial commit and push
      Logger.log(`[GitScrumProject] Committing and pushing to ${repository.sshUrl}`, 'info');
      execSync('git add .', { cwd: templateDir, stdio: 'inherit' });
      execSync(`git commit -m "feat: initial template setup with ${submodulePath} submodule"`, { cwd: templateDir, stdio: 'inherit' });
      execSync('git branch -M main', { cwd: templateDir, stdio: 'inherit' });
      execSync('git push -u origin main', { cwd: templateDir, stdio: 'inherit' });

      // 7. Cleanup
      fs.rmSync(tempDir, { recursive: true, force: true });

      Logger.log(`[GitScrumProject] Template repository created successfully!`, 'info');
      console.log(`✅ Repository created: ${repository.htmlUrl}`);
      console.log(`✅ Submodule added: ${submodulePath} -> ${sourceRepoUrl}`);
      console.log(`✅ CI workflow and recovery docs generated`);
      console.log(`✅ Ready for development!`);

    } catch (error) {
      Logger.log(`[GitScrumProject] createTemplateRepo failed: ${error}`, 'error');
      console.error(`Failed to create template repository: ${error}`);
      process.exit(1);
    }
  }

  private linkSource(submodulePath?: string, sourceRepoUrl?: string, ref?: string): void {
    console.log('linkSource stub:', { submodulePath, sourceRepoUrl, ref });
  }

  private overlayRun(entryClass?: string, method?: string, ...args: string[]): void {
    console.log('overlayRun stub:', { entryClass, method, args });
  }

  private releasePlan(repoType?: string): void {
    console.log('releasePlan stub:', { repoType });
  }

  // New helper-tool commands exposed as static for DefaultCLI invocation
  static help(): void {
    console.log(`GitScrumProject CLI:
  GitScrumProject checkoutSubmodulesBranch <branch>
  GitScrumProject addSubmodule <repoUrl> <targetPath>
  GitScrumProject updateSubmodules
  GitScrumProject createTemplateRepo <org> <newRepo> <sourceRepoUrl> <submodulePath>
  GitScrumProject linkSource <submodulePath> <sourceRepoUrl> [ref]
  GitScrumProject overlayRun <entryClass> <method> [...args]
  GitScrumProject releasePlan <repoType>
`);
  }

  static checkoutSubmodulesBranch(branch: string = 'main'): void {
    const root = process.env.GIT_ROOT || process.cwd();
    const componentsDir = path.join(root, 'components');
    if (!fs.existsSync(componentsDir)) {
      console.error(`[GitScrumProject] components directory not found at ${componentsDir}`);
      process.exit(1);
    }
    const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const compPath = path.join(componentsDir, e.name);
      if (!fs.existsSync(path.join(compPath, '.git'))) {
        console.warn(`[GitScrumProject] skip ${compPath} (not a git repo)`);
        continue;
      }
      try {
        console.log(`[GitScrumProject] checkout ${e.name} -> ${branch}`);
        execSync('git fetch', { cwd: compPath, stdio: 'inherit' });
        execSync(`git checkout ${branch}`, { cwd: compPath, stdio: 'inherit' });
        execSync('git pull --ff-only', { cwd: compPath, stdio: 'inherit' });
      } catch (err) {
        console.error(`[GitScrumProject] failed to checkout ${branch} in ${e.name}: ${err}`);
      }
    }
  }

  static addSubmodule(repoUrl: string, targetPath: string): void {
    if (!repoUrl || !targetPath) {
      console.error('[GitScrumProject] addSubmodule requires <repoUrl> <targetPath>');
      process.exit(1);
    }
    const root = process.env.GIT_ROOT || process.cwd();
    const fullTarget = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
    const parentDir = path.dirname(fullTarget);
    fs.mkdirSync(parentDir, { recursive: true });
    console.log(`[GitScrumProject] Adding submodule: ${repoUrl} -> ${targetPath}`);
    execSync(`git submodule add ${repoUrl} ${targetPath}`, { cwd: root, stdio: 'inherit' });
  }

  static updateSubmodules(): void {
    const root = process.env.GIT_ROOT || process.cwd();
    console.log('[GitScrumProject] Updating submodules (remote, recursive)');
    execSync('git submodule init', { cwd: root, stdio: 'inherit' });
    execSync('git submodule update --remote --recursive', { cwd: root, stdio: 'inherit' });
  }
}

import { execSync } from 'child_process';
import path from 'path';
import * as fs from 'fs';
import type { Project } from '../layer3/Project.ts';
import { ParameterParser } from '../layer1/ParameterParser.ts';
import type { CLI } from '../layer3/CLI.ts';
import { DefaultCLI } from './DefaultCLI.ts';

export class GitScrumProject implements Project {
  private cli: CLI;

  constructor(cli?: CLI) {
    // Compose CLI interface using DefaultCLI by default
    this.cli = cli || new DefaultCLI((args: string[]) => this.create(args));
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
  public create(args: string[]): void {
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
}

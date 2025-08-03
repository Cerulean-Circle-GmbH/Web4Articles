#!/usr/bin/env ts-node
import { execSync } from 'child_process';
import * as fs from 'fs';

function usage() {
  console.log('Usage: create-subproject.ts create project [projectname:Web4Scrum]');
  process.exit(1);
}

const args = process.argv.slice(2);
if (args[0] !== 'create' || args[1] !== 'project') usage();
const projectName = args[2] || 'Web4Scrum';

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

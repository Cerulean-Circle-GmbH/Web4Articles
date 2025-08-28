/**
 * VersionManager - Web4 Semantic Version Management
 * Handles 4-part semantic versioning (major.minor.patch.build) with reset logic
 * Supports latest management and branch cherry-picking
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  build: number;
}

export class VersionManager {
  private projectRoot: string;
  private componentName: string;
  private componentsDir: string;
  private scriptsDir: string;

  constructor(projectRoot: string, componentName: string = 'Web4TSComponent') {
    this.projectRoot = projectRoot;
    this.componentName = componentName;
    this.componentsDir = path.join(projectRoot, 'components', componentName);
    this.scriptsDir = path.join(projectRoot, 'scripts/versions');
  }

  /**
   * Parse version string into semantic version object
   */
  private parseVersion(version: string): SemanticVersion {
    const parts = version.split('.');
    if (parts.length !== 4) {
      throw new Error(`Invalid version format: ${version}. Expected format: major.minor.patch.build (e.g., 0.1.0.0)`);
    }

    const [major, minor, patch, build] = parts.map(part => {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0) {
        throw new Error(`Invalid version number in ${version}: ${part}`);
      }
      return num;
    });

    return { major, minor, patch, build };
  }

  /**
   * Format semantic version object into version string
   */
  private formatVersion(semVer: SemanticVersion): string {
    return `${semVer.major}.${semVer.minor}.${semVer.patch}.${semVer.build}`;
  }

  /**
   * Get all existing versions for this component
   */
  private async getExistingVersions(): Promise<string[]> {
    if (!existsSync(this.componentsDir)) {
      return [];
    }

    try {
      const entries = await fs.readdir(this.componentsDir, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && entry.name.match(/^\d+\.\d+\.\d+\.\d+$/))
        .map(entry => entry.name)
        .sort((a, b) => {
          const aVer = this.parseVersion(a);
          const bVer = this.parseVersion(b);
          
          if (aVer.major !== bVer.major) return aVer.major - bVer.major;
          if (aVer.minor !== bVer.minor) return aVer.minor - bVer.minor;
          if (aVer.patch !== bVer.patch) return aVer.patch - bVer.patch;
          return aVer.build - bVer.build;
        });
    } catch (error) {
      return [];
    }
  }

  /**
   * Get the latest version (highest semantic version)
   */
  private async getLatestVersion(): Promise<string | null> {
    const versions = await this.getExistingVersions();
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }

  /**
   * Validate that a version exists
   */
  async validateVersionExists(version: string): Promise<boolean> {
    const versionDir = path.join(this.componentsDir, version);
    return existsSync(versionDir);
  }

  /**
   * Get next available version based on current highest version
   */
  private async getNextAvailableVersion(): Promise<string> {
    const latest = await this.getLatestVersion();
    if (!latest) {
      return '0.1.0.0';
    }
    
    return this.nextBuild(latest);
  }

  /**
   * Increment major version (resets minor, patch, build to 0)
   */
  nextMajor(currentVersion: string): string {
    const semVer = this.parseVersion(currentVersion);
    return this.formatVersion({
      major: semVer.major + 1,
      minor: 0,
      patch: 0,
      build: 0
    });
  }

  /**
   * Increment minor version (resets patch, build to 0)
   */
  nextMinor(currentVersion: string): string {
    const semVer = this.parseVersion(currentVersion);
    return this.formatVersion({
      major: semVer.major,
      minor: semVer.minor + 1,
      patch: 0,
      build: 0
    });
  }

  /**
   * Increment patch version (resets build to 0)
   */
  nextPatch(currentVersion: string): string {
    const semVer = this.parseVersion(currentVersion);
    return this.formatVersion({
      major: semVer.major,
      minor: semVer.minor,
      patch: semVer.patch + 1,
      build: 0
    });
  }

  /**
   * Increment build version (adds 1 to build)
   */
  nextBuild(currentVersion: string): string {
    const semVer = this.parseVersion(currentVersion);
    return this.formatVersion({
      major: semVer.major,
      minor: semVer.minor,
      patch: semVer.patch,
      build: semVer.build + 1
    });
  }

  /**
   * Set latest symlink to specific version and update main script symlink
   */
  async setLatest(version: string): Promise<boolean> {
    try {
      // Validate version exists
      if (!(await this.validateVersionExists(version))) {
        throw new Error(`Version ${version} does not exist`);
      }

      const latestPath = path.join(this.componentsDir, 'latest');
      const versionPath = path.join(this.componentsDir, version);
      
      // Remove existing latest symlink if it exists
      if (existsSync(latestPath)) {
        await fs.unlink(latestPath);
      }

      // Create new latest symlink
      await fs.symlink(path.relative(this.componentsDir, versionPath), latestPath);

      // Update main script symlink in scripts/versions/
      await this.updateMainScriptSymlink(version);

      return true;
    } catch (error) {
      console.error(`Error setting latest to ${version}:`, error);
      return false;
    }
  }

  /**
   * Update main script symlink (e.g., scripts/versions/web4tscomponent)
   */
  private async updateMainScriptSymlink(version: string): Promise<void> {
    const componentLower = this.componentName.toLowerCase();
    const mainScriptPath = path.join(this.scriptsDir, componentLower);
    const versionScriptPath = path.join(this.scriptsDir, `${componentLower}-v${version}`);

    // Create scripts/versions directory if it doesn't exist
    if (!existsSync(this.scriptsDir)) {
      await fs.mkdir(this.scriptsDir, { recursive: true });
    }

    // Remove existing main script symlink if it exists
    if (existsSync(mainScriptPath)) {
      await fs.unlink(mainScriptPath);
    }

    // Create main script symlink pointing to versioned script
    if (existsSync(versionScriptPath)) {
      await fs.symlink(path.relative(this.scriptsDir, versionScriptPath), mainScriptPath);
    }
  }

  /**
   * Create version-specific script symlink
   */
  async createVersionScriptSymlink(version: string): Promise<void> {
    const componentLower = this.componentName.toLowerCase();
    const scriptName = `${componentLower}-v${version}`;
    const scriptPath = path.join(this.scriptsDir, scriptName);
    const targetScript = path.join(this.componentsDir, version, `${componentLower}.sh`);

    // Create scripts/versions directory if it doesn't exist
    if (!existsSync(this.scriptsDir)) {
      await fs.mkdir(this.scriptsDir, { recursive: true });
    }

    // Remove existing symlink if it exists
    if (existsSync(scriptPath)) {
      await fs.unlink(scriptPath);
    }

    // Create symlink if target script exists
    if (existsSync(targetScript)) {
      const relativePath = path.relative(this.scriptsDir, targetScript);
      await fs.symlink(relativePath, scriptPath);
    }
  }

  /**
   * Cherry-pick component from another branch
   */
  async cherryPickFromBranch(branch: string, targetVersion?: string): Promise<string> {
    try {
      // Get current branch
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { 
        cwd: this.projectRoot, 
        encoding: 'utf8' 
      }).trim();

      // Determine target version
      const version = targetVersion || await this.getNextAvailableVersion();
      
      // Validate target version doesn't exist
      if (await this.validateVersionExists(version)) {
        throw new Error(`Version ${version} already exists`);
      }

      const targetDir = path.join(this.componentsDir, version);
      const tempDir = path.join(this.componentsDir, `temp-${version}`);

      console.log(`🔄 Checking out branch: ${branch}`);
      execSync(`git checkout ${branch}`, { cwd: this.projectRoot });

      // Get the latest version from the branch
      const branchLatest = await this.getLatestVersion();
      if (!branchLatest) {
        throw new Error(`No versions found on branch ${branch}`);
      }

      const sourceDir = path.join(this.componentsDir, branchLatest);
      if (!existsSync(sourceDir)) {
        throw new Error(`Source directory ${sourceDir} does not exist on branch ${branch}`);
      }

      console.log(`📋 Copying ${branchLatest} from ${branch} as ${version}`);

      // Switch back to original branch
      execSync(`git checkout ${currentBranch}`, { cwd: this.projectRoot });

      // Now copy the directory from the other branch using git show
      await fs.mkdir(tempDir, { recursive: true });
      
      try {
        // Get file list from source directory
        const gitFiles = execSync(
          `git ls-tree -r --name-only ${branch} -- components/${this.componentName}/${branchLatest}`,
          { cwd: this.projectRoot, encoding: 'utf8' }
        ).split('\n').filter(file => file.trim());

        // Copy each file
        for (const file of gitFiles) {
          if (!file.trim()) continue;
          
          const content = execSync(
            `git show ${branch}:${file}`,
            { cwd: this.projectRoot, encoding: 'utf8' }
          );
          
          const targetFile = file.replace(
            `components/${this.componentName}/${branchLatest}`,
            `components/${this.componentName}/temp-${version}`
          );
          
          const targetPath = path.join(this.projectRoot, targetFile);
          const targetDirPath = path.dirname(targetPath);
          
          await fs.mkdir(targetDirPath, { recursive: true });
          await fs.writeFile(targetPath, content);
        }

        // Move temp directory to final location
        await fs.rename(tempDir, targetDir);

        // Update version-specific files
        await this.updateVersionInFiles(version);

        // Create script symlink
        await this.createVersionScriptSymlink(version);

        console.log(`✅ Successfully cherry-picked ${branchLatest} from ${branch} as ${version}`);
        return version;

      } catch (copyError) {
        // Cleanup temp directory if it exists
        if (existsSync(tempDir)) {
          await fs.rm(tempDir, { recursive: true });
        }
        throw copyError;
      }

    } catch (error) {
      // Make sure we're back on the original branch
      try {
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { 
          cwd: this.projectRoot, 
          encoding: 'utf8' 
        }).trim();
        if (currentBranch !== branch) {
          execSync('git checkout -', { cwd: this.projectRoot });
        }
      } catch {
        // Ignore checkout errors during cleanup
      }
      throw error;
    }
  }

  /**
   * Update version in component files (package.json, README.md)
   */
  private async updateVersionInFiles(version: string): Promise<void> {
    const versionDir = path.join(this.componentsDir, version);
    
    // Update package.json
    const packageJsonPath = path.join(versionDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      packageJson.version = version;
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Update README.md version in headline
    const readmePath = path.join(versionDir, 'README.md');
    if (existsSync(readmePath)) {
      let readmeContent = await fs.readFile(readmePath, 'utf8');
      // Replace version in first headline (e.g., "# Web4TSComponent v0.1.0.0" -> "# Web4TSComponent v0.1.0.3")
      readmeContent = readmeContent.replace(
        /^(# \w+TSComponent\s+)v\d+\.\d+\.\d+\.\d+/m,
        `$1v${version}`
      );
      await fs.writeFile(readmePath, readmeContent);
    }

    // Update shell script version
    const componentLower = this.componentName.toLowerCase();
    const shellScriptPath = path.join(versionDir, `${componentLower}.sh`);
    if (existsSync(shellScriptPath)) {
      let shellContent = await fs.readFile(shellScriptPath, 'utf8');
      // Update COMPONENT_VERSION variable
      shellContent = shellContent.replace(
        /^COMPONENT_VERSION="[^"]*"/m,
        `COMPONENT_VERSION="${version}"`
      );
      await fs.writeFile(shellScriptPath, shellContent);
    }
  }

  /**
   * Get current version info
   */
  async getVersionInfo(): Promise<{
    latest: string | null;
    available: string[];
    nextMajor: string | null;
    nextMinor: string | null;
    nextPatch: string | null;
    nextBuild: string | null;
  }> {
    const latest = await this.getLatestVersion();
    const available = await this.getExistingVersions();

    return {
      latest,
      available,
      nextMajor: latest ? this.nextMajor(latest) : null,
      nextMinor: latest ? this.nextMinor(latest) : null,
      nextPatch: latest ? this.nextPatch(latest) : null,
      nextBuild: latest ? this.nextBuild(latest) : null,
    };
  }
}

import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import { DefaultPDCA } from '../src/ts/layer2/DefaultPDCA';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('PDCA moveFile Tests', () => {
  const testDataDir = 'components/PDCA/0.2.3.0/test/data/move-tests';
  
  beforeAll(() => {
    // Create test data directory
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
  });

  afterAll(() => {
    // Cleanup: Remove test data directory
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  test('TC30: moveFile - move file within same directory', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create test file
    const oldPath = `${testDataDir}/original-name.md`;
    const newPath = `${testDataDir}/renamed.md`;
    fs.writeFileSync(oldPath, '# Test file\nContent here.');
    
    // Need to add to git first for git mv to work
    try {
      execSync(`git add "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add file for TC30" --no-verify`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git push`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // File might already be committed, that's okay
    }
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(fs.existsSync(newPath)).toBe(true);
    expect(fs.existsSync(oldPath)).toBe(false);
    
    // Cleanup: Delete the moved file
    if (fs.existsSync(newPath)) {
      try {
        execSync(`git rm "${newPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
        execSync(`git commit -m "test: cleanup TC30" --no-verify`, { cwd: process.cwd(), stdio: 'pipe' });
        execSync(`git push`, { cwd: process.cwd(), stdio: 'pipe' });
      } catch (e) {
        // Cleanup failed, file might already be removed
      }
    }
  });

  test('TC31: moveFile - move file to different directory', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const sourceDir = `${testDataDir}/source`;
    const destDir = `${testDataDir}/destination`;
    const oldPath = `${sourceDir}/file.md`;
    const newPath = `${destDir}/file.md`;
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(oldPath, '# Test file');
    
    // Add to git
    try {
      execSync(`git add "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add file for TC31"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(fs.existsSync(newPath)).toBe(true);
    expect(fs.existsSync(oldPath)).toBe(false);
    
    // Cleanup
    if (fs.existsSync(newPath)) {
      execSync(`git rm "${newPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: cleanup TC31"`, { cwd: process.cwd(), stdio: 'pipe' });
    }
  });

  test('TC32: moveFile - updates links in other files', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create target file and file linking to it
    const oldPath = `${testDataDir}/target.md`;
    const newPath = `${testDataDir}/moved/target.md`;
    const linkingFile = `${testDataDir}/linker.md`;
    
    fs.mkdirSync(`${testDataDir}/moved`, { recursive: true });
    fs.writeFileSync(oldPath, '# Target');
    fs.writeFileSync(linkingFile, 
      `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/${oldPath}) | [§/${oldPath}](${oldPath})`
    );
    
    // Add to git
    try {
      execSync(`git add "${oldPath}" "${linkingFile}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add files for TC32"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify: linker.md should have updated link
    const content = fs.readFileSync(linkingFile, 'utf-8');
    expect(content).toContain(newPath);
    expect(content).not.toContain(`§/${oldPath}`);
    
    // Cleanup
    if (fs.existsSync(newPath)) {
      execSync(`git rm "${newPath}" "${linkingFile}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: cleanup TC32"`, { cwd: process.cwd(), stdio: 'pipe' });
    }
  });

  test('TC33: moveFile - refreshes relative links in moved file', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Create file with relative links
    const sourceDir = `${testDataDir}/source`;
    const destDir = `${testDataDir}/destination/subdir`;
    const oldPath = `${sourceDir}/doc.md`;
    const newPath = `${destDir}/doc.md`;
    const referenceFile = `${testDataDir}/reference.md`;
    
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(referenceFile, '# Reference');
    fs.writeFileSync(oldPath,
      `[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-10-17-UTC-0747/${referenceFile}) | [§/${referenceFile}](../reference.md)`
    );
    
    // Add to git
    try {
      execSync(`git add "${oldPath}" "${referenceFile}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add files for TC33"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify: Relative path should be recalculated
    const content = fs.readFileSync(newPath, 'utf-8');
    expect(content).toContain('../../reference.md'); // New relative path from destination/subdir to root
    expect(content).not.toContain('../reference.md'); // Old relative path
    
    // Cleanup
    if (fs.existsSync(newPath)) {
      execSync(`git rm "${newPath}" "${referenceFile}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: cleanup TC33"`, { cwd: process.cwd(), stdio: 'pipe' });
    }
  });

  test('TC34: moveFile - dry run does not modify files', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup
    const oldPath = `${testDataDir}/stay.md`;
    const newPath = `${testDataDir}/not-created.md`;
    fs.writeFileSync(oldPath, '# Test');
    
    // Add to git
    try {
      execSync(`git add "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add file for TC34"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    // Execute dry run
    await pdca.moveFile(oldPath, newPath, 'true');
    
    // Verify: Nothing changed
    expect(fs.existsSync(oldPath)).toBe(true); // Still exists
    expect(fs.existsSync(newPath)).toBe(false); // Not created
    
    // Cleanup
    execSync(`git rm "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
    execSync(`git commit -m "test: cleanup TC34"`, { cwd: process.cwd(), stdio: 'pipe' });
  });

  test('TC35: moveFile - error when source file does not exist', async () => {
    const pdca = new DefaultPDCA();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Execute
    await pdca.moveFile('nonexistent.md', 'destination.md');
    
    // Verify
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Source file not found')
    );
    
    consoleSpy.mockRestore();
  });

  test('TC36: moveFile - error when destination already exists', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: Both files exist
    const oldPath = `${testDataDir}/source.md`;
    const newPath = `${testDataDir}/existing.md`;
    fs.writeFileSync(oldPath, '# Source');
    fs.writeFileSync(newPath, '# Already exists');
    
    // Add to git
    try {
      execSync(`git add "${oldPath}" "${newPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add files for TC36"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Destination file already exists')
    );
    
    // Both files should still exist
    expect(fs.existsSync(oldPath)).toBe(true);
    expect(fs.existsSync(newPath)).toBe(true);
    
    consoleSpy.mockRestore();
    
    // Cleanup
    execSync(`git rm "${oldPath}" "${newPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
    execSync(`git commit -m "test: cleanup TC36"`, { cwd: process.cwd(), stdio: 'pipe' });
  });

  test('TC37: moveFile - error when destination directory does not exist', async () => {
    const pdca = new DefaultPDCA();
    
    const oldPath = `${testDataDir}/file.md`;
    const newPath = `${testDataDir}/nonexistent-dir/file.md`;
    fs.writeFileSync(oldPath, '# Test');
    
    // Add to git
    try {
      execSync(`git add "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add file for TC37"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Destination directory does not exist')
    );
    
    consoleSpy.mockRestore();
    
    // Cleanup
    execSync(`git rm "${oldPath}"`, { cwd: process.cwd(), stdio: 'pipe' });
    execSync(`git commit -m "test: cleanup TC37"`, { cwd: process.cwd(), stdio: 'pipe' });
  });

  test('TC38: moveFile - handles file with multiple incoming and outgoing links', async () => {
    const pdca = new DefaultPDCA();
    
    // Setup: File with links to others AND others link to it
    const oldPath = `${testDataDir}/hub.md`;
    const newPath = `${testDataDir}/archive/hub.md`;
    const ref1 = `${testDataDir}/ref1.md`;
    const ref2 = `${testDataDir}/ref2.md`;
    const linker1 = `${testDataDir}/linker1.md`;
    const linker2 = `${testDataDir}/linker2.md`;
    
    fs.mkdirSync(`${testDataDir}/archive`, { recursive: true });
    fs.writeFileSync(ref1, '# Ref1');
    fs.writeFileSync(ref2, '# Ref2');
    fs.writeFileSync(oldPath, `# Hub
[Link to ref1](ref1.md)
[Link to ref2](ref2.md)
    `);
    fs.writeFileSync(linker1, `[Link to hub](hub.md)`);
    fs.writeFileSync(linker2, `[Link to hub](hub.md)`);
    
    // Add to git
    try {
      execSync(`git add "${oldPath}" "${ref1}" "${ref2}" "${linker1}" "${linker2}"`, { cwd: process.cwd(), stdio: 'pipe' });
      execSync(`git commit -m "test: add files for TC38"`, { cwd: process.cwd(), stdio: 'pipe' });
    } catch (e) {
      // Ignore
    }
    
    // Execute
    await pdca.moveFile(oldPath, newPath);
    
    // Verify: All links updated correctly
    const hubContent = fs.readFileSync(newPath, 'utf-8');
    expect(hubContent).toContain('../ref1.md'); // Relative paths updated
    expect(hubContent).toContain('../ref2.md');
    
    const linker1Content = fs.readFileSync(linker1, 'utf-8');
    const linker2Content = fs.readFileSync(linker2, 'utf-8');
    expect(linker1Content).toContain('archive/hub.md'); // Incoming links updated
    expect(linker2Content).toContain('archive/hub.md');
    
    // Cleanup
    execSync(`git rm "${newPath}" "${ref1}" "${ref2}" "${linker1}" "${linker2}"`, { cwd: process.cwd(), stdio: 'pipe' });
    execSync(`git commit -m "test: cleanup TC38"`, { cwd: process.cwd(), stdio: 'pipe' });
  });
});


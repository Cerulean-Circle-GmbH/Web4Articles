#!/usr/bin/env node

/**
 * Global Quality Violations Scanner
 * Scans repository for merge conflicts, CJS violations, and require() usage
 * Generates comprehensive violation report with fix tracking
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class QualityViolationsScanner {
    constructor() {
        this.workspaceRoot = path.resolve(__dirname, '..');
        this.violations = {
            mergeConflicts: [],
            cjsFiles: [],
            requireStatements: [],
            summary: {
                totalViolations: 0,
                criticalViolations: 0,
                highViolations: 0,
                mediumViolations: 0,
                lowViolations: 0
            }
        };
        this.reportFile = path.join(this.workspaceRoot, 'test', 'quality-violations-report.md');
    }

    /**
     * Execute git/grep commands safely
     */
    execCommand(command, options = {}) {
        try {
            return execSync(command, { 
                encoding: 'utf8', 
                cwd: this.workspaceRoot,
                ...options 
            }).trim();
        } catch (error) {
            if (error.status === 1) {
                // No matches found - this is normal for grep
                return '';
            }
            throw error;
        }
    }

    /**
     * Scan for merge conflict markers
     */
    scanMergeConflicts() {
        console.log('🔍 Scanning for merge conflicts...');
        
        const conflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'];
        
        conflictMarkers.forEach(marker => {
            const result = this.execCommand(`grep -r "${marker}" --exclude-dir=.git --exclude-dir=node_modules .`);
            
            if (result) {
                const lines = result.split('\n').filter(line => line.trim());
                
                lines.forEach(line => {
                    const [filePath, ...contentParts] = line.split(':');
                    const content = contentParts.join(':').trim();
                    
                    this.violations.mergeConflicts.push({
                        file: filePath.replace('./', ''),
                        marker: marker,
                        content: content,
                        priority: 'CRITICAL',
                        status: 'PENDING',
                        estimatedFixTime: '15-30 minutes'
                    });
                });
            }
        });
    }

    /**
     * Scan for CJS files
     */
    scanCjsFiles() {
        console.log('🔍 Scanning for CJS files...');
        
        const result = this.execCommand(`find . -name "*.cjs" -type f`);
        
        if (result) {
            const files = result.split('\n').filter(file => file.trim());
            
            files.forEach(file => {
                const filePath = file.replace('./', '');
                const stats = fs.statSync(path.join(this.workspaceRoot, filePath));
                const sizeKB = Math.round(stats.size / 1024);
                
                this.violations.cjsFiles.push({
                    file: filePath,
                    size: `${sizeKB}KB`,
                    priority: 'CRITICAL',
                    status: 'PENDING',
                    violationType: 'CommonJS Module',
                    solution: 'Convert to ES module',
                    estimatedFixTime: sizeKB > 10 ? '2-4 hours' : '30-60 minutes'
                });
            });
        }
    }

    /**
     * Scan for require() statements
     */
    scanRequireStatements() {
        console.log('🔍 Scanning for require() statements...');
        
        const result = this.execCommand(`grep -r "require(" --include="*.js" --include="*.ts" --include="*.md" --exclude-dir=.git --exclude-dir=node_modules .`);
        
        if (result) {
            const lines = result.split('\n').filter(line => line.trim());
            
            const fileGroups = {};
            
            lines.forEach(line => {
                const [filePath, ...contentParts] = line.split(':');
                const content = contentParts.join(':').trim();
                const cleanPath = filePath.replace('./', '');
                
                if (!fileGroups[cleanPath]) {
                    fileGroups[cleanPath] = {
                        file: cleanPath,
                        occurrences: 0,
                        examples: [],
                        priority: this.getPriorityForRequire(cleanPath),
                        status: 'PENDING',
                        violationType: 'require() statement',
                        solution: 'Convert to import statement',
                        estimatedFixTime: '5-15 minutes per occurrence'
                    };
                }
                
                fileGroups[cleanPath].occurrences++;
                if (fileGroups[cleanPath].examples.length < 3) {
                    fileGroups[cleanPath].examples.push(content);
                }
            });
            
            this.violations.requireStatements = Object.values(fileGroups);
        }
    }

    /**
     * Determine priority for require() statements based on file type
     */
    getPriorityForRequire(filePath) {
        if (filePath.includes('components/') && (filePath.endsWith('.ts') || filePath.endsWith('.js'))) {
            return 'HIGH';
        } else if (filePath.includes('.md') || filePath.includes('project.journal/')) {
            return 'MEDIUM';
        } else if (filePath.includes('test/') || filePath.includes('examples/') || filePath.includes('demo')) {
            return 'LOW';
        } else {
            return 'MEDIUM';
        }
    }

    /**
     * Calculate summary statistics
     */
    calculateSummary() {
        const allViolations = [
            ...this.violations.mergeConflicts,
            ...this.violations.cjsFiles,
            ...this.violations.requireStatements
        ];

        this.violations.summary.totalViolations = allViolations.length;
        this.violations.summary.criticalViolations = allViolations.filter(v => v.priority === 'CRITICAL').length;
        this.violations.summary.highViolations = allViolations.filter(v => v.priority === 'HIGH').length;
        this.violations.summary.mediumViolations = allViolations.filter(v => v.priority === 'MEDIUM').length;
        this.violations.summary.lowViolations = allViolations.filter(v => v.priority === 'LOW').length;
    }

    /**
     * Generate markdown report
     */
    generateReport() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        
        let report = `# 🔍 **Global Quality Violations Report**

**📅 Generated:** ${new Date().toISOString().replace('T', '-UTC-').slice(0, -5)}  
**🎯 Scan Scope:** Complete repository quality assessment  
**🚨 Status:** ${this.violations.summary.totalViolations > 0 ? 'VIOLATIONS DETECTED' : 'CLEAN'}  

---

## **📊 EXECUTIVE SUMMARY**

| Violation Category | Count | Priority Distribution | Fix Time Estimate |
|-------------------|-------|---------------------|-------------------|
| **🚨 Merge Conflicts** | ${this.violations.mergeConflicts.length} | Critical: ${this.violations.mergeConflicts.length} | ${this.violations.mergeConflicts.length * 20} minutes |
| **📦 CJS Files** | ${this.violations.cjsFiles.length} | Critical: ${this.violations.cjsFiles.length} | ${this.violations.cjsFiles.length * 120} minutes |
| **⚡ Require Statements** | ${this.violations.requireStatements.length} files | High: ${this.violations.summary.highViolations}, Med: ${this.violations.summary.mediumViolations}, Low: ${this.violations.summary.lowViolations} | Variable per file |
| **📈 TOTAL VIOLATIONS** | **${this.violations.summary.totalViolations}** | 🔥 Critical: ${this.violations.summary.criticalViolations}, 🟡 High: ${this.violations.summary.highViolations}, 🔵 Medium: ${this.violations.summary.mediumViolations}, ⚪ Low: ${this.violations.summary.lowViolations} | **${Math.round((this.violations.mergeConflicts.length * 20 + this.violations.cjsFiles.length * 120) / 60)} hours** |

---

## **🚨 CRITICAL VIOLATIONS - IMMEDIATE ACTION REQUIRED**

### **🔥 Merge Conflicts (${this.violations.mergeConflicts.length} files)**

${this.violations.mergeConflicts.length > 0 ? 
`| File | Marker | Preview | Status | Fix Time | Action Required |
|------|--------|---------|--------|----------|----------------|
${this.violations.mergeConflicts.map(conflict => 
    `| \`${conflict.file}\` | \`${conflict.marker}\` | \`${conflict.content.substring(0, 50)}...\` | ❌ ${conflict.status} | ${conflict.estimatedFixTime} | Manual resolution required |`
).join('\n')}` : 
'✅ **No merge conflicts detected**'}

### **📦 CommonJS Files (${this.violations.cjsFiles.length} files)**

${this.violations.cjsFiles.length > 0 ?
`| File | Size | Priority | Status | Solution | Fix Time | Web4 Compliance |
|------|------|----------|--------|----------|----------|----------------|
${this.violations.cjsFiles.map(cjs => 
    `| \`${cjs.file}\` | ${cjs.size} | 🔥 ${cjs.priority} | ❌ ${cjs.status} | ${cjs.solution} | ${cjs.estimatedFixTime} | Non-compliant |`
).join('\n')}` :
'✅ **No CJS files detected**'}

---

## **⚡ REQUIRE() STATEMENT VIOLATIONS**

### **🔧 High Priority - Components (${this.violations.requireStatements.filter(r => r.priority === 'HIGH').length} files)**

${this.violations.requireStatements.filter(r => r.priority === 'HIGH').length > 0 ?
`| File | Occurrences | Example | Status | Solution | Priority |
|------|-------------|---------|--------|----------|----------|
${this.violations.requireStatements.filter(r => r.priority === 'HIGH').map(req => 
    `| \`${req.file}\` | ${req.occurrences} | \`${req.examples[0] || 'N/A'}\` | ❌ ${req.status} | ${req.solution} | 🟡 ${req.priority} |`
).join('\n')}` :
'✅ **No high priority require() violations**'}

### **📝 Medium Priority - Documentation (${this.violations.requireStatements.filter(r => r.priority === 'MEDIUM').length} files)**

${this.violations.requireStatements.filter(r => r.priority === 'MEDIUM').length > 0 ?
`| File | Occurrences | Example | Status | Solution | Priority |
|------|-------------|---------|--------|----------|----------|
${this.violations.requireStatements.filter(r => r.priority === 'MEDIUM').slice(0, 10).map(req => 
    `| \`${req.file}\` | ${req.occurrences} | \`${req.examples[0] || 'N/A'}\` | ❌ ${req.status} | ${req.solution} | 🔵 ${req.priority} |`
).join('\n')}
${this.violations.requireStatements.filter(r => r.priority === 'MEDIUM').length > 10 ? `\n*...and ${this.violations.requireStatements.filter(r => r.priority === 'MEDIUM').length - 10} more files*` : ''}` :
'✅ **No medium priority require() violations**'}

### **🧪 Low Priority - Tests/Demos (${this.violations.requireStatements.filter(r => r.priority === 'LOW').length} files)**

${this.violations.requireStatements.filter(r => r.priority === 'LOW').length > 0 ?
`| File | Occurrences | Example | Status | Solution | Priority |
|------|-------------|---------|--------|----------|----------|
${this.violations.requireStatements.filter(r => r.priority === 'LOW').slice(0, 5).map(req => 
    `| \`${req.file}\` | ${req.occurrences} | \`${req.examples[0] || 'N/A'}\` | ❌ ${req.status} | ${req.solution} | ⚪ ${req.priority} |`
).join('\n')}
${this.violations.requireStatements.filter(r => r.priority === 'LOW').length > 5 ? `\n*...and ${this.violations.requireStatements.filter(r => r.priority === 'LOW').length - 5} more files*` : ''}` :
'✅ **No low priority require() violations**'}

---

## **📈 FIX TRACKING DASHBOARD**

### **🎯 Resolution Progress**

| Category | Total | Pending | In Progress | Completed | Success Rate |
|----------|-------|---------|-------------|-----------|--------------|
| Merge Conflicts | ${this.violations.mergeConflicts.length} | ${this.violations.mergeConflicts.length} | 0 | 0 | 0% |
| CJS Files | ${this.violations.cjsFiles.length} | ${this.violations.cjsFiles.length} | 0 | 0 | 0% |
| Require Statements | ${this.violations.requireStatements.length} | ${this.violations.requireStatements.length} | 0 | 0 | 0% |
| **TOTAL** | **${this.violations.summary.totalViolations}** | **${this.violations.summary.totalViolations}** | **0** | **0** | **0%** |

### **🏃‍♂️ Next Actions Required**

1. **🔥 IMMEDIATE:** Resolve ${this.violations.mergeConflicts.length} merge conflicts (Critical)
2. **🚀 HIGH:** Convert ${this.violations.cjsFiles.length} CJS files to ES modules (Critical)
3. **🔧 MEDIUM:** Fix ${this.violations.summary.highViolations} high-priority require() statements
4. **📝 LOW:** Update ${this.violations.summary.mediumViolations + this.violations.summary.lowViolations} documentation/test require() examples

---

## **🛠️ AUTOMATED COMMANDS FOR FIXES**

### **Merge Conflict Detection**
\`\`\`bash
# Re-scan for merge conflicts
grep -r "<<<<<<<\\|=======\\|>>>>>>>" --exclude-dir=.git --exclude-dir=node_modules .
\`\`\`

### **CJS File Conversion**
\`\`\`bash
# Find all CJS files
find . -name "*.cjs" -type f
\`\`\`

### **Require Statement Detection**
\`\`\`bash
# Find all require() statements
grep -r "require(" --include="*.js" --include="*.ts" --include="*.md" --exclude-dir=.git --exclude-dir=node_modules .
\`\`\`

### **Run Quality Scanner**
\`\`\`bash
# Re-run this scanner
node test/quality-violations-scanner.js
\`\`\`

---

## **📊 WEB4 COMPLIANCE STATUS**

| Standard | Current Status | Target | Actions Required |
|----------|---------------|---------|-----------------|
| ES Modules Only | ❌ ${this.violations.cjsFiles.length} CJS files detected | ✅ Zero CJS files | Convert all CJS to ES modules |
| Import Statements | ❌ ${this.violations.requireStatements.length} files with require() | ✅ Import/from only | Replace require() with import |
| Clean Repository | ❌ ${this.violations.mergeConflicts.length} merge conflicts | ✅ No conflicts | Resolve all merge conflicts |
| **Overall Compliance** | **❌ NON-COMPLIANT** | **✅ WEB4 COMPLIANT** | **Fix ${this.violations.summary.totalViolations} violations** |

---

**🔄 Auto-generated by Quality Violations Scanner**  
**📅 Last Updated:** ${timestamp}  
**🔍 Scan Command:** \`node test/quality-violations-scanner.js\`

**"Never 2 1 (TO ONE). Always 4 2 (FOR TWO)."** - Web4 quality compliance for systematic excellence! 🤝✨
`;

        return report;
    }

    /**
     * Write report to file
     */
    writeReport(reportContent) {
        // Ensure test directory exists
        const testDir = path.join(this.workspaceRoot, 'test');
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        fs.writeFileSync(this.reportFile, reportContent, 'utf8');
        console.log(`✅ Quality violations report generated: ${this.reportFile}`);
    }

    /**
     * Run complete scan
     */
    async scan() {
        console.log('🚀 Starting Global Quality Violations Scan...\n');

        this.scanMergeConflicts();
        this.scanCjsFiles();
        this.scanRequireStatements();
        this.calculateSummary();

        const report = this.generateReport();
        this.writeReport(report);

        console.log('\n📊 SCAN SUMMARY:');
        console.log(`🚨 Merge Conflicts: ${this.violations.mergeConflicts.length}`);
        console.log(`📦 CJS Files: ${this.violations.cjsFiles.length}`);
        console.log(`⚡ Files with require(): ${this.violations.requireStatements.length}`);
        console.log(`📈 Total Violations: ${this.violations.summary.totalViolations}`);

        if (this.violations.summary.totalViolations > 0) {
            console.log('\n🚨 QUALITY VIOLATIONS DETECTED - See report for details!');
            return 1; // Exit with error code for CI/CD
        } else {
            console.log('\n✅ REPOSITORY IS CLEAN - No violations detected!');
            return 0;
        }
    }
}

// Run scanner if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const scanner = new QualityViolationsScanner();
    scanner.scan().then(exitCode => {
        process.exit(exitCode);
    }).catch(error => {
        console.error('❌ Scanner failed:', error.message);
        process.exit(1);
    });
}

export default QualityViolationsScanner;

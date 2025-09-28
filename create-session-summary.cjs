// Simple Node.js script to create session summary from SaveRestartAgent PDCAs
const fs = require('fs');
const path = require('path');

// Simple SessionSummary functionality to analyze SaveRestartAgent PDCAs
class SimpleSessionSummary {
  findPDCAFiles(dir) {
    const files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isFile() && entry.name.endsWith('.pdca.md')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${dir}: ${error.message}`);
    }
    return files.sort();
  }

  analyzePDCA(filename) {
    try {
      const content = fs.readFileSync(filename, 'utf8');
      const baseName = path.basename(filename, '.pdca.md');
      
      // Extract PDCA title
      const titleMatch = content.match(/# 📋 \*\*PDCA Cycle: ([^*]+) - ([^*]+)\*\*/);
      const title = titleMatch ? `${titleMatch[1]} - ${titleMatch[2]}` : baseName;
      
      // Extract TRON feedback
      const tronMatch = content.match(/### \*\*TRON Feedback[^`]*```quote\n([\s\S]*?)\n```/);
      const tronFeedback = tronMatch ? tronMatch[1].trim() : '';
      
      // Extract timestamp from filename
      const timeMatch = baseName.match(/(\d{4}-\d{2}-\d{2}-UTC-\d{4})/);
      const timestamp = timeMatch ? timeMatch[1] : '';
      
      return {
        filename: path.basename(filename),
        title,
        tronFeedback,
        timestamp,
        relativePath: path.relative('/workspace', filename)
      };
    } catch (error) {
      console.warn(`Error analyzing ${filename}: ${error.message}`);
      return null;
    }
  }

  generateSummary(pdcaDir, outputFile) {
    console.log(`🔍 Analyzing PDCAs in: ${pdcaDir}`);
    const files = this.findPDCAFiles(pdcaDir);
    console.log(`📋 Found ${files.length} PDCA files`);
    
    const analyses = files.map(file => this.analyzePDCA(file)).filter(Boolean);
    
    let summary = `# SaveRestartAgent Session Summary\n\n`;
    summary += `**🗓️ Generated:** ${new Date().toISOString()}\n`;
    summary += `**📁 PDCA Directory:** ${pdcaDir}\n`;
    summary += `**📊 PDCAs Analyzed:** ${analyses.length}\n\n`;
    
    summary += `| **UTC Time** | **PDCA File** | **Title** | **TRON Feedback** |\n`;
    summary += `|--------------|---------------|-----------|-------------------|\n`;
    
    for (const analysis of analyses) {
      const escapedTitle = analysis.title.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      const escapedFeedback = analysis.tronFeedback.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      const githubUrl = `https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/2025-09-27-UTC-2251/${analysis.relativePath}`;
      
      summary += `| **${analysis.timestamp}** | [GitHub](${githubUrl}) \\| [§/${analysis.relativePath}](${analysis.relativePath}) | ${escapedTitle} | ${escapedFeedback} |\n`;
    }
    
    fs.writeFileSync(outputFile, summary);
    console.log(`✅ Session summary created: ${outputFile}`);
    
    return {
      sessionName: 'SaveRestartAgent PDCAs',
      totalPDCAs: analyses.length,
      analyses,
      generatedPath: outputFile
    };
  }
}

// Execute summary generation
const summary = new SimpleSessionSummary();
const pdcaDir = '/workspace/scrum.pmo/roles/SaveRestartAgent/pdca';
const outputFile = '/workspace/scrum.pmo/project.journal/2025-09-27-UTC-2252-session/saverestartage-pdca-session-summary.md';

// Execute summary generation
summary.generateSummary(pdcaDir, outputFile);
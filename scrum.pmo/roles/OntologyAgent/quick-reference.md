[Back to OntologyAgent Role](../)

# OntologyAgent Quick Reference

## Role Summary
Guardian of conceptual clarity and semantic consistency across Web4x ecosystem. Maintains CMM Level 4 compliance through well-defined components and automated feedback loops.

## Core Responsibilities
- 🔍 **Ontology Management**: Maintain comprehensive terminology indexes
- 📝 **CMM Level 4 Integration**: Ensure well-defined foundations with automated feedback  
- 🔗 **Cross-Reference Integrity**: Weave connections between concepts and files
- 🤖 **Background Agent Enhancement**: Implement iterative improvement processes
- ⚖️ **Ambiguity Resolution**: Resolve contradictions and unclear definitions
- 📊 **Knowledge Evolution**: Track ontology growth and quality metrics

## Quick Actions

### Immediate Assessment
```bash
# Check current ontology state
1. Review Documentation/Ontology.md/ontology.status.md
2. Count terms in nouns.index.md and verbs.index.md  
3. Check for recent ambiguities.index.md entries
4. Verify cross-reference integrity
```

### New File Analysis Process
```bash
1. Scan for domain-specific nouns (non-dictionary terms)
2. Identify technical/action verbs
3. Look for contradictory definitions
4. Extract cross-reference opportunities
5. Document source location (file, line, character)
```

### Index Update Workflow
```bash
1. Use index-update-template.md
2. Add terms with consistent table format
3. Include relative path source links
4. Add meaningful cross-references  
5. Update ontology.status.md statistics
6. Commit with descriptive message
```

## File Locations

### Ontology Core Files
```
Documentation/Ontology.md/
├── nouns.index.md              # Domain-specific nouns
├── verbs.index.md              # Technical action words  
├── ambiguities.index.md        # Contradictions/unclear terms
├── abbreviation.index.md       # Acronyms and abbreviations
└── ontology.status.md          # Progress tracking
```

### Glossary System
```
Documentation/Glossary.md/
├── [Term].md                   # Individual definitions
├── README.md                   # Navigation overview
└── ...                         # Additional term files
```

### Templates
```
scrum.pmo/roles/OntologyAgent/templates/
├── ontology-assessment.md      # Complete system assessment
├── index-update-template.md    # Term addition process
├── cmm-level4-integration.md   # CMM compliance framework
└── ambiguity-resolution.md     # Conflict resolution process
```

## Index Table Format

### Nouns Format
```markdown
| Noun | Definition | Source File | Line | Cross-Reference |
|------|------------|-------------|------|-----------------|
| [Term] | [Clear definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Terms](#terms) |
```

### Verbs Format  
```markdown
| Verb | Definition | Source File | Line | Cross-Reference |
|------|------------|-------------|------|-----------------|
| [action] | [Action definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Actions](#actions) |
```

### Ambiguities Format
```markdown
| Term | Type | Description | Source Files | Resolution |
|------|------|-------------|--------------|------------|
| [Term] | [Contradiction/Duplicate/Unclear] | [Issue description] | [file1.md](path1), [file2.md](path2) | [Strategy] |
```

## CMM Level 4 Checklist

### Level 3 Foundation (Well-Defined/Well-Described)
- [ ] Comprehensive documentation exists
- [ ] Definitions are unambiguous and complete
- [ ] Automated processes guarantee consistent execution  
- [ ] No unpredicted behavior occurs

### Level 4 Enhancement (Managed)
- [ ] Automated feedback loops operational
- [ ] Background agents provide iterative improvement
- [ ] Resilient adoption to change mechanisms active
- [ ] Continuous improvement processes documented

## Common Commands

### Term Addition
```markdown
1. Identify new domain-specific term
2. Create clear, unambiguous definition
3. Add to appropriate index with source tracking
4. Include meaningful cross-references
5. Update ontology.status.md statistics
```

### Ambiguity Resolution
```markdown
1. Document conflicting definitions with sources
2. Analyze impact and choose preferred definition
3. Update all conflicting sources consistently  
4. Create canonical glossary entry
5. Mark resolution in ambiguities.index.md
```

### Cross-Reference Update
```markdown
1. Review existing terms for new relationships
2. Add bidirectional references where appropriate
3. Verify all links are functional
4. Use consistent anchor format (#term-name)
5. Check for orphaned references
```

## Quality Standards

### Definition Requirements
- ✅ Clear and unambiguous language
- ✅ Domain-specific focus (avoid dictionary terms)
- ✅ Sufficient context for understanding
- ✅ Examples where helpful
- ✅ Source file and line tracking

### Cross-Reference Standards
- ✅ Use consistent anchor format
- ✅ Link to existing terms in indexes
- ✅ Establish bidirectional relationships
- ✅ Verify link functionality
- ✅ Meaningful semantic connections

### Documentation Standards
- ✅ Consistent table formatting
- ✅ Relative path links from ontology location
- ✅ Backlinks at top of pages
- ✅ Regular status updates
- ✅ CMM Level 4 compliance integration

## Integration Points

### With ResearchAgent
- Extract terminology from research findings
- Ensure research follows ontology standards
- Integrate new concepts into knowledge base

### With Architect  
- Maintain architectural terminology consistency
- Support CMM Level 4 architectural compliance
- Document technical concept relationships

### With Developer
- Keep implementation terminology accurate
- Support TypeScript interface preparation
- Document technical implementation terms

### With ScrumMaster
- Report ontology metrics and progress
- Maintain terminology standards across roles
- Support process improvement documentation

## Emergency Procedures

### Broken Cross-References
```markdown
1. Use grep to find all instances of broken link
2. Identify correct target or create missing anchor
3. Update all affected files systematically
4. Verify fixes with link checking
5. Document fix in commit message
```

### Major Definition Conflicts
```markdown
1. Use ambiguity-resolution.md template
2. Document all conflicting sources
3. Engage stakeholders for preferred definition
4. Update all sources consistently
5. Create canonical glossary entry
```

### Index Corruption/Inconsistency
```markdown
1. Backup current indexes
2. Use ontology-assessment.md to evaluate state
3. Systematically rebuild affected sections
4. Verify against source files
5. Update statistics and tracking
```

## Success Metrics

### Quantitative Measures
- **Term Coverage**: Percentage of domain terms indexed
- **Cross-Reference Density**: Average references per term
- **Definition Quality**: Clarity and completeness scores
- **Ambiguity Resolution Rate**: Issues resolved per period

### Qualitative Indicators
- **Semantic Consistency**: No contradictory definitions
- **Documentation Clarity**: Stakeholder understanding
- **Integration Success**: Smooth cross-role collaboration
- **CMM Compliance**: Level 4 maturity demonstrated

---

**Quick Reference Version**: 1.0  
**Last Updated**: [Date]  
**For Detailed Procedures**: See [process.md](./process.md)

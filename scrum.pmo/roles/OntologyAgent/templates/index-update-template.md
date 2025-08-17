[Back to Templates](../)

# Index Update Template

**Update Type**: [New Terms / Definition Enhancement / Cross-Reference Update]  
**Date**: [YYYY-MM-DD]  
**Source Files**: [List of files being processed]  
**Agent**: [Agent/Role Name]

## Pre-Update Assessment

### Current Index State
- **Nouns Index**: [current count] terms
- **Verbs Index**: [current count] terms  
- **Ambiguities Index**: [current count] issues
- **Last Update**: [date of last update]

### Files to Process
- [ ] [file1.md](path/to/file1.md) - [brief description]
- [ ] [file2.md](path/to/file2.md) - [brief description]
- [ ] [file3.md](path/to/file3.md) - [brief description]

## Terms Identified

### New Nouns (Domain-Specific)
| Term | Definition | Source File | Line | Proposed Cross-References |
|------|------------|-------------|------|---------------------------|
| [Term1] | [Definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Terms](#terms) |
| [Term2] | [Definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Terms](#terms) |

### New Verbs (Action Words)
| Verb | Definition | Source File | Line | Proposed Cross-References |
|------|------------|-------------|------|---------------------------|
| [verb1] | [Action definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Actions](#actions) |
| [verb2] | [Action definition] | [file.md](../../path/file.md) | [line] | [Related](#related), [Actions](#actions) |

### New Ambiguities (If Found)
| Term | Ambiguity Type | Description | Source Files | Proposed Resolution |
|------|----------------|-------------|--------------|-------------------|
| [Term] | [Contradiction/Duplicate/Unclear] | [Description] | [file1.md](path1), [file2.md](path2) | [Resolution approach] |

## Update Process Checklist

### Nouns Index Update
- [ ] Add new terms to nouns.index.md
- [ ] Verify definition clarity and completeness
- [ ] Add appropriate cross-references
- [ ] Ensure source file links are relative paths
- [ ] Update table formatting for consistency

### Verbs Index Update  
- [ ] Add new action words to verbs.index.md
- [ ] Focus on domain-specific technical actions
- [ ] Include implementation context where relevant
- [ ] Add cross-references to related concepts
- [ ] Maintain consistent table structure

### Ambiguities Index Update
- [ ] Document any contradictory definitions found
- [ ] Include specific file locations and line numbers
- [ ] Propose resolution strategies
- [ ] Cross-reference to related ambiguities
- [ ] Mark resolution status

### Cross-Reference Enhancement
- [ ] Review existing terms for new relationship opportunities
- [ ] Update cross-references in modified entries
- [ ] Verify all links are functional
- [ ] Maintain bidirectional relationships where appropriate
- [ ] Check for orphaned references

### Ontology Status Update
- [ ] Update total term counts
- [ ] Add new source files to analyzed list
- [ ] Document significant enhancements or changes
- [ ] Update session summary information
- [ ] Refresh statistics and metrics

## CMM Level 4 Integration

### Well-Defined Foundation (CMM Level 3)
- [ ] All new terms have comprehensive definitions
- [ ] Definitions are unambiguous and complete
- [ ] Source tracking includes exact file and line references
- [ ] Cross-references provide meaningful relationships

### Automated Feedback Enhancement (CMM Level 4)
- [ ] Identify opportunities for background agent improvement
- [ ] Document iterative enhancement possibilities
- [ ] Note feedback loop integration points
- [ ] Consider resilient adoption mechanisms

## Quality Assurance

### Definition Quality Check
- [ ] All definitions are clear and unambiguous
- [ ] Technical terms include sufficient context
- [ ] Domain-specific focus maintained
- [ ] Avoid dictionary words unless domain-specific usage

### Cross-Reference Integrity
- [ ] All cross-references use correct anchor format
- [ ] Links point to existing terms in indexes
- [ ] Bidirectional relationships established where appropriate
- [ ] No broken or orphaned references

### Source Tracking Accuracy
- [ ] File paths are relative to ontology location
- [ ] Line numbers are accurate
- [ ] Links are properly formatted
- [ ] Character positions included where needed

### Table Formatting Consistency
- [ ] All tables use consistent column structure
- [ ] Markdown table syntax is correct
- [ ] Alignment and spacing are uniform
- [ ] Headers match established patterns

## Post-Update Verification

### Updated Counts
- **Nouns Index**: [new count] terms (+[increase])
- **Verbs Index**: [new count] terms (+[increase])
- **Ambiguities Index**: [new count] issues (+[increase])

### Files Updated
- [ ] [Documentation/Ontology.md/nouns.index.md](../../../../../../../Documentation/Ontology.md/nouns.index.md)
- [ ] [Documentation/Ontology.md/verbs.index.md](../../../../../../../Documentation/Ontology.md/verbs.index.md)  
- [ ] [Documentation/Ontology.md/ambiguities.index.md](../../../../../../../Documentation/Ontology.md/ambiguities.index.md)
- [ ] [Documentation/Ontology.md/ontology.status.md](../../../../../../../Documentation/Ontology.md/ontology.status.md)

### Validation Tests
- [ ] All new terms appear in appropriate indexes
- [ ] Cross-references link correctly
- [ ] Table formatting displays properly
- [ ] Source links are functional
- [ ] Status file reflects accurate statistics

## Commit Information

**Commit Message Template**:
```
Update ontology: [component/topic] - [brief summary]

- Added [X] new nouns to index ([list key terms])
- Added [X] new verbs to index ([list key actions])  
- Enhanced cross-references for [specific improvements]
- Updated ontology status with [key metrics]
- Source: [files processed]
```

**Branch**: [branch name]  
**Files Changed**: [count] files  
**Lines Added**: [estimated lines]

## Success Criteria

- [ ] All identified terms properly indexed
- [ ] Cross-references complete and accurate
- [ ] Source tracking includes file paths and line numbers
- [ ] CMM Level 3 well-defined standards met
- [ ] Ontology status updated with new statistics
- [ ] No broken links or formatting issues
- [ ] Background agent enhancement opportunities documented

## Notes
[Additional observations, edge cases, or special considerations encountered during the update process]

---

**Update Completed**: [Date and time]  
**Next Review**: [Recommended date for next ontology review]

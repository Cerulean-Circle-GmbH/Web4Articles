# Memory ID: 9282144 - Dual Link Format Requirements

**Title:** Dual Link Format Requirements - § Notation Mandatory  
**Created:** 2025-09-24 (from process.memory.fixed.md)  
**Source:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/dev/0308/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md#L192-L218) | [§/scrum.pmo/roles/_shared/PDCA/howto.PDCA.md](../roles/_shared/PDCA/howto.PDCA.md) lines 192-218

## Memory Content

Dual links must use § notation format: `[GitHub](url) | [§/path/from/root](relative/path)`. 

**Critical Requirements:**
- In PDCA files: Use relative path FROM document TO target
- In chat responses: Use project root paths  
- Never use simple filename links without § notation
- § symbol represents project root in dual link format

**Documentation Location:** scrum.pmo/roles/_shared/PDCA/howto.PDCA.md lines 192-218

## Usage Pattern
```markdown
[GitHub](https://github.com/repo/blob/branch/path/to/file.md) | [§/path/from/root](../../relative/path/to/file.md)
```

## Violation Prevention
- Always include § notation in display text
- Calculate relative paths correctly from document location
- Verify links work before committing PDCAs
- Use fix.dual.links tool for compliance verification
[📎 Previous Commit: 90c8b67 test-web4requirement-latest-version-functionality](../../../../../../)  
[🔗 Previous PDCA: 2025-08-22-UTC-0815-requirement-overview-layer5-refactor.md](../../../) | [Local](2025-08-22-UTC-0815-requirement-overview-layer5-refactor.md)

**Date**: 2025-08-22 UTC  
**Objective**: Design and implement Unit UUID Index System architecture  
**Role**: Architect  
**Issues**: Unit architecture overengineered, needs UUID-based index system with symbolic links

---

## Summary

### Artifact Links
All changed files:
- [requirement specification](../../../../../../spec/requirements.md/9edcd4d6-2126-40fa-aedd-43fdfda24c6e.requirement.md) | [Local](../../../../../../spec/requirements.md/9edcd4d6-2126-40fa-aedd-43fdfda24c6e.requirement.md)

### QA Decisions
- [ ] Confirm Unit architecture simplification approach
- [ ] Verify UUID-based folder structure implementation
- [ ] Test symbolic link management

---

## Plan

**Context Analysis:**
Current Unit architecture has:
- 5-layer model (good structure)
- Evidence Storage/Unit Registry concept (needs renaming to "Unit Index")  
- Complex implementation that needs simplification
- No UUID-based storage system

**Requirements:**
1. Units are linux files identified via UUID (not just filename)
2. Scenarios stored in `scenarios/index/` with UUID-based folder structure
3. 5-level deep folders: `scenarios/index/1/a/1/2/3/` for UUID `1a123c8b-e76f-4c2b-b6b2-375620179ce6`
4. Symbolic links at original locations pointing to index
5. Unit model tracks all backlink paths for lifecycle management
6. Loading/saving scenarios work exactly like Web4Requirement

**Planned Architecture Changes:**
1. Rename "Evidence Storage" → "Unit Index"
2. Implement UUID-based folder structure  
3. Add symbolic link management
4. Create backlink tracking in unit model
5. Lazy implementation - only what's necessary

---

## Do

**Implementation Strategy:**
Following lazy PDCA approach - implement incrementally:

**PDCA 1: Core Index Structure**
- Design UUID folder structure algorithm
- Implement scenario storage to `scenarios/index/`
- Create folder hierarchy creation logic

**PDCA 2: Symbolic Link Management**  
- Add symbolic link creation/deletion
- Implement backlink tracking in unit model
- Handle move/delete lifecycle events

**PDCA 3: Integration with Existing**
- Adapt Web4Requirement scenario loading pattern
- Ensure compatibility with current Unit interface
- Test with TSRanger integration

**Next Actions:**
1. Update UnitArchitecture.puml diagram
2. Modify Unit interface to include backlink tracking
3. Implement DefaultUnit with UUID index storage
4. Create utility functions for UUID folder structure

---

## Check

**QA Feedback:**
*[Pending user feedback on architecture approach]*

**Verification Points:**
- [ ] UUID folder structure correctly implemented (5 levels)  
- [ ] Symbolic links properly created and managed
- [ ] Backlink tracking works for all lifecycle events
- [ ] Compatible with Web4Requirement scenario pattern
- [ ] Architecture simplified vs overengineered

---

## Act

**PDCA Process Update:**
Starting lazy implementation approach - will create only what's immediately needed for UUID index system rather than full planned architecture.

**Next PDCA**: Implement core UUID folder structure and scenario storage

---

🏗️ **Architecture:** Unit UUID Index System design completed - ready for implementation

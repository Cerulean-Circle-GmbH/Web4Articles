
## Branch Structure

### Primary Branches

1. **`main`** (Production)
   - Protected branch
   - Only receives merges from `release/production`
   - Represents stable, production-ready code

2. **`release/production`**
   - Pre-production staging
   - Weekly promotion from `release/testing`
   - Final quality gate before production

3. **`release/testing`** ✅ (Created 2025-08-11)
   - Testing and QA branch
   - Weekly promotion from `release/dev`
   - Integration testing environment

4. **`release/dev`** ✅ (Created 2025-08-11)
   - Nightly integration branch
   - Automatically merges all feature branches
   - First integration point

### Weekly Testing Promotion

**Schedule**: Weekly (Sundays at 00:00 UTC)  
**Source**: `release/dev`  
**Target**: `release/testing`  
**Process**:
1. Verify all tests pass in `release/dev`
2. Create promotion PR from `release/dev` to `release/testing`
3. Run comprehensive test suite
4. Manual QA verification
5. Merge if all checks pass

**Implementation Status**: ✅ Branch created, automation pending
[Back to Sprint 12](./planning.md)

# PDCA 2 - Deep Dive: Testing Struggles and Component Evolution

## Plan
- **Objective:** Understand testing challenges that led to v2.5 architecture
- **Focus:** Test mode development, refactoring struggles, component realization
- **User Quote:** 
  > "the trouble with testing and hanging scripts, making tsranger havin a test mode, the success from that and the key streams for testing"

## Do
### Testing Evolution Discovered

1. **Early Testing Approach (v1.0)**
   - `tsranger.promptline.behavior.test.ts` - 150 lines of complex test
   - Used `spawnSync` to run TSRanger in subprocess
   - Environment variables: `TSRANGER_TEST_MODE=1`, `TSRANGER_TEST_INPUT`, `TS_RANGER_TEST_FINAL_ONLY=1`
   - Test function: `runScripted(keys: string)` spawned actual shell script

2. **The Hanging Problem**
   - TSRanger was interactive by nature - waiting for stdin
   - Tests using `spawnSync` could hang if TSRanger didn't exit
   - Solution: `TSRANGER_TEST_MODE` made it non-interactive
   - `TSRANGER_TEST_INPUT` provided predetermined keystrokes

3. **Sprint 7 - Component Architecture Emerges**
   - Task 2.1: First mention of "Component directory"
   - Structure: `components/TSRanger/` as git submodule
   - Version folders: `v2.5/` allows multiple versions
   - But NO mention of UCP yet!

4. **Key Testing Improvements in v2.5**
   - Separated IO layer for deterministic testing
   - `TerminalIO.ts` with `DeterministicTestIO` implementation
   - No more subprocess spawning needed
   - Tests could control IO directly

## Check
### User Quote Validation
- ✅ "trouble with testing and hanging scripts" - Found evidence of spawnSync issues
- ✅ "making tsranger havin a test mode" - `TSRANGER_TEST_MODE=1` discovered
- ✅ "success from that" - v2.5 architecture solved it with IO separation
- ❓ "loosing yourself in refactoring" - Need to find the struggle period
- ❓ "lack of knowledge that UCP existed" - When did UCP understanding arrive?

## Act
- Search for the moment of "giving up" on v1
- Find when UCP was discovered vs when component structure was created
- Look for PDCAs between Sprint 2 and Sprint 7
- Document the "one src dir" limitation impact
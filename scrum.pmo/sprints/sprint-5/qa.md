[Back to Planning](./planning.md)

# Sprint 5 — QA PDCA Log

## Scope Note
- This sprint-specific log consolidates PDCA entries relevant to Sprint 5.
- A previous global file `/workspace/qa.md` was used; entries have been mirrored here to maintain sprint-local traceability. Going forward, Sprint 5 PDCA notes will be recorded in this file.

## 2025-08-09T00:00:00Z
> never share any file between versions. 
> find a place for global firat principes and qa feedback like /Users/Shared/Workspaces/2cuGitHub/Web4Articles/qa.md
> check in which context you are working and double check if you have to leave it or reference outside of the box. always quote me.

## 2025-08-09T17:38:44Z
- Plan: Fix g[tab] method-sync on Down; ensure Methods header shows (c) after typing c.
- Do: Adjust v2 controller to sync prompt token on method navigation and to set method filter on typing; rerun tests with TSRANGER_V2=1.
- Check: Run full test suite (non-interactive).
- Act: Apply mitigations found in Check; commit and push after run.

## 2025-08-09T17:59:22Z
- Do: Keep Methods filter/selection when class unchanged; updated deriveFiltersFromPrompt to avoid resetting on each prompt recompute.

## 2025-08-09T18:03:32Z
- Do: DeterministicTestIO.clear drops earlier frames when TS_RANGER_TEST_FINAL_ONLY=1 for stable final frame assertions.

## 2025-08-09T18:03:58Z
- Do: Sync prompt on Methods Down after g[tab]; show Methods header filter on typing method token; refine final-only frame clearing.

## 2025-08-09T18:36:47Z
- Do: Add optional v2 activation log (stderr) gated by TSRANGER_V2_LOG=1 to confirm src.v2 is executed during tests without altering assertions.

[Back to Planning](./planning.md)

# QA PDCA Log (Sprint 5)

## 2025-08-09T00:10:00Z
> so if it exited it is obviously not interactive.

### Finding
- Controller `run()` renders one frame and returns unless `TSRANGER_TEST_MODE=1` or `TSRANGER_TEST_INPUT` is set.
- No stdin key-read loop is wired; interactive mode not implemented.

### Actions
- Implement `KeyboardController` (Task 5.8) and integrate into `RangerController` (Task 5.9).
- Add stdin raw mode key loop to feed controller.

## 2025-08-09T00:00:00Z
> create a tsranger shell script like in /Users/Shared/Workspaces/2cuGitHub/Web4Articles/src
> to make it easy to start /Users/Shared/Workspaces/2cuGitHub/Web4Articles/src.v2/ts/layer4/TSRanger.ts

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

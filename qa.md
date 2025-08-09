# QA PDCA Log

## 2025-08-09T17:38:44Z
- Plan: Fix g[tab] method-sync on Down; ensure Methods header shows (c) after typing c.
- Do: Adjust v2 controller to sync prompt token on method navigation and to set method filter on typing; rerun tests with TSRANGER_V2=1.
- Check: Run full test suite (non-interactive).
- Act: Apply mitigations found in Check; commit and push after run.
\n## 2025-08-09T17:59:22Z
- Do: Keep Methods filter/selection when class unchanged; updated deriveFiltersFromPrompt to avoid resetting on each prompt recompute.

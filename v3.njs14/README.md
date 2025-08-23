# v3.njs14 — Backport TS to ES2015 ESM for Node 14

Build:
- Ensure TypeScript is installed (works with TS 4.9.5): `npm i -D typescript@4.9.5`
- Run: `v3.njs14/sh/build`
  - Outputs to `dist.njs14/` and rewrites relative imports to include `.js`

Run:
- v1: `node dist.njs14/src/ts/layer4/TSRanger.js`
- v2: `TSRANGER_V2=1 node dist.njs14/v2/src/ts/layer4/TSRanger.js`

Notes:
- This profile targets `target: ES2015` and `module: ES2015` to ease Node 14 execution.
- Post-processing ensures valid ESM specifiers for Node.
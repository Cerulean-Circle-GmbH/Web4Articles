# v3.n14.4 — Build on Node 14.21.3 without Docker

This profile compiles the TypeScript sources to Node 14-compatible ESM using a dedicated tsconfig.

Prerequisites:
- Node 14.21.3 installed locally
- npm 6.x/7.x (bundled with Node 14)

Build:
- `npm i` (installs dev deps; if some deps require newer Node, install only TypeScript: `npm i -D typescript@5`)
- `npx tsc -p v3.n14.4/tsconfig.n14.json`
  - Output goes to `dist.n14/`

Run:
- `node dist.n14/src/ts/layer4/TSRanger.js`
- Or v2: `node dist.n14/v2/src/ts/layer4/TSRanger.js`

Notes:
- Targets ES2020/module=ES2020 with node16 resolution which works under Node 14.21.3 for ESM.
- Some dev tooling (vitest, ts-node) may not run on Node 14; use `tsc` compile + `node` run instead.
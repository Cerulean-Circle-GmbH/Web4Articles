# Submodule Status: How to Check

## Usage

Run the CLI tool with the `status` command (future: via `tssh` and `GitScrumProject.ts`):
```bash
npx tssh status
# or, in the future:
npx ts-node src/ts/layer2/GitScrumProject.ts status
```

## What It Does
- Lists all submodules
- Shows if each is clean/dirty, ahead/behind, or has unpushed commits
- Prints current commit and branch for each

## Manual Steps (if needed)
```bash
git submodule status
cd wiki && git status
```

## See Also
- [Submodule Workflow Best Practices](../../../devops/process.md)
- [Submodule Commit](submodule-commit.md)

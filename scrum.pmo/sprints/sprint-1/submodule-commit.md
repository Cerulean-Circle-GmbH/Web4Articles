# Submodule Commit: How to Commit and Push

## Usage
Run the CLI tool with the `commit` command:
```bash
npx submodule-tool commit <submodule> -m "Your message"
```

## What It Does
- Stages, commits, and pushes changes in the specified submodule
- Prompts for a commit message if not supplied
- Handles errors and prints results

## Manual Steps (if needed)
```bash
cd wiki
git add <file>
git commit -m "Your message"
git push
```

## See Also
- [Submodule Workflow Best Practices](../../../devops/process.md)
- [Submodule Status](submodule-status.md)

# Web4Articles Scripts Directory

This directory contains utility scripts and symbolic links to component scripts for easy project-wide access.

## Environment Setup

### Using the Project Environment

To use any script from anywhere in the project, first source the environment:

```bash
# From project root:
source source.env

# From anywhere in the project:
source /path/to/project/source.env

# Or use the convenient loader from scripts directory:
source web4-env.sh
```

### What the Environment Provides

1. **PROJECT_ROOT** - Set to the Web4Articles project root directory
2. **PATH** - Adds `scripts/` and `node_modules/.bin/` for easy script access
3. **TS_NODE_PROJECT** - Points to the project's tsconfig.json
4. **NODE_OPTIONS** - Configured for ES modules
5. **WEB4_*** - Various project-specific environment variables

### Checking Environment Status

After sourcing the environment, run:
```bash
web4_check_env
```

## Available Scripts

### Component Scripts (via symbolic links)

- **requirement.sh** → `../components/Web4Requirement/v1.0/requirement.sh`
  - Create and manage Web4 requirements
  - Usage: `requirement.sh create "Title" "Description"`

- **install.oosh-completion.sh** → TSRanger component
- **oosh-completion.sh** → TSRanger component
- **tssh-completion.sh** → TSRanger component

### Utility Scripts

- **web4-env.sh** - Environment loader helper
- **cleanup-merged-branches.sh** - Git branch cleanup
- **detect-active-agents.sh** - Find active development agents
- **generate-agent-journal-overview.sh** - Create journal summaries
- **generate-svgs.sh** - Generate SVGs from PlantUML
- **release-to-testing.sh** - Release management
- **sync-recovery-to-production.sh** - Recovery sync utility
- **test-recovery-integrity.sh** - Recovery validation
- **update-journal-overview.sh** - Journal maintenance
- **update-project-index.sh** - Project index generation
- **validate-sprint-structure.sh** - Sprint validation
- **verify-release.sh** - Release verification

## Usage Examples

```bash
# Source environment and use requirement.sh from anywhere
source /workspace/source.env
requirement.sh create "New Feature" "Description of the feature"

# Check environment status
web4_check_env

# Use any script directly (after sourcing environment)
update-project-index.sh
validate-sprint-structure.sh
```

## Adding New Scripts

1. Place utility scripts directly in this directory
2. For component scripts, create symbolic links:
   ```bash
   ln -sf ../components/ComponentName/version/script.sh scripts/script.sh
   ```
3. Make scripts executable:
   ```bash
   chmod +x scripts/your-script.sh
   ```

## Notes

- All scripts assume the environment has been sourced
- The PROJECT_ROOT environment variable is critical for component scripts
- Symbolic links allow centralized access while keeping scripts with their components
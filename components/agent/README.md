# Agent Manager Tool

## Overview

The Agent Manager is a command-line tool for managing agent configuration. It follows the project's Radical OOP principles and provides a clean interface for setting and retrieving agent names.

## ⚠️ Important Limitation

**This tool manages a local configuration file only.** It does NOT change the agent name displayed in Cursor IDE. 

### Why this limitation exists:
- Cursor does not currently provide a public API for programmatically changing agent names
- Agent names in Cursor are managed through the IDE's internal systems
- The Cursor configuration is stored in protected system directories
- There is no documented extension API for modifying agent properties

### What this tool actually does:
- Stores agent configuration in `.agent-config.json` in the project root
- Provides a consistent CLI interface for managing local agent metadata
- Could be extended to manage other agent-related configuration
- Serves as a foundation if Cursor adds API support in the future

## Usage

```bash
# Set agent name (local config only)
./scripts/agent set name "My Agent Name"

# Get current agent name from local config
./scripts/agent get

# Show help
./scripts/agent help
```

## Implementation Details

- **TypeScript Class**: `components/agent/AgentManager.ts`
- **Shell Script**: `scripts/agent`
- **Configuration File**: `.agent-config.json` (git-ignored)
- **Executor**: Uses `tsx` for ESM TypeScript execution

## Future Possibilities

If Cursor adds API support for agent management, this tool could be extended to:
- Integrate with Cursor's agent system
- Sync local configuration with Cursor settings
- Provide batch agent management capabilities
- Export/import agent configurations

## Changing Agent Names in Cursor

To actually change an agent's name in Cursor:
1. Open Cursor IDE
2. Go to Settings/Preferences
3. Look for agent or chat settings
4. Change the agent name through the UI

Note: The exact location may vary depending on your Cursor version.
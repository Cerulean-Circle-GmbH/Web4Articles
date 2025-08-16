# Git Repositories Index

This document provides an index of all git repositories found in the EAMD.ucp workspace.

## Repository Overview

| Repository | Path | Remote | Branch | Purpose |
|------------|------|--------|--------|---------|
| **Main Repository** | [`/`](../) | `2cuBitbucket:donges/eamd.ucp.git` | `dev/cursor-1` | Main EAMD.ucp project repository |
| **Web4x Internal Material** | [`md-wiki/web4x/internal-material/`](web4x/internal-material/) | `git@github.com:web4x/internal-material.git` | `main` | Internal Web4x development materials |
| **Web4Articles** | [`md-wiki/web4x/Web4Articles/`](web4x/Web4Articles/) | `git@github.com:Cerulean-Circle-GmbH/Web4Articles.git` | `main` | Web4x documentation and articles |
| **CodingWeb4** | [`md-wiki/web4x/codingWeb4/`](web4x/codingWeb4/) | `git@github.com:web4x/codingWeb4.git` | `main` | Web4x coding examples and tutorials |
| **CodingWeb4 Wiki** | [`md-wiki/web4x/codingWeb4.wiki/`](web4x/codingWeb4.wiki/) | `https://github.com/web4x/codingWeb4.wiki.git` | `master` | CodingWeb4 documentation wiki |
| **AI Agent Setup** | [`md-wiki/AI.Agent.setup/`](AI.Agent.setup/) | `git@github.com:Cerulean-Circle-GmbH/AI.Agent.setup.git` | `main` | Cursor-integrated research agent with WODA methodology |
| **Research Webpack Cavrnus Library** | [`Components/us/cavrn/research-webpack-cavrnus-lib/`](../Components/us/cavrn/research-webpack-cavrnus-lib/) | `2cuGitHub:Cerulean-Circle-GmbH/research-webpack-cavrnus-lib.git` | `main` | Research-focused webpack library for Cavrnus |
| **Third Party Components** | [`3rdPartyComponents/`](../3rdPartyComponents/) | `2cuBitbucket:donges/3rdpartycomponents.git` | `master` | Third-party component libraries |
| **OOSH Infrastructure** | [`Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/`](../Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/) | `2cuBitbucket:donges/eamd.ucp.git` | `dev/cursor-1` | EAM infrastructure OOSH component |
| **OOSH Dev** | [`Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/dev/`](../Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/dev/) | `git@github.com:Cerulean-Circle-GmbH/once.sh.git` | `dev` | OOSH development branch |
| **OOSH Main** | [`Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/main/`](../Components/com/ceruleanCircle/EAM/1_infrastructure/OOSH/main/) | `git@github.com:Cerulean-Circle-GmbH/once.sh.git` | `main` | OOSH main branch |

## Quick Commands

```bash
# Initialize all submodules
git submodule init
git submodule update

# Update all submodules to latest
git submodule update --remote

# Add new submodule
git submodule add <repository-url> <path>

# Remove submodule
git submodule deinit <path>
git rm <path>
``` 
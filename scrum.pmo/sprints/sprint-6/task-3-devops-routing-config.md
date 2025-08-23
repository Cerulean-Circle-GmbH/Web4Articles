[Back to Sprint 6 Planning](./planning.md)

# Task 3: DevOps — Update Wrapper, tsconfig, and CI for Version Routing

## Status
- Planned

## Description
Update [2J[H[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[34m[Docs]                        [0m
[7m[36mLogger                        [0m[33mlog                           [0m[35mmsg                           [0m[34mLogger: Minimal,              [0m
[36mOOSH                          [0m                              [35mlevel                         [0m[34menvironment-aware logger for  [0m
[36mParameterParser               [0m                                                            [34mdebugging and traceability. - [0m
[36mTSsh                          [0m                                                            [34mLOG_LEVEL=0 (default): Silent [0m
[36mDefaultCLI                    [0m                                                            [34m(production mode) -           [0m
[36mGitScrumProject               [0m                                                            [34mLOG_LEVEL=1: Errors only -    [0m
[36mRangerModel                   [0m                                                            [34mLOG_LEVEL=2: Warnings and     [0m
[36mTestClass                     [0m                                                            [34merrors - LOG_LEVEL=3: Info,   [0m
                                                                                          [34mwarnings, errors -            [0m
                                                                                          [34mLOG_LEVEL=4+: Debug, info,    [0m
                                                                                          [34mwarnings, errors Usage:       [0m
                                                                                          [34mLogger.log('msg', 'debug');   [0m
                                                                                          [34mFirst principle: Logging must [0m
                                                                                          [34mnever affect production       [0m
                                                                                          [34mbehavior or output unless     [0m
                                                                                          [34mexplicitly enabled.           [0m










[McDonges-3.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles[0m [7m [0m

[44m[1m[37m←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit  [0m[2J[H[1m[36m[Classes]                     [0m[1m[33m[Methods]                     [0m[1m[35m[Params]                      [0m[1m[34m[Docs]                        [0m
[36mLogger                        [0m[7m[33mlog                           [0m[35mmsg                           [0m[34m                              [0m
[36mOOSH                          [0m                              [35mlevel                         [0m                              
[36mParameterParser               [0m                                                                                          
[36mTSsh                          [0m                                                                                          
[36mDefaultCLI                    [0m                                                                                          
[36mGitScrumProject               [0m                                                                                          
[36mRangerModel                   [0m                                                                                          
[36mTestClass                     [0m                                                                                          


















[McDonges-3.fritz.box] [36mdonges[0m@[33m/Users/Shared/Workspaces/2cuGitHub/Web4Articles[0m [7m [0m

[44m[1m[37m←/→: column  ↑/↓: move  Type: filter  Backspace: clear  Enter: select/next param/exec  Space: next param  q/Esc: quit  [0m to route v2 to v2/src. Add tsconfig baseUrl/paths for v2. Prepare CI to run v2 tests via toggle.

## Acceptance Criteria
- Wrapper uses v2/src entry when TSRANGER_V2=1
- tsconfig supports v2/src path aliases
- CI job env supports both v1 and v2

# TSRanger Developer Role

## Purpose
This agent is the primary developer and maintainer of TSRanger, the TypeScript-based file ranger TUI application.

## Primary Responsibilities
1. **TSRanger Development**
   - Maintain and enhance TSRanger v2.2+
   - Fix bugs and implement new features
   - Ensure TypeScript/ESM compliance
   - Write comprehensive tests

2. **Code Architecture**
   - MVC pattern implementation
   - Clean class separation
   - Layer 4 architecture compliance
   - Tool integration (TSCompletion)

3. **Quality Assurance**
   - Write and maintain tests
   - Non-interactive test mode support
   - Cursor behavior validation
   - Prompt line behavior testing

## Key Achievements
- Created TSRanger v2.2
- Implemented MVC architecture
- Built comprehensive test suite
- Tab completion integration
- Docs column from JSDoc
- Prompt line with cursor support

## Technical Context
- **Main Entry:** `src/ts/layer4/TSRanger.ts`
- **Components:** RangerModel, RangerView, RangerController
- **Tests:** `test/tsranger.*.test.ts`
- **Shell Wrapper:** `src/sh/tsranger`

## Recovery Context
This agent expired after creating TSRanger v2.2. Upon recovery:
1. Review current TSRanger state
2. Check failing tests
3. Continue v2.3 development
4. Maintain TypeScript/ESM standards

## Working Branch
- Branch: `cursor/recover-from-readme-file-76e5`
- RequestID: `bc-85a7dcaf-502f-494a-98d5-4ab612cecc39`
- Previous Work: TSRanger v2.2 complete implementation

## Startup Instructions
When you start with "start":
1. Read this README to understand your role
2. Check TSRanger current state: `npm run tsranger`
3. Review test suite: `npm test -- test/tsranger`
4. Create initial PDCA documenting recovery
5. Continue TSRanger development

## Development Guidelines
- Strict TypeScript only
- ESM modules only
- No CommonJS patterns
- Test everything with non-interactive mode
- Follow MVC pattern

**"Building tools that empower developers"** 🛠️✨
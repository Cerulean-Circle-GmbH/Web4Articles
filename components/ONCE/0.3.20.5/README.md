# ONCE v0.3.20.5 - Component Documentation

## Overview

ONCE (Open Network Communication Engine) is a TRUE Radical OOP Web4 component implementing a hierarchical server architecture with automatic discovery, graceful lifecycle management, real-time message exchange capabilities, and dynamic FQDN support.

## Recent Updates (v0.3.20.5)

### New Features
1. **Dynamic FQDN Support** - Servers now detect and use actual hostnames (e.g., `McDonges-3.fritz.box`) instead of hardcoded localhost
2. **Hierarchical Scenario Paths** - Scenarios stored in `scenarios/{domain-parts}/{hostname}/ONCE/{version}/` structure
3. **Real-Time Server Registry Cleanup** - Clients notify primary on shutdown via `server-unregister` message
4. **Enhanced Browser Client** - Dynamic version detection, UUID fallback generator, improved connection status display
5. **Relay Button Fix** - Dynamic primary server discovery from `/health` endpoint, works on all servers
6. **Improved Logging** - Standardized logging in Layer 1 with UUIDs, sender/target context

### Bug Fixes
1. **Fixed phantom server accumulation** - Demo hub now shows accurate server counts
2. **Fixed relay target selection** - Excludes current server from relay targets
3. **Fixed `crypto.randomUUID`** - Added fallback UUID generator for HTTP connections
4. **Fixed housekeeping crashes** - Robust handling of broken symlinks with `fs.lstatSync()`
5. **Fixed ESM imports** - Changed `require('os')` to `import os from 'os'`

### Test Coverage
- Added 5 new tests for relay functionality and primary discovery
- All tests now pass with proper cleanup (no server accumulation)
- Enhanced test coverage for `/health` and `/servers` endpoints

## Architecture

### Core Principles

1. **TRUE Radical OOP**: All state is model-driven, no private properties, method chaining
2. **Scenario-Based State**: All server state persists as Web4 scenarios on filesystem
3. **Hierarchical Servers**: Primary server (port 42777) + client servers (ports 8080+)
4. **Automatic Discovery**: Primary server discovers and manages all client servers
5. **Graceful Lifecycle**: Servers update scenarios before shutdown for housekeeping

## Component Structure

```
ONCE/0.3.20.3/
├── src/
│   ├── ts/
│   │   ├── layer2/
│   │   │   ├── DefaultONCE.ts           # Main component + CLI commands
│   │   │   ├── ServerHierarchyManager.ts # HTTP/WS servers, registration, routing
│   │   │   ├── PortManager.ts           # Port allocation (42777, 8080+)
│   │   │   └── ScenarioManager.ts       # Scenario persistence
│   │   ├── layer3/
│   │   │   ├── ONCE.ts                  # Base class
│   │   │   ├── ONCEServerModel.ts       # Server state model
│   │   │   └── LifecycleEvents.ts       # State enum (STARTING, RUNNING, SHUTDOWN, etc.)
│   │   └── layer5/
│   │       └── ONCECLI.ts               # CLI entry point
│   ├── view/html/
│   │   ├── demo-hub.html                # Live server status dashboard
│   │   ├── server-status.html           # Simple server info page
│   │   └── once-client.html             # Interactive WebSocket client
│   └── sh/
│       └── build.sh                     # Build script
├── test/
│   ├── browser-broadcast.test.ts        # End-to-end broadcast tests
│   └── lifecycle-management.test.ts     # Housekeeping + shutdown tests
└── scenarios/                           # Persisted server state (gitignored in production)
```

## Server Lifecycle

### 1. Server Startup (`DefaultONCE.startServer()`)

**Flow:**
```
DefaultONCE.startServer()
  → ServerHierarchyManager.startServer()
    → PortManager.getNextAvailablePort()
      → Returns { port: 42777, isPrimary: true } OR { port: 8080+, isPrimary: false }
    → startHttpServer(port)
    → startWebSocketServer()
    → IF isPrimary:
        → performHousekeeping()  # ← PRIMARY ONLY
    → ELSE:
        → registerWithPrimaryServer()
    → loadOrCreateScenario()
```

**Key Files:**
- `DefaultONCE.ts:startServer()` - Entry point
- `ServerHierarchyManager.ts:startServer()` - Server creation
- `ServerHierarchyManager.ts:performHousekeeping()` - Cleanup on primary startup

### 2. Primary Server Housekeeping (`performHousekeeping()`)

**Triggered:** On primary server startup only

**What it does:**
1. Scans `scenarios/local.once/ONCE/0.2.0.0/**/*.scenario.json`
2. For each scenario:
   - If `state.state === 'shutdown'` → **DELETE** scenario
   - If `state.state === 'running'` → Try HTTP health check to port
     - If reachable → Log "discovered"
     - If unreachable → **DELETE** scenario (stale)

**Why:** Cleans up shutdown servers and crashed servers on restart

**Location:** `ServerHierarchyManager.ts:performHousekeeping()`

### 3. Client Registration (`registerWithPrimaryServer()`)

**Flow:**
```
Client: registerWithPrimaryServer()
  → WebSocket.connect('ws://localhost:42777')
  → Send { type: 'register', model: ONCEServerModel }
  
Primary: handleWebSocketMessage({ type: 'register', ... })
  → serverRegistry.set(uuid, { model, websocket })
  → Send { type: 'registration-confirmed', primaryServerModel }
  
Client: Receives confirmation
  → Update model.primaryServerIOR
  → Set state to REGISTERED
```

**Key Methods:**
- `ServerHierarchyManager.ts:registerWithPrimaryServer()` - Client side
- `ServerHierarchyManager.ts:handleWebSocketMessage()` - Primary side (case 'register')

### 4. HTTP Server Routes (`handleHttpRequest()`)

**Primary Server Routes:**

| Route | Method | Purpose |
|-------|--------|---------|
| `/` | GET | Server status page (uses `server-status.html` template) |
| `/once` | GET | Interactive client (uses `once-client.html` template) |
| `/demo` | GET | Live server dashboard (uses `demo-hub.html` template) |
| `/servers` | GET | JSON list of registered clients |
| `/start-server` | POST | Spawn new client server via `exec()` |
| `/health` | GET | JSON health check |
| `/dist/*` | GET | Static files from `dist/` |
| `/src/*` | GET | Static files from `src/` |

**Client Server Routes:**
- Same as primary, but `/servers` only returns empty list
- `/demo` shows primary + all clients with auto-refresh

**Template Rendering:**
- Uses `new Function('return \`...\`').call(this)` pattern
- Native JS template literals `${this.property}` with Radical OOP `this` context
- Templates loaded synchronously from `src/view/html/`

**Location:** `ServerHierarchyManager.ts:handleHttpRequest()`

## HTML Template Rendering

### Overview

ONCE uses a **TRUE Radical OOP template rendering system** that leverages native JavaScript template literals with dynamic `this` context binding. This approach eliminates the need for external template engines while maintaining strict separation of concerns.

### Rendering Architecture

#### 1. Template Files

All HTML templates are stored in `src/view/html/`:

```
src/view/html/
├── server-status.html    # Rendered with this context (dynamic)
├── demo-hub.html         # Served as static file
└── once-client.html      # Served as static file
```

#### 2. Rendering Methods

**Rendered Templates (Dynamic):**
- **`server-status.html`** - Uses `renderTemplate()` with full `this` context
- Accessed via: `http://localhost:{port}/`

**Static Templates (No Rendering):**
- **`demo-hub.html`** - Served as-is, no variable substitution
- **`once-client.html`** - Served as-is, contains client-side JavaScript
- Accessed via: `http://localhost:{port}/demo` and `http://localhost:{port}/once`

### The renderTemplate() Method

**Location:** `ServerHierarchyManager.ts:renderTemplate()`

```typescript
private renderTemplate(templatePath: string): string {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const fullPath = path.join(dirname, '../../../src/view/html', templatePath);
    const template = fs.readFileSync(fullPath, 'utf-8');
    
    // Escape backticks in template to prevent breaking the Function constructor
    const escapedTemplate = template.replace(/`/g, '\\`');
    
    // Create function with template as return value, call with this context
    return new Function('return `' + escapedTemplate + '`;').call(this);
}
```

**How it works:**
1. Loads HTML template from filesystem
2. Escapes backticks to prevent syntax errors
3. Wraps template in `` `...` `` (template literal)
4. Creates new Function that returns the template
5. Calls function with `.call(this)` - binding ServerHierarchyManager instance
6. All `${this.property}` expressions are evaluated in that context

### Available Template Variables

When a template is rendered, it has access to all `private get` properties of `ServerHierarchyManager`:

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `${this.version}` | string | Component version from path | `0.3.20.3` |
| `${this.httpPort}` | string | HTTP server port | `42777` or `8080` |
| `${this.wsPort}` | string | WebSocket server port | `42777` or `8080` |
| `${this.serverModel.uuid}` | string | Server unique ID | `e14f88d0-...` |
| `${this.serverModel.isPrimaryServer}` | boolean | Primary vs client | `true` / `false` |
| `${this.serverModel.domain}` | string | Server domain | `local.once` |
| `${this.serverModel.state}` | string | Lifecycle state | `running` |
| `${this.capabilitiesHTML}` | string | Rendered capabilities | HTML string |

### Template Syntax

#### Basic Variable Substitution

```html
<title>ONCE Server v${this.version}</title>
<p>Server UUID: ${this.serverModel.uuid}</p>
<p>Port: ${this.httpPort}</p>
```

#### Conditional Rendering

```html
<span class="${this.serverModel.isPrimaryServer ? 'primary-badge' : 'client-badge'}">
    ${this.serverModel.isPrimaryServer ? '🟢 Primary Server' : '🔵 Client Server'}
</span>
```

#### Complex Expressions

```html
${this.serverModel.isPrimaryServer ? 
    '<div class="primary-info">...</div>' : 
    ''}
```

**⚠️ Important:** Avoid nested template literals inside conditionals. Use single quotes for HTML strings:

```html
<!-- ❌ BAD - Nested backticks break rendering -->
${condition ? `<div>...</div>` : ''}

<!-- ✅ GOOD - Single quotes -->
${condition ? '<div>...</div>' : ''}
```

### Path Authority for Version

The `version` getter demonstrates **path authority** principle:

```typescript
private get version(): string {
    // Derive version from component directory path
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const match = dirname.match(/ONCE\/(\d+\.\d+\.\d+\.\d+)/);
    return match ? match[1] : '0.3.20.3';
}
```

**Why:** Version is extracted from the file system path (`/ONCE/0.3.20.3/`) rather than hardcoded. If component is copied to a new version directory, the version automatically updates.

### Adding New Template Variables

To add a new variable accessible in templates:

1. **Add getter in ServerHierarchyManager:**
```typescript
private get myNewProperty(): string {
    return this.serverModel.someValue || 'default';
}
```

2. **Use in template:**
```html
<p>My Property: ${this.myNewProperty}</p>
```

3. **Rebuild** - Templates are loaded at runtime from `src/`, so changes take effect immediately after restart.

### Static File Serving

For HTML files that contain client-side JavaScript (like `once-client.html`), we serve them as **static files** instead of rendering:

```typescript
private getSimpleONCEClientHTML(): string {
    // Serve as static - no rendering with this context
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    const fullPath = path.join(dirname, '../../../src/view/html/once-client.html');
    return fs.readFileSync(fullPath, 'utf-8');
}
```

**Why:** These files contain browser-executable JavaScript with their own template literals. Rendering them with `this` context would break the client-side code.

### Template Development Workflow

1. **Edit template** in `src/view/html/server-status.html`
2. **Add variable** in `ServerHierarchyManager.ts` as `private get`
3. **Reference variable** in template as `${this.variableName}`
4. **Rebuild** with `./src/sh/build.sh`
5. **Restart server** with `./once demo`
6. **View changes** at `http://localhost:42777/`

No external tools required - pure TypeScript and native JavaScript template literals.

### Benefits of This Approach

1. **Zero Dependencies** - No template engine libraries needed
2. **Type Safety** - TypeScript checks all property access
3. **Radical OOP** - Templates use actual instance properties
4. **Hot Reload** - Templates loaded from source at runtime
5. **Path Authority** - Version derived from filesystem, not config
6. **Separation of Concerns** - HTML in `src/view/html/`, logic in `.ts`

### Common Pitfalls

#### 1. Forgetting to Escape Backticks
**Problem:** Template contains backticks `` ` `` that break Function constructor
**Solution:** `renderTemplate()` automatically escapes them: `.replace(/\`/g, '\\`')`

#### 2. Nested Template Literals
**Problem:** Using `` `...` `` inside `${}` expressions
**Solution:** Use single quotes `'...'` for HTML strings in conditionals

#### 3. Async Operations in Getters
**Problem:** Trying to use `async get version()` - not allowed
**Solution:** All template data must be synchronous (Radical OOP Layer 2/3)

#### 4. Missing Property
**Problem:** Template uses `${this.missingProp}` → renders "undefined"
**Solution:** Add getter or provide default: `${this.prop || 'default'}`

 5. WebSocket Message Routing (`handleWebSocketMessage()`)

**Message Types:**

#### `register` (Client → Primary)
```typescript
{ type: 'register', model: ONCEServerModel }
```
→ Primary adds to `serverRegistry`
→ Responds with `registration-confirmed`

#### `scenario-message` (Broadcast)
```typescript
{
  type: 'scenario-message',
  scenario: ONCEScenarioMessage,
  fromPrimary?: boolean  // ← CRITICAL FLAG
}
```

**Broadcast Flow:**
1. **Browser → Client Server:**
   - Browser sends broadcast via WebSocket
   - Client receives, sees `fromPrimary` is undefined/false
   - Client forwards to primary via `primaryServerConnection.send()`

2. **Primary → All Clients:**
   - Primary receives from client
   - Primary calls `broadcastScenario(scenario)`
   - Sends to ALL registered clients with `fromPrimary: true`

3. **Client → Browser:**
   - Client receives message with `fromPrimary: true`
   - Client calls `broadcastToBrowserClients(scenario)`
   - Sends to ALL browser WebSocket clients on this server

**Key Methods:**
- `ServerHierarchyManager.ts:handleWebSocketMessage()` - Router
- `ServerHierarchyManager.ts:broadcastScenario()` - Primary → Clients
- `ServerHierarchyManager.ts:broadcastToBrowserClients()` - Client → Browsers

#### `scenario-relay` (Primary relays to specific client)
```typescript
{
  type: 'scenario-relay',
  scenario: ONCEScenarioMessage,
  targetUuid: string
}
```
→ Primary finds client by UUID, forwards message

#### `scenario-p2p` (Direct peer-to-peer)
```typescript
{
  type: 'scenario-p2p',
  scenario: ONCEScenarioMessage,
  targetPort: number
}
```
→ Sender creates direct WebSocket to target port
→ Sends message directly (no primary relay)

**Location:** `ServerHierarchyManager.ts:handleWebSocketMessage()`

### 6. Graceful Shutdown

#### Local Shutdown (`stopServer()`)

**Flow:**
```
DefaultONCE.stopServer()
  → ServerHierarchyManager.stopServer()
    → Set state to STOPPING
    → updateScenarioState(STOPPING)  # ← Updates filesystem
    → Close primaryServerConnection (if client)
    → Close wsServer
    → Close httpServer
      → On close callback:
        → Set state to SHUTDOWN
        → updateScenarioState(SHUTDOWN)  # ← Updates filesystem
        → process.exit(0)  # ← Client servers only
```

**Why Two Updates?**
1. `STOPPING` → Marks server as "shutting down" (in progress)
2. `SHUTDOWN` → Marks server as "fully stopped" (ready for cleanup)

Primary server housekeeping deletes scenarios with `state === 'shutdown'`

**Location:** `ServerHierarchyManager.ts:stopServer()`, `updateScenarioState()`

#### Remote Shutdown (via Demo Hub UI)

**Complete Flow:**

1. **User clicks "🛑 Stop Server" button** on demo hub
   - JavaScript: `stopServer(port, uuid)`
   - POST to `http://localhost:42777/stop-server`
   - Body: `{ port: 8080, uuid: "3d3cdf4b..." }`

2. **Primary server receives stop request**
   - Route: `/stop-server` in `handleHttpRequest()`
   - Finds server in `serverRegistry.get(uuid)`
   - Validates WebSocket connection exists

3. **Primary sends shutdown command**
   - WebSocket message: `{ type: 'shutdown-command' }`
   - Waits 1000ms for client to update scenario

4. **Client receives shutdown command**
   - Handler: `case 'shutdown-command'` in `handleWebSocketMessage()`
   - Triggers `stopServer()` method
   - Updates scenario: `STOPPING` → `SHUTDOWN`
   - Closes WebSocket, HTTP connections
   - **Process exits** after 100ms (`process.exit(0)`)

5. **Primary cleans up** (after 1000ms wait)
   - Deletes scenario file: `scenarios/.../httpPort/8080/{uuid}.scenario.json`
   - Removes from registry: `serverRegistry.delete(uuid)`
   - Returns HTTP response: `{ success: true, message: 'Server stopped' }`

6. **UI auto-updates**
   - Demo hub polls `/servers` every 3 seconds
   - Server card disappears from grid
   - Status bar counts update (Running, Clients, Stopped)

**Shutdown States:**
- `STOPPING` - Server is shutting down (connections closing)
- `SHUTDOWN` - Server has stopped (scenario ready for cleanup)

**Primary Housekeeping on Restart:**
- Loads existing scenarios from `scenarios/local.once/ONCE/0.2.0.0/`
- Deletes any `SHUTDOWN` or `STOPPED` scenarios
- Health-checks `RUNNING` scenarios (HTTP request to port)
- Removes stale scenarios if health check fails

**Key Files:**
- `ServerHierarchyManager.ts:stopServer()` - Graceful shutdown logic
- `ServerHierarchyManager.ts:updateScenarioState()` - Scenario file updates
- `ServerHierarchyManager.ts:handleHttpRequest()` - `/stop-server` endpoint
- `ServerHierarchyManager.ts:handleWebSocketMessage()` - `shutdown-command` handler
- `ServerHierarchyManager.ts:performHousekeeping()` - Startup cleanup
- `demo-hub.html:stopServer()` - UI button action

**Process Termination:**
- **Client servers:** `process.exit(0)` after 100ms delay (ensures scenario update completes)
- **Primary server:** No exit (remains running for demo hub and other clients)

**Scenario File Location:**
```
scenarios/local.once/ONCE/0.2.0.0/
├── {uuid}.scenario.json  # Root-level scenario
└── capability/
    └── httpPort/
        ├── 42777/{uuid}.scenario.json  # Primary server
        ├── 8080/{uuid}.scenario.json   # Client 1
        ├── 8081/{uuid}.scenario.json   # Client 2
        └── 8082/{uuid}.scenario.json   # Client 3
```

Each scenario file contains:
```json
{
  "uuid": "3d3cdf4b-5470-4a4a-8027-2476852baf7a",
  "state": {
    "state": "shutdown",  // ← Updated during stopServer()
    "capabilities": [{ "capability": "httpPort", "port": 8080 }]
  },
  "metadata": {
    "modified": "2025-11-12T10:45:30.123Z"  // ← Updated on state change
  }
}
```

## Testing

### First-Time Setup

The E2E tests use Playwright for browser automation. When you first run `npm install`, the browsers are automatically installed via the `postinstall` hook. If you need to manually install them:

```bash
# Install Playwright browsers (automatic on npm install)
npm run test:e2e:setup

# Or directly
npx playwright install chromium
```

### Running Tests

```bash
# All tests
npm test

# Specific test suite
npx vitest run browser-broadcast.test.ts
npx vitest run lifecycle-management.test.ts
npx vitest run e2e-browser-ui.test.ts

# Using ONCE CLI (recommended)
./once test all           # Run all tests
./once test file 1        # Run first test file
./once test file 3        # Run e2e-browser-ui.test.ts
```

### Test Suites

#### 1. Browser Broadcast Test (`browser-broadcast.test.ts`)

**What it tests:**
- End-to-end broadcast flow from browser client through server hierarchy
- Browser on client 8080 sends broadcast
- Browser on client 8081 receives broadcast

**How it works:**
1. Starts primary (42777) + 2 clients (8080, 8081)
2. Connects 2 WebSocket clients (simulating browsers)
3. Browser1 sends broadcast message
4. Asserts Browser2 receives the message

**Key Assertion:**
```typescript
expect(broadcastReceived).toBeDefined();
expect(broadcastReceived.scenario.state.type).toBe('broadcast');
```

#### 2. Lifecycle Management Test (`lifecycle-management.test.ts`)

**Test Cases:**

##### a) Delete Shutdown Scenarios
- Creates a shutdown scenario manually
- Starts primary server
- Asserts scenario was deleted by housekeeping

##### b) Discover Running Client Scenarios
- Starts client first, then stops it
- Manually sets scenario back to "running"
- Starts primary server
- Asserts stale scenario was deleted (health check failed)

##### c) Graceful Shutdown State Updates
- Starts server, gets scenario path
- Stops server
- Asserts scenario shows `state: 'shutdown'`

##### d) Dynamic Server Addition
- Starts primary, verifies 0 clients
- Starts client 1, verifies 1 client registered
- Starts client 2, verifies 2 clients registered

##### e) Client Disconnect Cleanup
- Starts primary + client
- Stops client gracefully
- Asserts scenario shows `state: 'shutdown'`

##### f) Scenario Persistence Across Restarts
- Starts server1, stops it (creates shutdown scenario)
- Starts server2
- Asserts original shutdown scenario was cleaned up

**All 6 tests pass**

#### 3. End-to-End Browser UI Test (`e2e-browser-ui.test.ts`)

**What it tests:**
- Real browser interaction using Playwright
- Actual DOM element clicks, text input, navigation
- Visual verification of UI state changes
- Complete user workflow from browser to server to browser

**Technology:**
- **Playwright** - Browser automation framework
- **Chromium** - Real browser engine (not headless by default)
- **Vitest** - Test runner with assertions

**Test Cases:**

##### a) Demo Hub Navigation
```typescript
await page.goto('http://localhost:42777/demo');
const totalServers = await page.locator('#totalServers').textContent();
expect(parseInt(totalServers)).toBeGreaterThanOrEqual(3);
```
- Opens demo hub in real browser
- Reads server count from DOM
- Verifies all servers displayed

##### b) Client Page Connection Status
```typescript
await page1.goto('http://localhost:8080/once');
const status = await page1.locator('.connection-status').textContent();
expect(status).toContain('Connected');
```
- Opens two client pages simultaneously
- Verifies WebSocket connection status shown in UI

##### c) Broadcast Message Flow (UI Interaction)
```typescript
await page1.click('button:has-text("Broadcast to All")');
await new Promise(resolve => setTimeout(resolve, 2000));
const sent = await page1.locator('#messagesSent').textContent();
const received = await page2.locator('#messagesReceived').textContent();
expect(parseInt(sent)).toBeGreaterThan(0);
expect(parseInt(received)).toBeGreaterThan(0);
```
- Clicks actual "Broadcast to All" button
- Waits for message propagation
- Reads message counters from both pages
- Verifies message sent and received

##### d) Clear Log Button
```typescript
await page1.click('button:has-text("Clear Log")');
const logAfterClear = await page1.locator('#messageLog').textContent();
expect(logAfterClear.length).toBeLessThan(logBeforeClear.length);
```
- Clicks "Clear Log" button
- Verifies log content reduced

##### e) Server List on Demo Hub
- Counts `.server-card` elements
- Verifies primary badge present
- Verifies client badges present
- All dynamic content loaded from `/servers` API

##### f) Server Status Page Routes
- Opens `http://localhost:42777/`
- Verifies all route links present (`/health`, `/once`, `/demo`, `/servers`)
- Checks page title contains version

##### g) Cross-Page Navigation
- Navigates between `/`, `/demo`, `/once`
- Verifies page titles change correctly
- Tests SPA-style navigation

##### h) Connected Servers Count Display
- Opens browser client
- Waits for `/servers` API call
- Reads "Connected Servers" display
- Verifies count matches actual running servers

**Running E2E Tests:**
```bash
# Run E2E tests (opens visible browser)
npx vitest run e2e-browser-ui.test.ts

# Watch mode for development
npx vitest watch e2e-browser-ui.test.ts
```

**Key Features:**
- **Non-Headless Mode**: Browsers visible during test (set `headless: false`)
- **Slow Motion**: Actions slowed to 100ms for visual verification
- **Real DOM**: Actual HTML elements, not mocks
- **Full Stack**: Primary + 2 client servers running
- **Graceful Cleanup**: Closes browsers, stops servers, deletes scenarios

**Test Results:**
```
Test Files  1 passed (1)
Tests       8 passed (8)
Duration    ~33s
```

**What Makes This Different:**

| Feature | Unit Tests | WebSocket Tests | E2E Browser Tests |
|---------|-----------|-----------------|-------------------|
| Real Browser | ❌ | ❌ | ✅ |
| DOM Interaction | ❌ | ❌ | ✅ |
| Button Clicks | ❌ | ❌ | ✅ |
| Visual Verification | ❌ | ❌ | ✅ |
| WebSocket Messages | ❌ | ✅ | ✅ |
| Server Lifecycle | ❌ | ✅ | ✅ |
| User Workflow | ❌ | ❌ | ✅ |

**When to Use Each:**
- **Unit Tests**: Fast feedback on logic changes
- **WebSocket Tests**: Verify message routing without UI
- **E2E Browser Tests**: Verify complete user experience

**Dependencies:**
```json
{
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "playwright": "^1.56.1"
  }
}
```

**First-Time Setup:**
```bash
# Install Playwright browsers
npx playwright install chromium
```

## Common Issues & Fixes

### Issue: Browser doesn't receive broadcasts from other clients

**Symptom:** Client 8080 sends message, but client 8081's browser doesn't receive it

**Root Cause:** `fromPrimary` flag not set correctly, or client not forwarding to browsers

**Fix Location:** `ServerHierarchyManager.ts:handleWebSocketMessage()`

**What to check:**
1. Client forwards browser messages to primary: `if (!fromPrimary) { send to primary }`
2. Primary marks messages: `broadcastScenario()` sets `fromPrimary: true`
3. Client forwards to browsers: `if (fromPrimary) { broadcastToBrowserClients() }`

### Issue: Servers hang on shutdown

**Symptom:** `stopServer()` never completes, process hangs

**Root Cause:** WebSocket connections not closed, or `httpServer.close()` callback never fires

**Fix Location:** `ServerHierarchyManager.ts:stopServer()`

**What to check:**
1. Close WebSockets BEFORE HTTP server
2. Use `httpServer.close(callback)` pattern
3. Ensure callback updates scenario state

### Issue: Port already in use

**Symptom:** "EADDRINUSE" error on startup

**Root Cause:** Previous server didn't shut down cleanly

**Fix:**
```bash
# Use graceful shutdown (Ctrl+C or 'q' in interactive mode)
# Servers will clean up properly

# If absolutely necessary, check for orphan processes:
lsof -ti:42777
lsof -ti:8080

# Then stop gracefully via HTTP API:
curl -X POST http://localhost:42777/stop-server
```

### Issue: Housekeeping deletes running servers

**Symptom:** Scenarios disappear for active servers

**Root Cause:** Housekeeping health check timing, or HTTP server not responding to `/health`

**Fix Location:** `ServerHierarchyManager.ts:performHousekeeping()`

**What to check:**
1. Health check timeout (currently 1000ms) might be too short
2. Ensure `/health` route returns 200 status
3. Check network connectivity (localhost resolution)

### Issue: Client server doesn't register with primary

**Symptom:** Client starts but doesn't appear in primary's registry

**Root Cause:** WebSocket connection failed, or registration message not sent

**Fix Location:** `ServerHierarchyManager.ts:registerWithPrimaryServer()`

**What to check:**
1. Primary server is running FIRST
2. WebSocket connects to correct port (42777)
3. Registration message includes full `ONCEServerModel`
4. Primary's WebSocket server is accepting connections

### Issue: Demo hub shows wrong server count

**Symptom:** `/demo` page shows 0 servers or stale data

**Root Cause:** `/servers` endpoint not returning data, or CORS blocking request

**Fix Location:** `ServerHierarchyManager.ts:handleHttpRequest()`

**What to check:**
1. `/servers` route has CORS headers: `Access-Control-Allow-Origin: *`
2. Primary server's `serverRegistry` is populated
3. Browser console shows no CORS errors
4. Demo hub polls every 3 seconds

## CLI Commands

```bash
# Start interactive demo (keyboard controls)
./once demo

# Start demo with N client servers (automated messages)
./once demo 2

# Start single server
./once startServer

# Test input (non-interactive)
./once testInput demo

# Get parameter completions
./once demo <TAB>
```

## Model-Driven State

All component state lives in `ONCEModel`:

```typescript
interface ONCEModel extends Model {
  initialized: boolean;
  serverModel?: ONCEServerModel;  // Current server state
  messageTracker?: {              // Message exchange stats
    sent: ONCEScenarioMessage[];
    received: ONCEScenarioMessage[];
    acknowledged: ONCEScenarioMessage[];
    patternCounts: {
      broadcast: number;
      relay: number;
      p2p: number;
    };
  };
}
```

**NO private properties.** Everything is in the model.

## Scenario Format

```json
{
  "uuid": "de540b72-3fe8-4b8c-9286-8a9be3e6e13e",
  "objectType": "ONCE",
  "version": "0.2.0.0",
  "state": {
    "pid": 12345,
    "state": "running",  // ← CRITICAL for housekeeping
    "platform": { "os": "darwin", "arch": "x64", "hostname": "..." },
    "domain": "local.once",
    "host": "...",
    "ip": "127.0.0.1",
    "capabilities": [
      { "capability": "httpPort", "port": 42777 },
      { "capability": "wsPort", "port": 42777 }
    ],
    "uuid": "de540b72-3fe8-4b8c-9286-8a9be3e6e13e",
    "isPrimaryServer": true
  },
  "metadata": {
    "created": "2025-11-12T10:30:00.000Z",
    "modified": "2025-11-12T10:30:00.000Z"
  }
}
```

**Stored at:** `scenarios/local.once/ONCE/0.2.0.0/capability/httpPort/{port}/{uuid}.scenario.json`

## Key State Transitions

```
CREATED
  → INITIALIZING (init())
    → INITIALIZED
      → STARTING (startServer())
        → PRIMARY_SERVER (if port 42777)
          → Housekeeping
        → CLIENT_SERVER (if port 8080+)
          → Register with primary
        → RUNNING
          → STOPPING (stopServer())
            → SHUTDOWN (final state)
```

## WebSocket Architecture

### Primary Server
- **1 WebSocket Server** (attached to HTTP server)
- **N client connections** (stored in `serverRegistry`)
- Broadcasts to all clients via `for (const [uuid, entry] of serverRegistry)`

### Client Server
- **1 WebSocket Server** (attached to HTTP server) - for browser clients
- **1 WebSocket Client** (`primaryServerConnection`) - to primary server
- **N browser connections** (via `wsServer.clients`)
- Forwards browser messages to primary
- Forwards primary broadcasts to browsers

### Browser Client
- **1 WebSocket Client** - to parent server (primary or client)
- Sends `scenario-message`, `scenario-relay`, `scenario-p2p`
- Receives broadcasts, relays, direct messages

## File Responsibility Map

| Task | File | Method |
|------|------|--------|
| Start server | `DefaultONCE.ts` | `startServer()` |
| Create HTTP/WS servers | `ServerHierarchyManager.ts` | `startHttpServer()`, `startWebSocketServer()` |
| Allocate ports | `PortManager.ts` | `getNextAvailablePort()` |
| Register client | `ServerHierarchyManager.ts` | `registerWithPrimaryServer()` |
| Handle WS messages | `ServerHierarchyManager.ts` | `handleWebSocketMessage()` |
| Broadcast to clients | `ServerHierarchyManager.ts` | `broadcastScenario()` |
| Broadcast to browsers | `ServerHierarchyManager.ts` | `broadcastToBrowserClients()` |
| Route HTTP requests | `ServerHierarchyManager.ts` | `handleHttpRequest()` |
| Render templates | `ServerHierarchyManager.ts` | `getServerStatusHTML()`, `getSimpleONCEClientHTML()`, `getDemoHubHTML()` |
| Save scenarios | `ScenarioManager.ts` | `saveScenario()` |
| Load scenarios | `ScenarioManager.ts` | `loadScenario()` |
| Housekeeping | `ServerHierarchyManager.ts` | `performHousekeeping()` |
| Graceful shutdown | `ServerHierarchyManager.ts` | `stopServer()`, `updateScenarioState()` |
| Demo commands | `DefaultONCE.ts` | `demo()`, `demoMessages()` |
| Test input | `DefaultONCE.ts` | `testInput()` |

## Build & Deploy

```bash
# Build
./src/sh/build.sh

# Build without linting
./src/sh/build.sh nolint

# Lint only
npm run lint

# Run CLI
./once --help
```

## Version Management & Upgrade Workflow

### Upgrading to Next Version

ONCE uses Web4TSComponent's upgrade infrastructure since it doesn't implement its own `upgrade` command:

```bash
# Upgrade ONCE to next build version (e.g., 0.3.20.3 → 0.3.20.4)
cd /path/to/project
./components/Web4TSComponent/latest/web4tscomponent on ONCE 0.3.20.3 upgrade nextBuild

# This creates a new version directory and automatically updates the 'latest' symlink
```

### Freezing a Version

**"Freezing"** means we're done working on a version and moving to the next one. The process:

1. **Upgrade** to create the next version (see above)
2. **Latest symlink** automatically points to the new version
3. **Other symlinks remain unchanged** (dev, prod stay pointing to their respective versions)

**Example:**
```bash
# Before upgrade
dev    → 0.3.20.2
latest → 0.3.20.3  (working version)
prod   → 0.3.20.0

# After "once on ONCE 0.3.20.3 upgrade nextBuild"
dev    → 0.3.20.2
latest → 0.3.20.4  (NEW working version - 0.3.20.3 is now frozen)
prod   → 0.3.20.0
```

### CI/CD Semantic Links

Use `setCICDVersion` to manage semantic symlinks:

```bash
# Set dev to point to current working version
./once setCICDVersion dev 0.3.20.4

# Set prod to point to a stable version (careful! this is production)
./once setCICDVersion prod 0.3.20.4

# Check current symlinks
ls -la components/ONCE/ | grep "^l"
```

**Semantic Link Meanings:**
- `latest` - Current development version (auto-updated on upgrade)
- `dev` - Development testing version
- `prod` - Production-stable version (change rarely!)
- `test` - Test automation version

### Important Notes

1. **Freezing ≠ Changing prod**: When you freeze a version, `prod` stays unchanged unless explicitly updated
2. **Automatic latest**: The `upgrade` command automatically updates `latest` to the new version
3. **No upgrade command in ONCE**: Use Web4TSComponent as shown above - ONCE delegates infrastructure commands to it
4. **Version immutability**: Once frozen, a version directory should not be modified (frozen code principle)

## TODOs / Known Issues

1. **Start Next Server button** - Currently spawns via `exec()`, should use programmatic approach
2. **P2P connections** - Created but never reused, should maintain connection pool
3. **Server discovery** - Health checks on every housekeeping, should cache reachability
4. **WebSocket reconnection** - Clients don't reconnect if primary restarts
5. **Scenario cleanup** - Only on primary startup, should have periodic cleanup
6. **Browser client list** - Fetches all ports 8080-8085, should query primary for actual list

## Summary

ONCE implements a **hierarchical server architecture** where:
1. **Primary server (42777)** manages registry of all clients
2. **Client servers (8080+)** register with primary, relay browser messages
3. **Browser clients** connect to any server, send/receive messages
4. **Scenarios** persist all state to filesystem
5. **Housekeeping** cleans up shutdown/stale servers on primary startup
6. **Graceful shutdown** updates scenario state before stopping
7. **Tests** verify broadcast flow and lifecycle management

All communication flows through WebSockets. All state is model-driven. All lifecycle events are tracked in scenarios.

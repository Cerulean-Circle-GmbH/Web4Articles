# Security Advisory - Web4TSComponent 0.3.13.1

**Date:** 2025-10-14  
**Status:** Node 18 Compatibility vs Security Trade-off  

---

## Current Security Situation

### Vulnerabilities Identified
- **Severity:** Moderate (5 vulnerabilities)
- **Affected:** Development dependencies only (esbuild, vite, vitest chain)
- **Issue:** [GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
  - esbuild enables development server to send requests and read responses
  - **Impact:** Development environment only, not production runtime

### Current Configuration
```json
{
  "engines": { "node": ">=18.0.0" },
  "devDependencies": {
    "@types/node": "^18.19.0",
    "typescript": "^5.7.3",
    "vitest": "^2.1.9"
  },
  "dependencies": {
    "glob": "^10.4.5",
    "minimatch": "^9.0.5"
  }
}
```

---

## Resolution Options

### Option 1: Accept Development-Time Risk (Current)
**Status:** ✅ Current configuration  
**Node Version:** 18.20.8  
**Risk Level:** Low (dev dependencies only)

**Rationale:**
- Vulnerabilities affect development server, not production runtime
- Component has no production dependencies with vulnerabilities
- Node 18 compatibility maintained for broader environment support

**Mitigation:**
- Don't expose development server to untrusted networks
- Use `npm test` (vitest) in isolated environments
- Production builds are unaffected

### Option 2: Upgrade to Node 20+ (Recommended for New Projects)
**Status:** ⏳ Requires Node upgrade  
**Node Version:** 20.17.0+ or 22.9.0+  
**Risk Level:** None

**Steps:**
```bash
# Upgrade Node to 20.17.0+ or 22.9.0+
nvm install 20
nvm use 20

# Update package.json
{
  "engines": { "node": ">=20.17.0" },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.7.3",
    "vitest": "^3.2.4"
  },
  "dependencies": {
    "glob": "^11.0.3",
    "minimatch": "^10.0.3"
  }
}

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

**Benefits:**
- Zero security vulnerabilities
- Latest features and performance improvements
- Future-proof dependency chain

### Option 3: Lock to Specific Secure Versions
**Status:** 🔧 Manual maintenance  
**Node Version:** 18.20.8  
**Risk Level:** Medium (manual tracking required)

Monitor and manually update to patched versions as they become available for Node 18 compatible dependencies.

---

## Recommendation by Use Case

### For Production Deployments
- **Use Option 1** if stuck on Node 18 (e.g., AWS Lambda, legacy systems)
- Deploy built artifacts (dist/) without devDependencies
- Run `npm ci --production` to exclude dev dependencies

### For Active Development
- **Use Option 2** - Upgrade to Node 20+ for best security posture
- Modern Node versions provide better performance
- All security vulnerabilities resolved

### For CI/CD Pipelines
- Use Node 20+ in CI for testing
- Build artifacts are Node-version independent
- Separate deployment environment can use any Node version

---

## Vulnerability Context

### What's NOT Affected
✅ Production runtime code  
✅ Built JavaScript in `dist/`  
✅ CLI execution (`./web4tscomponent`)  
✅ Component API and functionality  

### What IS Affected
⚠️ Development server (vitest dev mode)  
⚠️ Test environment with exposed dev server  
⚠️ Local development if dev server is network-accessible  

---

## Fixes Applied (2025-10-14)

### 1. Runtime Bug Fix
**Issue:** `ReferenceError: crypto is not defined`  
**Fix:** Added proper crypto import
```typescript
import { randomUUID } from 'crypto';
// Changed: crypto.randomUUID() → randomUUID()
```

### 2. Engine Compatibility
**Issue:** Dependencies requiring Node 20+ installed on Node 18  
**Fix:** 
- Added `"engines": { "node": ">=18.0.0" }` to package.json
- Downgraded to Node 18 compatible versions:
  - `glob`: 11.0.3 → 10.4.5
  - `minimatch`: 10.0.3 → 9.0.5
  - `vitest`: 3.2.4 → 2.1.9
  - `@types/node`: 24.1.0 → 18.19.0

### 3. Latest Node 18 Versions
**Action:** Updated to latest compatible versions within Node 18 constraints

---

## Monitoring

**Check for updates:**
```bash
npm outdated
npm audit
```

**Track Node 18 support:**
- Monitor vitest/vite roadmaps for Node 18 security patches
- Watch for esbuild security updates compatible with vite 6.x

---

## Conclusion

**Current Status:** ✅ Functional with documented security trade-offs  

The component is **production-ready** with development-time security considerations. For maximum security, upgrade to Node 20+ when possible.

**"Security is a spectrum, not a binary state"** - Choose the option that fits your deployment constraints. 🛡️


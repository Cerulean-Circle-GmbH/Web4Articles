#!/usr/bin/env sh
# 🚀 Auto-initialize Web4 project structure (if needed)

# DRY: Source shared project root discovery library
# @pdca 2025-11-05-UTC-2301.dry-shell-libraries.pdca.md
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
. "$SCRIPT_DIR/lib-project-root.sh"
# PROJECT_ROOT is now available (set by library)

# Ensure root tsconfig.json exists and is valid
TSCONFIG_VALID=true
if [ -f "$PROJECT_ROOT/tsconfig.json" ]; then
    # Check if it's valid JSON and has required Web4 structure
    if ! node -e "try { const c = require('$PROJECT_ROOT/tsconfig.json'); if (!c.compilerOptions || !c.compilerOptions.module) process.exit(1); } catch(e) { process.exit(1); }" 2>/dev/null; then
        TSCONFIG_VALID=false
        echo "⚠️  Detected corrupted tsconfig.json - backing up and resetting..."
        mv "$PROJECT_ROOT/tsconfig.json" "$PROJECT_ROOT/tsconfig.json.backup.$(date +%Y%m%d-%H%M%S)"
    fi
fi

if [ ! -f "$PROJECT_ROOT/tsconfig.json" ] || [ "$TSCONFIG_VALID" = false ]; then
    echo "🚀 Initializing Web4 project structure..."
    echo "   Creating root tsconfig.json..."
    cat > "$PROJECT_ROOT/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "moduleDetection": "force",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "types": ["node"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "test/**/*.ts", "components/**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
EOF
fi

# Ensure root package.json exists and is valid
PACKAGE_VALID=true
if [ -f "$PROJECT_ROOT/package.json" ]; then
    # Check if it's valid JSON
    if ! node -e "require('$PROJECT_ROOT/package.json')" 2>/dev/null; then
        PACKAGE_VALID=false
        echo "⚠️  Detected corrupted package.json - backing up and resetting..."
        mv "$PROJECT_ROOT/package.json" "$PROJECT_ROOT/package.json.backup.$(date +%Y%m%d-%H%M%S)"
    fi
fi

if [ ! -f "$PROJECT_ROOT/package.json" ] || [ "$PACKAGE_VALID" = false ]; then
    echo "   Creating root package.json..."
    cat > "$PROJECT_ROOT/package.json" << 'EOF'
{
  "name": "web4-project",
  "version": "1.0.0",
  "type": "module",
  "description": "Web4 Component Architecture Project",
  "private": true,
  "devDependencies": {
    "@types/node": "^24.1.0",
    "typescript": "^5.9.3",
    "vitest": "^3.2.4"
  },
  "dependencies": {
    "glob": "^11.0.3",
    "minimatch": "^10.0.3"
  }
}
EOF
fi

# Ensure global node_modules exists
if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "   Installing global dependencies..."
    cd $PROJECT_ROOT
    npm install
    cd - > /dev/null
    echo "   ✅ Web4 project initialized"
fi

echo "📦 Installing component dependencies..."
npm install

echo "🔗 Replacing with symlink to shared node_modules (DRY principle)..."
rm -rf node_modules
ln -sf ../../../node_modules node_modules
echo "✅ Component uses globally shared dependencies"

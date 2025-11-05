#!/bin/sh
echo "🧹 Cleaning all artifacts..."
rm -rf dist
rm -rf node_modules
# Note: Global node_modules at project root is NOT cleaned by component clean
# Use 'npm run clean:global' at project root to clean global node_modules

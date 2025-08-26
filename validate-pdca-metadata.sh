#!/bin/bash

# PDCA Metadata Validation Script (Decision 3c: Automated checks)
# Prevents future PDCA process violations by checking required metadata fields

set -e

echo "🔍 PDCA Metadata Validation Tool"

PDCA_FILE="$1"

if [[ -z "$PDCA_FILE" ]]; then
    echo "Usage: $0 <pdca-file.md>"
    echo "Example: $0 path/to/pdca.md"
    exit 1
fi

if [[ ! -f "$PDCA_FILE" ]]; then
    echo "❌ PDCA file not found: $PDCA_FILE"
    exit 1
fi

echo "📄 Validating: $PDCA_FILE"
echo ""

# Required metadata fields
REQUIRED_FIELDS=(
    "🗓️ Date:"
    "🎯 Objective:"
    "👤 Agent Role:"
    "👤 Branch:"
    "🎯 Project Journal Session:"
    "🎯 Sprint:"
    "✅ Task:"
    "🚨 Issues:"
    "📎 Previous Commit:"
    "🔗 Previous PDCA:"
)

# Check each required field
MISSING_FIELDS=()
for field in "${REQUIRED_FIELDS[@]}"; do
    if ! grep -q "^**$field" "$PDCA_FILE"; then
        MISSING_FIELDS+=("$field")
    fi
done

# Check for required sections
REQUIRED_SECTIONS=(
    "## **📊 SUMMARY**"
    "## **📋 PLAN**"
    "## **🔧 DO**"
    "## **✅ CHECK**"
    "## **🎯 ACT**"
    "## **💫 EMOTIONAL REFLECTION"
    "## **🎯 PDCA PROCESS UPDATE**"
)

MISSING_SECTIONS=()
for section in "${REQUIRED_SECTIONS[@]}"; do
    if ! grep -q "^$section" "$PDCA_FILE"; then
        MISSING_SECTIONS+=("$section")
    fi
done

# Report results
if [[ ${#MISSING_FIELDS[@]} -eq 0 && ${#MISSING_SECTIONS[@]} -eq 0 ]]; then
    echo "✅ PDCA Validation PASSED"
    echo "All required metadata fields and sections present"
    exit 0
else
    echo "❌ PDCA Validation FAILED"
    
    if [[ ${#MISSING_FIELDS[@]} -gt 0 ]]; then
        echo ""
        echo "Missing Metadata Fields:"
        for field in "${MISSING_FIELDS[@]}"; do
            echo "  - $field"
        done
    fi
    
    if [[ ${#MISSING_SECTIONS[@]} -gt 0 ]]; then
        echo ""
        echo "Missing Sections:"
        for section in "${MISSING_SECTIONS[@]}"; do
            echo "  - $section"
        done
    fi
    
    echo ""
    echo "💡 Fix these issues before committing your PDCA"
    exit 1
fi

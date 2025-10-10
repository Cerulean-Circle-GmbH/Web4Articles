#!/bin/bash
# CMM3 PDCA Compliance Audit Script
# Checks all PDCAs in current session for template compliance

echo "🔍 Auditing PDCAs for CMM3 Compliance..."
echo ""

session_dir="/Users/Shared/Workspaces/temp/Web4Articles/components/Web4TSComponent/0.3.10.1/session"
pdcas=$(find "$session_dir" -name "*.pdca.md" -type f | sort)

total=0
compliant=0
violations=0

for pdca in $pdcas; do
    total=$((total + 1))
    basename=$(basename "$pdca")
    echo "📄 $basename"
    
    issues=()
    
    # Check 1: Template Version line exists
    if ! grep -q "Template Version:" "$pdca"; then
        if ! grep -q "Template:" "$pdca"; then
            issues+=("  ❌ Missing Template/Template Version reference")
        fi
    fi
    
    # Check 2: Has horizontal separators (---)
    separator_count=$(grep -c "^---$" "$pdca" || echo "0")
    if [ "$separator_count" -lt 3 ]; then
        issues+=("  ⚠️  Only $separator_count separators (expected ≥3)")
    fi
    
    # Check 3: Has required sections
    if ! grep -qi "## .*Problem\|## .*PLAN\|## .*Plan" "$pdca"; then
        issues+=("  ❌ Missing PLAN section")
    fi
    if ! grep -qi "## .*DO\|## .*Do" "$pdca"; then
        issues+=("  ❌ Missing DO section")
    fi
    if ! grep -qi "## .*CHECK\|## .*Check" "$pdca"; then
        issues+=("  ❌ Missing CHECK section")
    fi
    if ! grep -qi "## .*ACT\|## .*Act" "$pdca"; then
        issues+=("  ❌ Missing ACT section")
    fi
    
    # Check 4: Has dual links format (GitHub | §)
    if ! grep -q "\[GitHub\].*|.*\[§" "$pdca"; then
        issues+=("  ⚠️  No dual links found")
    fi
    
    # Report issues
    if [ ${#issues[@]} -eq 0 ]; then
        echo "  ✅ COMPLIANT"
        compliant=$((compliant + 1))
    else
        echo "  ❌ VIOLATIONS:"
        printf '%s\n' "${issues[@]}"
        violations=$((violations + 1))
    fi
    echo ""
done

echo "═══════════════════════════════════"
echo "📊 AUDIT SUMMARY"
echo "═══════════════════════════════════"
echo "Total PDCAs:    $total"
echo "✅ Compliant:    $compliant"
echo "❌ Violations:   $violations"
echo ""

if [ "$violations" -gt 0 ]; then
    echo "🚨 Action required: Fix $violations PDCA(s) for CMM3 compliance"
    exit 1
else
    echo "🎉 All PDCAs are CMM3 compliant!"
    exit 0
fi


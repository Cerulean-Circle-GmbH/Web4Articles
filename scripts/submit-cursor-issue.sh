# SPDX-License-Identifier: AGPL-3.0-only WITH AI-GPL-Addendum
# SPDX-FileComment: See ../AI-GPL.md for AI-specific terms.
# Copyright (c) 2025 Cerulean Circle GmbH
# Copyleft: See AGPLv3 (../LICENSE) and AI-GPL Addendum (../AI-GPL.md)
# Backlinks: /LICENSE, /AI-GPL.md

set -euo pipefail

echo "🚨 Cursor Zombie Process Issue Submission Helper"
echo "=================================================="

# Get current zombie count for real-time data
ZOMBIE_COUNT=$(ps aux | grep -E "\[.*\] <defunct>" | grep -v grep | wc -l)
echo "📊 Current zombie process count: $ZOMBIE_COUNT"

echo ""
echo "📋 Available Submission Methods:"
echo ""

echo "1. 🥇 PRIMARY: Cursor IDE Built-in Reporting"
echo "   Action: Open Cursor IDE → Help → Report Issue"
echo "   Status: Manual action required (highest priority)"
echo ""

echo "2. 🌐 SECONDARY: Community Forum"
echo "   URL: https://forum.cursor.com/c/bug-reports/8"
echo "   Action: Manual post creation recommended"
echo ""

echo "3. 📊 Evidence Package"
echo "   GitHub: https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/015320dd/scrum.pmo/project.journal/2025-09-20-UTC-1348-session/2025-09-20-UTC-1755-zombie-process-escalation.md"
echo ""

echo "4. 📋 Issue Report Template"
echo "   File: ./CURSOR_ISSUE_REPORT.md"
echo "   Contains: Complete issue description and evidence links"
echo ""

# Attempt to open links if possible
echo "🔧 Attempting to open relevant links..."

# Try to open the forum in browser (if available)
if command -v xdg-open >/dev/null 2>&1; then
    echo "Opening Cursor forum in browser..."
    xdg-open "https://forum.cursor.com/c/bug-reports/8" 2>/dev/null || echo "Browser opening failed"
elif command -v open >/dev/null 2>&1; then
    echo "Opening Cursor forum in browser..."
    open "https://forum.cursor.com/c/bug-reports/8" 2>/dev/null || echo "Browser opening failed"
else
    echo "No browser opener available - please manually visit:"
    echo "https://forum.cursor.com/c/bug-reports/8"
fi

echo ""
echo "📋 Issue Summary for Copy-Paste:"
echo "=================================="
cat << 'EOF'
TITLE: CRITICAL: Exponential Zombie Process Accumulation in Git Operations

DESCRIPTION:
CRITICAL SYSTEM STABILITY ISSUE - Cursor IDE environment accumulating zombie processes exponentially during git operations.

Current Impact: 478+ defunct processes, system performance degradation
Growth Rate: ~82 zombie processes per hour during active development
System: Linux 6.12.8+ container environment

REPRODUCTION STEPS:
1. Open any project in Cursor with git repository
2. Perform git operations (status, add, commit, push, pull)
3. Monitor: ps aux | grep -E "\[.*\] <defunct>" | wc -l
4. Observe 2-4 new zombie processes created per git operation
5. Processes accumulate without cleanup, never terminate

FAILED MITIGATION ATTEMPTS:
- Shell isolation: No impact on git subprocesses
- Git hooks disabled: No effect
- Process cleanup: Zombies persist due to parent process issues

EVIDENCE: https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/015320dd/scrum.pmo/project.journal/2025-09-20-UTC-1348-session/2025-09-20-UTC-1755-zombie-process-escalation.md

URGENCY: CRITICAL - System stability threat requiring immediate attention
EOF

echo ""
echo "🚨 NEXT ACTIONS:"
echo "1. Copy the above issue description"
echo "2. Open Cursor IDE → Help → Report Issue"
echo "3. Paste description and submit"
echo "4. Optionally post to forum: https://forum.cursor.com/c/bug-reports/8"
echo ""
echo "⚡ Current zombie count: $ZOMBIE_COUNT (monitor with: watch -n 1 'ps aux | grep -E \"\\[.*\\] <defunct>\" | wc -l')"
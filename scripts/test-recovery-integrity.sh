#!/bin/bash
# Recovery Integrity Test Suite
# Test recovery across all agent roles and branches

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}🛡️  Recovery Integrity Test Suite${NC}"
echo -e "${BLUE}=================================${NC}"

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Helper function for test results
log_test() {
    local status=$1
    local message=$2
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS:${NC} $message"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL:${NC} $message"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN:${NC} $message"
    else
        echo -e "${BLUE}ℹ️  INFO:${NC} $message"
    fi
}

# Test 1: Recovery Process Documentation Exists
test_recovery_documentation() {
    log_test "INFO" "Testing recovery process documentation..."
    
    local recovery_process="$PROJECT_ROOT/scrum.pmo/roles/ScrumMaster/recovery-process.md"
    if [ -f "$recovery_process" ]; then
        log_test "PASS" "Recovery process documentation exists"
        
        # Check for critical sections
        if grep -q "Phase 0: Role Selection" "$recovery_process"; then
            log_test "PASS" "Role-flexible recovery documented"
        else
            log_test "FAIL" "Role-flexible recovery missing from documentation"
        fi
        
        if grep -q "Multi-Agent Coordination" "$recovery_process"; then
            log_test "PASS" "Multi-agent coordination documented"
        else
            log_test "FAIL" "Multi-agent coordination missing from documentation"
        fi
    else
        log_test "FAIL" "Recovery process documentation missing"
    fi
}

# Test 2: Agent-Specific Journal Overview Script
test_agent_journal_script() {
    log_test "INFO" "Testing agent-specific journal overview script..."
    
    local script_path="$PROJECT_ROOT/scripts/generate-agent-journal-overview.sh"
    if [ -f "$script_path" ] && [ -x "$script_path" ]; then
        log_test "PASS" "Agent journal overview script exists and is executable"
        
        # Check for Recovery Agent recognition
        if grep -q "feature/recovery-agent" "$script_path"; then
            log_test "PASS" "Recovery Agent recognized in journal script"
        else
            log_test "FAIL" "Recovery Agent not recognized in journal script"
        fi
        
        # Check for proper agent isolation
        if grep -q "AGENT_NAME" "$script_path" && grep -q "AGENT_ROLE" "$script_path"; then
            log_test "PASS" "Agent isolation variables present"
        else
            log_test "FAIL" "Agent isolation variables missing"
        fi
    else
        log_test "FAIL" "Agent journal overview script missing or not executable"
    fi
}

# Test 3: Recovery Templates Exist
test_recovery_templates() {
    log_test "INFO" "Testing recovery templates..."
    
    local templates_dir="$PROJECT_ROOT/scrum.pmo/roles/RecoveryDefinitionAgent/templates"
    if [ -d "$templates_dir" ]; then
        log_test "PASS" "Recovery templates directory exists"
        
        # Check for key templates
        local key_templates=(
            "role-specific-recovery.template.md"
            "scenario-based-recovery.template.md"
            "multi-agent-coordination.template.md"
            "automation-recovery.template.md"
        )
        
        for template in "${key_templates[@]}"; do
            if [ -f "$templates_dir/$template" ]; then
                log_test "PASS" "Template exists: $template"
            else
                log_test "FAIL" "Template missing: $template"
            fi
        done
    else
        log_test "FAIL" "Recovery templates directory missing"
    fi
}

# Test 4: Branch Assignment Registry
test_branch_assignments() {
    log_test "INFO" "Testing branch assignment registry..."
    
    local assignments="$PROJECT_ROOT/scrum.pmo/sprints/sprint-0/agent-branch-assignments.md"
    if [ -f "$assignments" ]; then
        log_test "PASS" "Branch assignment registry exists"
        
        # Check for Recovery Agent assignment
        if grep -q "Recovery Agent.*feature/recovery-agent" "$assignments"; then
            log_test "PASS" "Recovery Agent branch assignment documented"
        else
            log_test "FAIL" "Recovery Agent branch assignment missing"
        fi
        
        # Check for ScrumMaster ownership
        if grep -q "ScrumMaster.*release/dev.*LOCKED" "$assignments"; then
            log_test "PASS" "ScrumMaster branch ownership documented"
        else
            log_test "FAIL" "ScrumMaster branch ownership missing"
        fi
    else
        log_test "FAIL" "Branch assignment registry missing"
    fi
}

# Test 5: Recovery Role Process Documentation
test_recovery_role_process() {
    log_test "INFO" "Testing Recovery Definition Agent process..."
    
    local process_doc="$PROJECT_ROOT/scrum.pmo/roles/RecoveryDefinitionAgent/process.md"
    if [ -f "$process_doc" ]; then
        log_test "PASS" "Recovery Definition Agent process documentation exists"
        
        # Check for PDCA requirements
        if grep -q "PDCA Requirement" "$process_doc"; then
            log_test "PASS" "PDCA requirements documented"
        else
            log_test "FAIL" "PDCA requirements missing"
        fi
        
        # Check for session-based structure
        if grep -q "session-based" "$process_doc"; then
            log_test "PASS" "Session-based structure documented"
        else
            log_test "FAIL" "Session-based structure missing"
        fi
    else
        log_test "FAIL" "Recovery Definition Agent process documentation missing"
    fi
}

# Test 6: Project Index Update Script
test_project_index_script() {
    log_test "INFO" "Testing project index update script..."
    
    local script_path="$PROJECT_ROOT/scripts/update-project-index.sh"
    if [ -f "$script_path" ] && [ -x "$script_path" ]; then
        log_test "PASS" "Project index update script exists and is executable"
        
        # Check for GitHub links integration
        if grep -q "GITHUB_BASE_URL" "$script_path"; then
            log_test "PASS" "GitHub links integration present"
        else
            log_test "FAIL" "GitHub links integration missing"
        fi
    else
        log_test "FAIL" "Project index update script missing or not executable"
    fi
}

# Test 7: Enhanced PDCA Templates
test_enhanced_pdca_templates() {
    log_test "INFO" "Testing enhanced PDCA templates..."
    
    local templates_dir="$PROJECT_ROOT/scrum.pmo/templates"
    if [ -d "$templates_dir" ]; then
        log_test "PASS" "PDCA templates directory exists"
        
        # Check for enhanced templates
        local pdca_templates=(
            "pdca.enhanced.template.md"
            "pdca.role-transition.template.md"
            "pdca.standard.template.md"
        )
        
        for template in "${pdca_templates[@]}"; do
            if [ -f "$templates_dir/$template" ]; then
                log_test "PASS" "PDCA template exists: $template"
            else
                log_test "FAIL" "PDCA template missing: $template"
            fi
        done
    else
        log_test "FAIL" "PDCA templates directory missing"
    fi
}

# Test 8: Recovery Scripts Functionality
test_recovery_scripts() {
    log_test "INFO" "Testing recovery-related scripts..."
    
    # Test release script
    local release_script="$PROJECT_ROOT/scripts/release-to-testing.sh"
    if [ -f "$release_script" ] && [ -x "$release_script" ]; then
        log_test "PASS" "Release to testing script exists and is executable"
    else
        log_test "FAIL" "Release to testing script missing or not executable"
    fi
    
    # Test verification script
    local verify_script="$PROJECT_ROOT/scripts/verify-release.sh"
    if [ -f "$verify_script" ] && [ -x "$verify_script" ]; then
        log_test "PASS" "Release verification script exists and is executable"
    else
        log_test "FAIL" "Release verification script missing or not executable"
    fi
}

# Test 9: Agent Isolation Integrity
test_agent_isolation() {
    log_test "INFO" "Testing agent isolation integrity..."
    
    # Check for agent-specific journal overviews
    local journal_dir="$PROJECT_ROOT/scrum.pmo/project.journal"
    if [ -f "$journal_dir/project.journal.overview.release-dev.md" ]; then
        log_test "PASS" "ScrumMaster-specific journal overview exists"
    else
        log_test "FAIL" "ScrumMaster-specific journal overview missing"
    fi
    
    # Check for proper agent separation in sessions
    local session_dirs
    if ls "$journal_dir"/2025-*/pdca/role/ > /dev/null 2>&1; then
        log_test "PASS" "Role-based PDCA structure exists"
    else
        log_test "FAIL" "Role-based PDCA structure missing"
    fi
}

# Test 10: Cross-Branch Compatibility
test_cross_branch_compatibility() {
    log_test "INFO" "Testing cross-branch compatibility..."
    
    # Save current branch
    local current_branch
    current_branch=$(git branch --show-current)
    
    # Check if recovery procedures are consistent across branches
    local main_recovery="main"
    local dev_recovery="release/dev"
    
    # This is a placeholder - in a real implementation, we would:
    # 1. Check out different branches
    # 2. Verify recovery procedures are consistent
    # 3. Test recovery process on each branch
    # 4. Return to original branch
    
    log_test "WARN" "Cross-branch compatibility testing requires implementation"
    log_test "INFO" "Current branch: $current_branch"
}

# Run all tests
echo -e "${BLUE}Running Recovery Integrity Tests...${NC}"
echo

test_recovery_documentation
echo
test_agent_journal_script
echo
test_recovery_templates
echo
test_branch_assignments
echo
test_recovery_role_process
echo
test_project_index_script
echo
test_enhanced_pdca_templates
echo
test_recovery_scripts
echo
test_agent_isolation
echo
test_cross_branch_compatibility

# Final results
echo
echo -e "${BLUE}🛡️  Recovery Integrity Test Results${NC}"
echo -e "${BLUE}====================================${NC}"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo -e "${BLUE}Total Tests:  $TESTS_TOTAL${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All recovery integrity tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Recovery integrity issues detected!${NC}"
    exit 1
fi

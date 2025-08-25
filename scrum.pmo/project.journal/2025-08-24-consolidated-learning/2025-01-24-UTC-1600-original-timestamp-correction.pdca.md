# 🔄 **PDCA Entry: Original Timestamp Correction - Trace File History to First Commit**

**🗓️ Date:** 2025-01-24-UTC-1600  
**🎯 Objective:** Fix timestamps using original file creation dates, not git mv dates  
**👤 Role:** Save/Restart Agent → Historical Accuracy  
**🚨 Issues:** All files show same timestamp from git mv, not original creation  
**📎 Previous Commit:** 465db17a - Wrong timestamps from git mv  
**🔗 Previous PDCA:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/scrum.pmo/project.journal/2025-08-24-consolidated-learning/2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md) | [2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md](2025-01-24-UTC-1555-timestamp-filename-correction.pdca.md)

---

## **📊 SUMMARY**

### **Artifact Links**
- **PDCA Document:** [GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/save/start/scrum.pmo/project.journal/2025-08-24-consolidated-learning/2025-01-24-UTC-1600-original-timestamp-correction.pdca.md) | [2025-01-24-UTC-1600-original-timestamp-correction.pdca.md](2025-01-24-UTC-1600-original-timestamp-correction.pdca.md)

### **QA Decisions**
**All clear, no decisions to make** - Trace original creation timestamps through git history

### **User Feedback**
```quote
mmmmh now they have all the same timestamp. recreate the timestamp from the the first commit that created the file, not form the git mv creation.
```

### **My Answer**
Correct - used git mv timestamp instead of original creation. Will trace each file's complete history using `git log --follow --reverse --diff-filter=A` to find the actual first commit when each file was created, ignoring all subsequent moves and renames.

**Learning Applied:** File history tracing requires following through all renames and moves to find true origin.

---

## **📋 PLAN**

### **Historical Trace Strategy**
1. Use `git log --follow --reverse --diff-filter=A` to find first commit that added each file
2. Extract original timestamp from that first commit  
3. Generate correct filename format using true creation date
4. Rename files preserving git history

### **Command Structure**
```bash
# Find original creation commit (not move commits)
git log --follow --reverse --diff-filter=A --format="%ai" -- filename | head -1
```

---

## **🔧 DO**

### **1. Test Original Timestamp Extraction**
```bash
# Example: Find when pdca-wild-west-workflow was FIRST created
git log --follow --reverse --diff-filter=A --format="%ai" -- \
  scrum.pmo/project.journal/2025-08-24-consolidated-learning/2025-08-25-UTC-0948-wild-west-workflow.pdca.md
```

### **2. Correct Timestamp Script**
```bash
cd scrum.pmo/project.journal/2025-08-24-consolidated-learning/
for file in 2025-08-25-UTC-0948-*.md; do
  # Get ORIGINAL creation timestamp (not move timestamp)
  original_timestamp=$(git log --follow --reverse --diff-filter=A --format="%ai" -- "$file" | head -1)
  
  if [ -n "$original_timestamp" ]; then
    # Convert to correct format
    correct_date=$(date -d "$original_timestamp" +"%Y-%m-%d-UTC-%H%M")
    
    # Extract description from current name
    current_name=$(basename "$file")
    description=${current_name#2025-08-25-UTC-0948-}
    
    # Generate correct filename
    correct_name="$correct_date-$description"
    
    if [ "$current_name" != "$correct_name" ]; then
      echo "Correcting: $current_name -> $correct_name"
      git mv "$file" "$correct_name"
    fi
  fi
done
```

---

## **✅ CHECK**

### **Problem Confirmed**
All files currently have `2025-08-25-UTC-0948` timestamp from git mv operation, not original creation dates.

### **Solution Approach**
- **--follow**: Traces file through renames
- **--reverse**: Shows oldest commits first  
- **--diff-filter=A**: Only shows commits that Added files (not moved)
- This finds the TRUE first commit that created each file

---

## **🎯 ACT**

### **Next Steps**
1. Implement corrected timestamp extraction
2. Rename files using true original creation dates
3. Verify chronological accuracy
4. Commit corrected structure

### **Expected Result**
Files will show their actual creation timestamps, not the consolidation timestamp.

---

**🔄 Ready to trace original file creation timestamps through git history.** ✅

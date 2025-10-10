# Session Log Update Checklist

Use this checklist **AFTER EVERY SUBTASK** to ensure the session log is 100% accurate and complete.

## ✅ All 13 Sections to Verify:

### 1. 📋 Current Status
- [ ] Current task number and name updated
- [ ] Progress percentage correct (X/Total subtasks)
- [ ] "Last Completed" shows the subtask just finished
- [ ] "Next Subtask" shows what's coming next
- [ ] Overall progress percentage updated

### 2. 🎯 PRD Context & Overall Goal
- [ ] Verify project objective is still accurate
- [ ] Tech stack list is current
- [ ] Success criteria unchanged

### 3. ✅ Completed Tasks Summary
- [ ] New subtask added with description
- [ ] If parent task complete, summary section added
- [ ] Commit hash included for completed parent tasks
- [ ] Key files listed for each completed task

### 4. 🔧 Key Technical Decisions
- [ ] Any new architecture choices documented
- [ ] New libraries/packages added with rationale
- [ ] Design patterns explained
- [ ] Reasons for deviations from plan

### 5. 🚨 Manual Actions Required
- [ ] Completed manual actions moved to "Completed" section
- [ ] New manual actions added if any
- [ ] Marked as BLOCKING or NON-BLOCKING
- [ ] Clear instructions provided

### 6. 📦 Key Files Created
- [ ] All new files from this subtask added
- [ ] Organized by category (Auth, Database, Admin, etc.)
- [ ] Brief description for each file
- [ ] Line counts for major files

### 7. 🔥 Technical Debt & Future Cleanup
- [ ] Any new workarounds documented
- [ ] "TODO later" items added
- [ ] Dependencies on future tasks noted
- [ ] Temporary solutions flagged

### 8. 🎯 What's Working Right Now
- [ ] New functionality added to appropriate section
- [ ] Public site features updated
- [ ] Admin features updated
- [ ] API endpoints updated
- [ ] Outdated entries removed

### 9. 🚀 Quick Start for New Context
- [ ] Current directory correct
- [ ] Test commands updated if changed
- [ ] Process rules section accurate
- [ ] Current work context updated

### 10. 📊 Commit History
- [ ] New commit added when parent task completes
- [ ] Commit message includes task number
- [ ] Pending commits marked as [Pending]

### 11. 🔄 Remaining Tasks
- [ ] Current task progress updated
- [ ] Subtask count corrected (X remaining)
- [ ] Next subtasks listed clearly
- [ ] Duplicate sections removed

### 12. 💡 Known Issues
- [ ] Resolved issues removed
- [ ] New issues added
- [ ] Each issue has fix plan or task reference

### 13. 🎯 Context for Next Session
- [ ] Current task and subtask number correct
- [ ] "What's Done" summarizes recent completions
- [ ] "What's Next" is specific and actionable
- [ ] Key files listed
- [ ] Process reminder included

---

## 🎯 Quick Validation Questions:

1. If context window reset RIGHT NOW, could someone continue seamlessly? **YES / NO**
2. Are all sections dated to TODAY's work? **YES / NO**
3. Is anything outdated or stale? **YES / NO**
4. Does "Context for Next Session" match current reality? **YES / NO**

**If any answer is NO, update that section!**

---

## Example Update Flow:

After completing Task 9.11 (robots.txt):

1. ✅ Update "Current Status" → 11/18 complete (61%), next is 9.12
2. ✅ Skip "PRD Context" → no changes
3. ✅ Update "Completed Tasks" → Add 9.11 to Task 9.0 section
4. ✅ Skip "Technical Decisions" → no new architecture
5. ✅ Skip "Manual Actions" → none needed
6. ✅ Update "Key Files" → Add `app/robots.ts` to SEO & Metadata section
7. ✅ Skip "Technical Debt" → no new workarounds
8. ✅ Update "What's Working" → Add robots.txt to SEO section
9. ✅ Skip "Quick Start" → no environment changes
10. ✅ Skip "Commit History" → parent task not complete yet
11. ✅ Update "Remaining Tasks" → 7 remaining (not 8), update subtask list
12. ✅ Skip "Known Issues" → none resolved, none added
13. ✅ Update "Context for Next" → Task 9.12 is next

**Result:** Session log is 100% accurate for this subtask ✅


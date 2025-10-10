# Task List Management

Guidelines for managing task lists in markdown files to track progress on completing a PRD

---

## 🚨 RULE #0: UPDATE SESSION-LOG.md BEFORE EVERY COMMIT

**THIS IS THE MOST VIOLATED RULE - IT IS MANDATORY!**

Before running `git commit` on ANY sub-task:
1. Open `tasks/SESSION-LOG.md`
2. Verify and update ALL 13 sections (see "Section-by-Section Verification" below)
3. This is NOT optional - it must happen BEFORE every commit
4. If you skip this step, you are breaking the entire workflow

**Remember: SESSION-LOG update happens at Step 4 of the completion protocol, BEFORE marking [x], BEFORE committing!**

---

## Task Implementation

- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y"
- **Git Branching Strategy (NEW):**
  - **Each parent task gets its own feature branch**
  - Branch naming: `task-X.0-short-description` (e.g., `task-10.0-testing-suite`)
  - When starting a new parent task:
    1. Create and checkout a new branch from `main`
    2. Work on all subtasks in this branch
    3. Commit subtask completions as you go (optional, or one final commit)
  - When parent task is complete:
    1. Run tests, clean up, make final commit
    2. Push branch to origin
    3. Create Pull Request (PR) to `main`
    4. Wait for user to review and merge PR
    5. Then mark parent task as `[x]`
- **Completion protocol:**
  1. When you finish a **sub‑task**, follow this EXACT sequence:
     - **Step 1**: Run linter (`npm run lint` or equivalent) and fix any errors
     - **Step 2**: Run all tests (`npm test`) and ensure they all pass
     - **Step 3**: Verify TypeScript compiles (`npx tsc --noEmit` or equivalent)
     - **Step 4**: **UPDATE SESSION-LOG.md** - Verify ALL 13 sections (MANDATORY, see "Section-by-Section Verification" below)
     - **Step 5**: Mark it as completed by changing `[ ]` to `[x]` in task list
     - **Step 6**: Update TODO list using todo_write tool
     - **Step 7**: Stage changes (`git add`)
     - **Step 8**: Commit with descriptive conventional commit message
     - **Step 9**: STOP and ask user for permission to continue
     - **Step 10**: WAIT for user approval before proceeding
     - **⚠️ CRITICAL**: If you skip Step 4 (SESSION-LOG update), you are breaking the workflow!
  2. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:
  - **First**: Run the full test suite (`pytest`, `npm test`, `bin/rails test`, etc.)
  - **Only if all tests pass**: Stage changes (`git add .`)
  - **Clean up**: Remove any temporary files and temporary code before staging
  - **Commit**: Use a descriptive commit message that:
    - Uses conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
    - Summarizes what was accomplished in the parent task
    - Lists key changes and additions
    - References the task number and PRD context
    - **Formats the message as a single-line command using `-m` flags**
  - **Push**: Push the feature branch to origin (`git push -u origin task-X.0-description`)
  - **Create PR**: Provide PR title and description for user to create
  - **Wait**: Wait for user to review and merge the PR before marking parent task `[x]`
  3. Once PR is merged and parent task is marked `[x]`, checkout `main` and pull latest changes before starting next parent task.

- Stop after each sub‑task and wait for the user's go‑ahead.

## Task List Maintenance

1. **Update the task list as you work:**
   - Mark tasks and subtasks as completed (`[x]`) per the protocol above.
   - Add new tasks as they emerge.

2. **Maintain the "Relevant Files" section:**
   - List every file created or modified.
   - Give each file a one‑line description of its purpose.

## Session Log Maintenance

**Always maintain a session log file** (typically `tasks/SESSION-LOG.md`) to provide continuity across context windows and track the project journey. The session log must include:

### Required Sections:

1. **Current Status:**
   - Current task being worked on
   - Last completed task
   - Overall progress/phase

2. **PRD Context & Overall Goal:**
   - Link to the PRD document
   - Brief summary of the project's main objective
   - Key success criteria or deliverables
   - Any critical constraints (budget, timeline, technical requirements)

3. **Completed Tasks Log:**
   - List of all completed tasks with brief descriptions
   - Key technical decisions made for each task
   - Any deviations from original plan
   - Important notes or gotchas discovered

4. **Technical Decisions & Modifications:**
   - Architecture choices made
   - Libraries/packages selected and why
   - Design pattern decisions
   - Changes to the original PRD or plan
   - Rationale for modifications

5. **Manual Actions Required:**
   - List of actions that require user intervention
   - Clear instructions for each action
   - Examples where helpful
   - Track completed manual actions

6. **Future Cleanup Items:**
   - Temporary solutions that need to be replaced
   - Technical debt incurred
   - Files/code that will need refactoring
   - Dependencies on future tasks (e.g., "placeholder types will be replaced in Task 3.2")
   - Performance optimizations deferred

7. **Files Created/Modified:**
   - Clear list of what's been added or changed
   - Next files to be created
   - Any files that should be deleted

8. **Quick Start for New Context:**
   - How to immediately resume work if context window resets
   - Key files to read first
   - Current environment state
   - Important credentials/URLs (non-sensitive)

### Update Frequency:
- Update session log after completing each sub-task
- Add cleanup items as they're identified
- Document technical decisions when made, not later
- Keep "Current Status" always accurate

### Section-by-Section Verification (After Each Subtask):
When updating the session log, systematically verify and update EACH section:

1. **Current Status** - Update task number, progress %, last completed, next subtask
2. **PRD Context** - Usually static, verify it's still accurate
3. **Completed Tasks Summary** - Add newly completed subtasks/tasks with descriptions
4. **Technical Decisions** - Add any new architecture/library choices made in this subtask
5. **Manual Actions Required** - Move completed actions to "Completed", add new ones
6. **Key Files Created** - Add new files from this subtask, organize by category
7. **Technical Debt** - Add any workarounds or "TODO later" items
8. **What's Working Right Now** - Update with new functionality
9. **Quick Start** - Update if environment or key files changed
10. **Commit History** - Add commit when parent task completes
11. **Remaining Tasks** - Update progress counts and subtask details
12. **Known Issues** - Remove resolved issues, add new ones
13. **Context for Next Session** - Always update with current task/subtask

**This ensures the session log is always 100% current and ready for a context window handoff.**

## AI Instructions

When working with task lists, the AI must:

1. Regularly update the task list file after finishing any significant work.
2. Follow the completion protocol:
   - Mark each finished **sub‑task** `[x]`.
   - Mark the **parent task** `[x]` once **all** its subtasks are `[x]`.
3. Add newly discovered tasks.
4. Keep "Relevant Files" accurate and up to date.
5. Before starting work, check which sub‑task is next.
6. After implementing a sub‑task, update the file and then pause for user approval.
7. **Maintain the session log:**
   - Update after each completed sub-task
   - Document technical decisions as they're made
   - Add cleanup items when identified
   - Keep PRD context visible
   - Ensure new context windows can quickly resume work
   - **CRITICAL:** After each subtask, verify and update ALL 13 sections systematically (see "Section-by-Section Verification" above)
   - Don't just update one section - check every section for accuracy and completeness
8. **Track manual actions required:**
   - Maintain "Manual Actions Required" section in session log
   - Move completed actions to "Completed Manual Actions"
9. **Notify user of manual actions required:**
   - Clearly call out when user needs to manually configure something
   - Provide exact steps and examples for manual changes
   - Common manual actions include:
     - Adding actual credentials/API keys to `.env.local`
     - Creating accounts in third-party services
     - Configuring external dashboards (Google Cloud, Supabase, etc.)
     - DNS configuration
     - Domain setup
   - Format notifications with clear headers like "🎯 What YOU Need to Do:" or "⚠️ Manual Action Required:"
10. **STOP and wait for manual action completion:**
   - **CRITICAL:** If a task requires manual action AND the next task depends on it, STOP and wait
   - Ask the user to confirm completion before proceeding: "Have you completed this? Reply 'done' or 'y' to continue"
   - Examples of blocking manual actions:
     - Running database migrations before creating queries/APIs
     - Adding API keys before using external services
     - Configuring OAuth before testing authentication
   - Do NOT proceed to dependent tasks until user confirms
   - Non-blocking actions (like adding admin email) can allow proceeding with a reminder

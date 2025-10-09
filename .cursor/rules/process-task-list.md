# Task List Management

Guidelines for managing task lists in markdown files to track progress on completing a PRD

## Task Implementation

- **One sub-task at a time:** Do **NOT** start the next sub‑task until you ask the user for permission and they say "yes" or "y"
- **Completion protocol:**
  1. When you finish a **sub‑task**, immediately mark it as completed by changing `[ ]` to `[x]`.
  2. If **all** subtasks underneath a parent task are now `[x]`, follow this sequence:
  - **First**: Run the full test suite (`pytest`, `npm test`, `bin/rails test`, etc.)
  - **Only if all tests pass**: Stage changes (`git add .`)
  - **Clean up**: Remove any temporary files and temporary code before committing
  - **Commit**: Use a descriptive commit message that:
    - Uses conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
    - Summarizes what was accomplished in the parent task
    - Lists key changes and additions
    - References the task number and PRD context
    - **Formats the message as a single-line command using `-m` flags**, e.g.:

      ```
      git commit -m "feat: add payment validation logic" -m "- Validates card type and expiry" -m "- Adds unit tests for edge cases" -m "Related to T123 in PRD"
      ```
  3. Once all the subtasks are marked completed and changes have been committed, mark the **parent task** as completed.

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

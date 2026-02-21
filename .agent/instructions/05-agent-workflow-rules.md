# Instructions Maintenance Workflow

This document dictates the process for updating this folder (`.agent/instructions/`).

## Agent Mandate
As an AI Agent operating on this codebase, **you are strictly mandated by the developer to document and record changes** to the architecture, data models, features, or design systems whenever new prompts or instructions alter them.

## Update Workflow
Every time you process a new prompt that implements a significant change, feature, or structural update to the AC & DC Technical Institute application:

1. **Identify the Scope**: Determine whether the change affects the `.agent/instructions/01-tech-stack-and-architecture.md`, `02-data-models.md`, `03-core-features-and-logic.md`, or `04-ui-ux-guidelines.md`.
2. **Execute File Edit**: If a change in the application warrants new instruction context, use your filesystem tools to edit the corresponding markdown file in this folder and outline what was built, changed, or removed.
3. **Commit the Rule**: You must perform this update organically. Do not wait for the developer to specifically ask you to update the agent instructions. If you change something significant (like migrating from Vite to Next.js or changing a database schema), update these files immediately alongside the core codebase fix.
4. **Document Creation**: If a prompt demands an entirely new subsystem or design concept not adequately covered here, create a new instruction file (e.g., `06-api-integrations.md`) to capture those specific agent rules.

By maintaining this folder, you ensure that future contexts and other assigned agents instantly understand the complexity, structure, and state of the platform without starting from scratch.

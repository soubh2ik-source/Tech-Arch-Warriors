<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (`.codegraph/` exists at the repo root), ALWAYS run CodeGraph via shell BEFORE using grep, find, or reading entire files:

- **Explore code & symbols**: Run `codegraph explore "<symbol or question>"` in the shell to inspect symbol definitions, implementations, and call paths in one shot.
- **Context for tasks**: Run `codegraph context "<task description>"` to gather relevant symbols and relationships.

If there is no `.codegraph/` directory, skip CodeGraph entirely.
<!-- CODEGRAPH_END -->

## Frontend UI/UX Standards & Skill Integration

When designing, building, refining, or auditing the dedicated frontend (`frontend/`):

1. **Mandatory UI/UX Skill Activation**:
   - Always activate and follow the `ui-ux-pro-max` skill (`.agents/skills/ui-ux-pro-max/SKILL.md`) for visual hierarchy, interaction patterns, accessibility, and tech stack guidance.
   - Utilize companion skills as needed: `design-system` (`.agents/skills/design-system/SKILL.md`) for 3-layer token architectures and `ui-styling` (`.agents/skills/ui-styling/SKILL.md`) for component styling.

2. **Design System & Clinical Aesthetic**:
   - **Visual Identity**: Clean, trustworthy medical-grade interface suited for oncology diagnostics (high-clarity data presentation, subtle borders, intentional whitespace, zero clutter).
   - **Color & Contrast**: Enforce semantic color tokens (diagnostic classes, malignancy confidence, risk tiers). Maintain strict WCAG 2.1 AA compliance (contrast ratio >= 4.5:1 for text).
   - **Typography**: Clear hierarchy with readable system/clinical fonts, base size >= 16px, line-height 1.5, and balanced headings.
   - **Icons & Assets**: Use curated SVG icons (Phosphor / Lucide); avoid emoji as interface icons.

3. **Interaction, Layout & Responsiveness**:
   - **Touch & Click Targets**: Ensure interactive elements meet minimum 44x44px touch boundaries with >= 8px spacing.
   - **Diagnostic Feedback**: Provide immediate feedback for CT scan upload, model inference latency, and probabilistic prediction meters (no unhandled 0ms state changes or layout shifts).
   - **Responsive Structure**: Mobile-first fluid layout with no horizontal page scroll (`overflow-x` protection) and graceful scaling for desktop workstations.

4. **Quality & Pre-Delivery Verification**:
   - Verify layout rendering, keyboard navigability (visible focus rings, aria-labels for icon buttons), and check browser console logs for zero runtime errors before completing any UI task.

## Version Control & Git Policy

- **No Automated Commits**: Do NOT commit any change or push to GitHub until and unless the user explicitly commands it (e.g., "commit this", "push into the repo", "push to github").
- Never run `git commit` or `git push` automatically as part of a task completion flow.



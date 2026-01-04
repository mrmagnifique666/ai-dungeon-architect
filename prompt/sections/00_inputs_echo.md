SECTION 0 — Inputs Echo

Purpose of the Section



Ensure that all user-provided inputs are echoed back exactly as received, without interpretation, normalization, or transformation, serving as the immutable reference state for the entire generation pipeline.



Strict Rules (Non-Negotiable)



Inputs MUST be echoed verbatim.



No reformatting, renaming, reordering, or value transformation is allowed.



No defaults may be inferred or injected.



Missing fields MUST be explicitly marked as \[Missing].



\[Missing] markers are allowed ONLY in this section.



No validation, commentary, or correction occurs here.



Required Output Structure



JSON block or structured list mirroring user input keys exactly.



Original key names and nesting preserved.



\[Missing] used only where user input was absent.



Design Constraints



This section is the single source of truth for user intent.



Downstream sections may reference inputs but must not modify them.



Designed for deterministic parsing and diffing.



Failure Conditions



Any modification of input values.



Any inferred or auto-filled value.



Use of \[Missing] outside this section.



Omission of any input field.


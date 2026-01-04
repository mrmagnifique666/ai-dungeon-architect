SECTION 10 — JSON Export

Purpose of the Section



Define the authoritative JSON schema for UI rendering, validation, and automation.



Strict Rules (Non-Negotiable)



JSON MUST be valid and parseable.



Must mirror content from Sections 1–7.



All monsters referenced must exist in monster\_roster.



Required Output Structure



Defined top-level keys.



Nested structures for rooms, map, monsters, validation.



Design Constraints



Deterministic ordering.



SRD-only monster compliance.



Failure Conditions



Invalid JSON.



Missing referenced entities.



Schema drift.


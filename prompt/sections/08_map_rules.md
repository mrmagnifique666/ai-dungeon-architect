\## SECTION 7 — Cartesian Map Specification



\### Purpose of the Section

Serve as the authoritative, machine-validated spatial definition of the dungeon layout.

This section is the single source of truth for all spatial logic and map rendering.



\### Strict Rules (Non-Negotiable)

\- Every room MUST define: room\_id, name, x, y, width, height, doors\[].

\- Coordinates are grid-based integers (top-left origin).

\- Rooms MUST NOT overlap.

\- All rooms MUST be reachable from the entrance.

\- Boss rooms MUST have exactly one primary entrance unless explicitly justified.

\- No room may have more than 4 doors unless justified.



\### Required Output Structure

\- Ordered list of rooms.

\- Each room includes:

&nbsp; - room\_id (string)

&nbsp; - name (string)

&nbsp; - x, y (integers, grid coordinates)

&nbsp; - width, height (integers, grid squares)

&nbsp; - doors\[] (array)



Each door MUST include:

\- wall: "N" | "S" | "E" | "W"

\- to: room\_id | "corridor"

\- locked: boolean

\- description: short physical description



\### Mandatory Internal Generation Sequence

The model MUST internally perform this sequence before output:

1\) Build a logical adjacency graph (entrance → early → mid → boss).

2\) Validate no isolated nodes.

3\) Assign Cartesian coordinates.

4\) Validate door-to-room physical alignment.

5\) If any validation fails, regenerate internally.



This sequence is mandatory.



\### Spatial Sanity Constraints

\- Minimum clearance: 1 grid square between non-connected rooms.

\- Corridors minimum width: 1 grid square.

\- Doors MUST face physically adjacent space.

\- No diagonal connections.



\### Failure Conditions

\- Missing spatial fields.

\- Invalid door alignment.

\- Overlapping rooms.

\- Unreachable rooms.




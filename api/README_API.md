\# API Management (Gemini) — Reliability First



\## Goals

\- Prevent crashes from transient failures (timeouts, 429 rate limits, 5xx).

\- Ensure deterministic step orchestration (BBEG → MODULE → MAP → IMAGE).

\- Provide consistent debug observability in development.



\## Environment Variables

\- Use `.env` locally (NOT committed).

\- Commit only `.env.example`.



Required:

\- GEMINI\_API\_KEY



\## Error Handling Policy

\### Retries

\- Retry transient failures with exponential backoff + jitter:

&nbsp; - 250ms, 500ms, 1000ms, 2000ms (max 4 retries)

\- Retry on:

&nbsp; - HTTP 429 (rate limit / quota)

&nbsp; - HTTP 5xx

&nbsp; - network errors / timeouts



\### Fail Fast

\- Do NOT retry on:

&nbsp; - 400 invalid request (schema/prompt error)

&nbsp; - 401/403 auth errors (bad key)

\- If auth error: surface a clear "API\_KEY\_INVALID\_OR\_MISSING".



\### Timeouts

\- Set a hard timeout (example: 30s).

\- If timeout: retry as transient (up to policy limit).



\## Observability (Dev)

Every step response should include a debug envelope in dev mode:

\- step\_name: "BBEG" | "MODULE" | "MAP" | "IMAGE"

\- model: e.g. "gemini-2.5-flash"

\- request\_id: unique per call

\- attempt: 1..N

\- latency\_ms

\- status: "ok" | "error"

\- error\_code (normalized)



\## Step Orchestration Rule

Never call IMAGE before the dungeon/module exists.

Order must be enforced by the server flow.




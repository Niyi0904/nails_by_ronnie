## /ritual build

Walks the engineer from a free-form problem statement to vetted, accepted Ritual recommendations using the Ritual MCP tool surface.

Output: a fully-closed loop — **exploration in COMPLETE state, recommendations accepted (or explicitly handed off to an admin), build brief generated, code implemented, and `sync_implementation` called to register the result in the knowledge graph**. The engineer stays in the driver's seat through concise status updates and explicit pauses only at real decision gates.

### ON ENTRY — do this FIRST, then stay on the pipeline (load-bearing)
<!-- skill-options:no-gate-change: entry-point + planning-phase trigger — names the existing Step 0.7 first action and the existing pre-brief pipeline; adds no pause gate or options -->

The instant `/ritual build` is selected (including the no-subcommand default that treats the whole ask as the scope), your **next tool call** is the Step 0.7 **Job gate**: call `classify_work_item` with the user's ask, then render that gate. Everything between here and Step 0.7 — the vocabulary map, the build rail, the runtime contracts — is reference you apply *while* running the flow; it is **not** a reason to delay that first tool call.

**The pipeline — you are in the PLANNING phase until the build brief is accepted.** It runs as the six build-rail stages below, **in order**. **Advance through the numbered Steps exactly as written — do not skip ahead or reorder them.** The exact tool sequence lives in the Steps; follow them, don't reconstruct it from memory.

```
Job (classify) -> Scope -> Discovery -> Recommendations -> Build brief (Step 10) | Implementation (Step 11+)
[------------------------------- planning phase -------------------------------] [---- implementation ----]
```

**`create_exploration` is the END of Scope, not the start.** Scope = sub-problems (Step 4) → problem frame (Step 5) → `create_exploration` (Step 6). Creating the exploration before the sub-problems and frame exist forces a confusing backtrack — don't. After `classify_work_item` returns, render the Job gate, pick/create the workspace (Step 1), then do Steps 4 → 5 → 6 → 7 in order.

**The most common failures: (a) freelancing your own questions before classify, and (b) jumping ahead — creating the exploration or touching discovery before Scope is built. Do the next numbered Step; nothing else.**

**Forbidden for EVERY turn of the planning phase — not just the first (hard violations):**

- Inventing your own clarifying / scoping / "which option did you mean" questions, or using your agent's own question or prompt UI to gather scope. Scope is captured ONLY inside the flow, via `generate_problem_statement` (Step 4). The flow's own gates (Job gate, discovery, rec review) are the only pauses.
- Running ANY **implementation-phase** tooling before the build brief is generated and accepted (Step 10): file writes/edits, package installs, component/scaffold generators, design-asset generators, todo/task lists. (Examples by agent — v0: `GenerateDesignInspiration`, `TodoManager`, `shadcn add`; Cursor/Claude/etc. have equivalents.) Pulling implementation forward is a hard violation. These resume — and are expected — at **Step 11**.
- Reading repo files, `.ritual/config.json`, or calling `list_workspaces` before the Job gate is confirmed (Step 0.7). (Code-recon *reads* are fine later, at their step inside the planning phase; this only forbids them up front.)
- Emitting an empty, "let me think…", or narration-only turn with no tool call (e.g. "I'll start the build flow", "Let me gather context first"). Start the next step; don't announce it.

"Proceed with your best judgment" / "no clarification needed" does **not** mean skip the flow — it means run the flow with sane defaults and pause only at the real pause gates.

### Vocabulary mapping (engineer-tone)

The Ritual data model uses product-research terminology. This skill translates to engineer-natural terms when speaking to the user. The underlying API still uses original names — keep this table mental when you read tool inputs / outputs:

| User-facing term (the skill says) | Tool field name (the API uses) |
|---|---|
| **scope** | `problemStatement` |
| **sub-problem** | `consideration` |
| **Area** (NOT "matter") | `matter` |
| **discovery question** | `question` |
| **recommendation** | `recommendation` |

When the user says "tighten the scope," call `generate_problem_statement(...)` with their refinement. When you tell the user "I picked these sub-problems," you mean the items you put in `considerations[]`. The tools don't change; only the language to the user does.

**On "Area" vs "matter":** the API field is `matter` for historical reasons. The user-facing label is **Area** because it's plainer and reads less research-y in a developer flow. NEVER surface "matter" or "matter.name" in user-facing copy — use "Area" / "Area name" instead.


### Runtime contracts

Before running this flow, apply `references/cli-output-contract.md` and `references/async-polling.md`. Keep raw recon internal, pass the `codebase_context_packet` downstream, and show the user only the compact `recon_digest`.

<!-- skill-options:no-gate-change: render-copy only — adds a fence-echo rendering rule + drops a hardcoded exploration-link line; changes no pause gate, option token, or Step header -->
**Fenced render blocks are content to output, not code — never echo the fence (load-bearing).** User-facing gate renders throughout this flow are shown inside a ` ```text ` fence so the exact copy is unambiguous. When you render one, output the *content* of the block as plain text in your message — **never** include the ` ``` ` fence markers or the `text` language tag themselves. Wrapping a rendered gate in a code block is a render leak (it shows the user a grey code box instead of clean terminal text). This applies ONLY to ` ```text ` render blocks; ` ```bash `, ` ```json `, and ` ```markdown ` blocks are commands to run or content to WRITE to a file — handle those as written, never as a user-facing render.

<!-- skill-options:no-gate-change: deliverable-named rail — stage labels + conditional Implementation stage only; no pause or option changes -->
**Build rail is load-bearing.** Every top-level user-facing message below MUST begin with the build rail per `references/cli-output-contract.md` § Build progress anchor — SIX stages for development jobs, FIVE for non-development jobs (no `Implementation` stage), with stage 5 named for the job's deliverable (`deliverableTemplate` from the Job gate). The literal `Build brief` in this file's examples is the generic-build label; substitute the confirmed job's deliverable name. Examples in this file show the rail in context; the canonical stage table + `progressHeader(stage)` spec lives in the output contract. Do not drop the rail to save space.

For narrow/mobile chat surfaces, use the **compact progress anchor** defined in `references/cli-output-contract.md` § Build progress anchor (the `Ritual build · 2/6 Scope` chip) instead of forcing the full six-stage rail to wrap. Same contract, different rendering.

### When to use

- The user describes a new feature, refactor, migration, or implementation-heavy change that needs planning before coding
- The user wants the coding agent to gather codebase context, prior decisions, sub-problems, discovery questions, recommendations, and a build brief before implementation
- The user describes a problem they want explored ("we need to figure out X", "let's scope Y", "I want recommendations on Z")
- The user wants the full pipeline — sub-problems → scope → discovery → recommendations → build brief — not just one step
- The user runs `/ritual build` from inside a repo that already has explorations in the workspace — the resume path (Step 1.5) decides whether to continue an existing exploration or start a new one based on the per-exploration state badge

When **not** to use:
- The user already has a specific exploration id and just wants a quick status check — call `get_exploration` directly
- The user wants to *implement* a feature from a build brief that's already been generated and accepted — that's a separate downstream coding-agent task (the build brief itself is the input)

### Workflow — 13 steps (Steps 10-13 cover the build-brief → implement → sync close-the-loop phase; unpicked considerations are preserved as later candidates by default)

Use explicit **[USER PAUSE]** only at decision gates. Pause when the user must choose among options, approve creation or acceptance, resolve ambiguity, authorize implementation, accept cost/time, or provide missing non-code context. Do **not** pause for status-only steps, safe defaults, internal recon, or silent checks.

**Pauses are not optional even in auto-mode** (load-bearing). When the host agent has auto-accept / bypass-permissions enabled, the SKILL must still honor every `[USER PAUSE]` as a hard stop. Inferring an answer from context, choosing a default, or pressing on without an actual user reply defeats the build flow's value: Ritual is producing aligned recommendations because the human shaped the inputs, not because the agent guessed plausibly. We do not surface a heads-up about this to the user (Step 0) — we simply enforce the gates regardless of the host's auto-accept mode.

---

### CLI and async guardrails

Follow `references/cli-output-contract.md` for terminal output, dense-list formatting, user-facing vocabulary, and the no-internal-step-label rule. Follow `references/async-polling.md` for every long-running server operation. Whenever the user asks to **change or add** something via free text (refine sub-problems, reframe scope, add an anti-goal), follow `references/change-preflight.md` — restate the request and show the exact instruction before calling the mutating tool, and wait for confirmation. It is a hard pause even in auto-mode.

#### Step 0 — Auto-mode heads-up (informational, NOT a pause)

> **Changed 2026-05-21.** Pre-0.8.3 this was a blocking pause: the agent asked the user to confirm they were not in auto-mode and waited for a `1`/`2` reply before proceeding. That broke FTUE: a brand-new user running their first `/ritual build` hit a meta-question about a Claude Code TUI setting before they had any context for what Ritual does. Friction without value. Worse, no reliable programmatic signal exists for "is the agent in auto-mode" — every coding agent represents the state differently, the MCP request carries no mode flag, and the SKILL itself admitted "I can't read your Claude Code TUI footer from here." So the pause was theatre: it forced the user to assert something the agent had no way to verify.
>
> The new shape: one informational line in the FIRST user-visible message of the flow. No pause. No `[USER PAUSE]` here. If the user IS in auto-mode, the next genuine decision pause (workspace pick, scope pick, etc.) is the natural place they'll notice it racing past. The line below gives them the right cue + remediation.

Do NOT show an auto-mode / "~N decisions" / Shift+Tab heads-up. It reads as meta-instruction clutter at the start of the flow — just begin the flow plainly. (The pausing discipline below is enforced regardless of the host's auto-accept mode; we simply don't preface it with a lecture.)

Pausing discipline is still load-bearing — every `[USER PAUSE]` later in the flow is a hard stop regardless of whether the user reads it. The agent's contract is unchanged from the preamble: never infer an answer, never pick a default, never press on without an actual user reply. Auto-mode collapsing those pauses is the user's risk to accept; the SKILL enforces the gates regardless.

<!-- skill-options:no-gate-change: voice/copy cleanup — removes the auto-mode "~5 decisions" heads-up, adds a no-preamble/no-editorializing/render-verbatim voice rule, replaces job-gate + run-gate copy with plainer wording, and moves the context pulse to the bottom (above the CTA) starting only at the curate-questions step. No tracked pause gate, option, or Step header is added, removed, or changed. -->

**Voice — render gates plainly, add NOTHING (load-bearing, applies to EVERY message in the flow).** Output the gate copy this skill prescribes and nothing else. In particular, NEVER:
- **Preface a tool call with narration.** Don't say "I'll start by classifying the job…", "Let me kick off an exploration…", "I'll create the exploration and pull questions…". Just make the tool call; report the result plainly after.
- **Editorialize about the work.** Don't add commentary like "this is exactly the kind of ambiguous, cross-cutting work where it pays to surface context before writing code", "the design decisions still aren't settled", or any "here's why this step matters" justification. The user knows why they ran `/ritual build`.
- **Narrate internal mechanics or paraphrase the gate copy into process-talk.** Don't say "You're framed. Grounding in the codebase, then I'll…" or describe what Ritual's research agents do under the hood. Lead with the plain meaning for the user; surface mechanism only if they ask.

Every message should be the prescribed gate copy (rail + content + CTA) — terse, plain, no preamble, no sign-off commentary.

<!-- skill-options:no-gate-change: 2026-06-16 voice/copy polish — adds the Copy rules block, plainer overlap/workspace/verification/discovery render copy, and a causal pulse gloss. No tracked pause gate, option token, or Step header is added, removed, or renamed (structural baseline unchanged: 22 pauses / 26 steps). -->

**Copy rules (the calm-CLI-wizard contract — every gate obeys these):**
1. **Never print process/eval labels.** No `GATE N`, no `Step N`, no `Auto-decision: …`, no `LLM confidence`, no async-polling-contract talk. The rail already shows where we are — use the rail or a compact header (`Ritual build · 2/6 Scope`), never both, and never a `GATE N` banner.
2. **One decision per message.** Never bundle two gates (e.g. workspace-bind + overlap check) into one visible block. Render one gate, take the reply, then the next.
3. **End every decision gate with one clear CTA line.** A single `Reply …` / `Next: …` line, not a paragraph of options.
4. **Lead with "Recommended: …"** instead of multi-line justification. State the recommendation; don't explain why across several lines.
5. **Status updates are one sentence, no rail** (unless the stage changed). "Still preparing the brief — retrying safely." — never "Timeout on generate call — polling status (per async-polling contract)."
6. **Use user nouns, not internal shorthand:** workspace history (not KG), build requirements (not RB list), follow-ups (not deferrals), recommendations (not recs), signed-in user (not principal), "saves this selection" (not "commits the set"), strong/likely/possible match (not a confidence %).
7. **Hide mechanism unless it changes what the user should do.** Names of engine internals, scoring tiers, citation ids, and contracts stay out of gate copy.
8. **Only three kinds of message may be user-visible — nothing else (allowlist, load-bearing).** Between gates you output EITHER nothing, OR exactly one approved status line, OR the next gate (which OPENS with its rail — no preamble before it). Never narrate machinery: no "I'll read the reference files…", no "Classifying the job…", no "Running silent recon…", no "Polling / Fetching / Computing / Committing / Submitting / Triggering …", no "skipping … silently", no step numbers, no tool / schema / phase names. The **only** status lines that may appear between gates — render one of these verbatim, or stay silent:
   - `Generating discovery questions…`
   - `Saving selected questions…`
   - `Answering {N} questions from the codebase…`
   - `{N} answers saved. Generating recommendations…`
   - `Generating recommendations…`
   - `Recommendations ready.`
   - `Requirements ready.`
   - `Still generating…` / `Still preparing…` (while a slow step runs)
   - `No related prior runs in this workspace — starting a new run.` (empty-overlap case only)

   A gate must OPEN with its rail. Do **not** print "Computing the suggested 12…", "Rendering the landing", or any "here's what I'm about to show you" line before the rail. And never advance the rail to a stage that hasn't started — mark a stage active (●) only once its work is actually running. (Anything outside these three shapes is caught by the behavioral eval's `no_render_leaks` allowlist.)

   **Render-allowlist precedence (load-bearing — this rule outranks every example below).** This allowlist overrides every local example in the rest of this file. If a later section says to "tell the user", "emit one line", "print", "surface", or "render" a status that is **not** in the list above, treat that instruction as **stale** and do not render it — unless it is a full gate template that begins with the rail. **Never render transition narration after a user reply.** After any reply, the next visible message is exactly one of: the next gate, one approved status line, or nothing. A line that announces what you just did or are about to do ("Workspace selected. Now checking…", "Moving to scope", "Job confirmed. Now…") is forbidden even though no example prescribes it — the rail already shows where we are.

(These are enforced on authored copy by `scripts/check-skill-voice.mjs`; agent-invented violations — like the ones above — are caught by the behavioral eval's `no_render_leaks` linter reading the rendered snapshots.)

<!-- skill-options:no-gate-change: 2026-06-16 round-2 leak polish — adds voice rule #8 (no machinery narration between gates), plainer job-gate CTA + brief-handoff copy, tightened ordering-barrier wording. No tracked pause gate, option token, or Step header is added, removed, or renamed (structural baseline unchanged: 22 pauses / 26 steps). -->

<!-- skill-options:no-gate-change: 2026-06-16 round-3 leak polish — turns voice rule #8 into a render allowlist (gate | approved status | nothing) with the verbatim status list; compacts the Job gate to one validation sentence; plainer workspace/overlap/rec-CTA copy; accept-recs screen keeps the next stage ○ not ●. Copy + behavioral rules only — no tracked pause gate, option token, or Step header is added, removed, or renamed (structural baseline unchanged: 22 pauses / 26 steps). -->

<!-- skill-options:no-gate-change: 2026-06-16 vocab cleanup — de-jargons internal labels the agent was parroting ("ordering barrier" → "before the Job gate is confirmed"; "silent recon" / "codebase recon" → "reading the codebase"). Wording only — no tracked pause gate, option token, or Step header is added, removed, or renamed (structural baseline unchanged: 22 pauses / 26 steps). -->

<!-- skill-options:no-gate-change: 2026-06-16 allowlist-precedence pass — adds the render-allowlist precedence clause + no-transition-narration rule to voice rule #8, expands the approved-status list (Saving selected questions / Requirements ready / empty-overlap line), and normalizes conflicting local examples (Step 4 prior-work callout, Step 5.7 internal-only heading, discovery-landing copy, sub-problem parenthetical removed, categoryName grouping key, "skip silently" → "no user-visible output", resume picker "explorations" → "prior runs"). Copy + behavioral only — no tracked pause gate, option token, or Step header is added, removed, or renamed (structural baseline unchanged: 22 pauses / 26 steps). -->

**Per-agent indicators** (informational, for the SKILL's own awareness — NOT to gate behavior):

| Agent | Where the mode shows up |
|---|---|
| **Claude Code** | TUI footer shows `auto-accept edits` or `bypass permissions`. Toggled with **Shift+Tab**. |
| **Cursor** | "Auto" / "Yolo" toggle in the Composer/Agent panel. |
| **Codex** | `--full-auto` CLI flag or the equivalent setting in the IDE extension. |
| **Kiro** | Per-server `autoApprove[]` arrays in `mcp.json`, plus any global "auto" toggle in the Agent panel. |
| **Windsurf / VS Code Copilot / Gemini CLI** | Each has its own auto-accept mode in settings. |

The table is here so future contributors understand WHY the heads-up mentions Claude Code's Shift+Tab specifically — that's the dominant target client. If we add an elicitation-based picker (see `documents/architecture/selection-cursor-pattern.md` §"Future — MCP elicitation"), the auto-mode concern reduces further because elicitation form-mode requires actual user input regardless of agent mode.

##### Step 0.1 — Parse build-mode flags (load-bearing for Step 9.6, future Audit 2/3 gates)

Per `documents/architecture/audit-suite.md` § 7a, `/ritual build` accepts three audit-mode levels:

```text
/ritual build <problem>                  → auditMode = 'normal'    (today's behavior, default proceed)
/ritual build --audited <problem>        → auditMode = 'audited'   (recommend at each gate)
/ritual build --audit=strict <problem>   → auditMode = 'strict'    (auto-run with 90s/chain time budget)
```

Aliases the SKILL accepts (for agent-friendly UX):
- `--audit` (no-equals form, treated identically to `--audited`)
- `audited` (bareword form, agent-friendly when users type conversationally)

At Step 0 (or whenever the agent first parses the user's `/ritual build` invocation), extract the audit-mode flag and store as `auditMode` in working memory. Default to `'normal'` if no flag present. The audit gate at Step 9.6 (and future Audits 2/3 at Steps 10b.5 + 11.1, ships in PRs B/C) read this variable to choose between three prompt styles.

If the user types `always audit for this build` mid-flow at the Step 9.6 prompt, upgrade `auditMode` from `'normal'` or `'audited'` → `'strict'` for any remaining audit gates in the same session. The upgrade is session-scoped (doesn't persist across `/ritual build` invocations).

Persist `auditMode` to `Exploration.metadata.auditMode` at `create_exploration` time (additive JSONB key — no schema migration) so `/ritual resume <exploration-id>` picks up the same mode the original build started with, and `/ritual lineage <exploration-id>` can render which gates ran + their outcomes.

<!-- lite:keep-start -->
<!-- skill-options:no-gate-change: 2b (low-confidence clarifying question — server sets clarifyingQuestion only when confidence <20% or it defaulted) + 2c (confident generic — accept and proceed) are COPY variants of the same gate; options are unchanged (proceed | name-the-job; 2b adds answer-the-question, which is a name-the-job correction) -->
#### Step 0.7 — The Job gate: classify the job to be done

**The FIRST tool call of a fresh build.** The server — not you — classifies the user's raw ask into
one canonical job-to-be-done (the full catalog: development, product, marketing, prototyping). Your
job is to relay the result and get an explicit confirmation before ANYTHING else happens. This is the
`Job` stage of the build rail (see `references/cli-output-contract.md`).

When this gate runs:
- `/ritual build <ask text>` → run it IMMEDIATELY, before the workspace pick.
- Bare `/ritual build` (no ask) → proceed to Step 1/1.5 first; the moment a FRESH ask is captured
  (the user describes what they want to build), run this gate before continuing.
- Resume paths (Step 1.5 → resume) → skip this gate entirely; the exploration's job is already set.

<!-- skill-options:no-gate-change: ordering barrier + overlap-render copy cleanup — adds a behavioral rule and rewrites prescribed render copy; adds/removes no tracked pause gate, option token, or Step header -->

**Before the Job gate is confirmed (load-bearing, forbidden behavior — this rule is internal; never name it to the user).** For `/ritual build <ask>`, `classify_work_item` is the FIRST tool call, and **until the Job gate is confirmed you must NOT**: read `.ritual/config.json`, call `list_workspaces`, or mention workspace/config state. Workspace selection (Step 1) begins ONLY after the Job gate is confirmed. Narrating the upcoming step — e.g. *"Now I have the classification. No `.ritual/config.json` found, so I'll list workspaces next…"* — is a forbidden process-leak: render the Job gate's prescribed copy and nothing else (no plan narration, no "I'll … next"). (The classifier needs no workspace context; passing one is unnecessary.) This rule only constrains what you may inspect and say *before* confirmation — the normal gate rules govern pausing/turn-handling, unchanged.

1. **Call `mcp__ritual__classify_work_item`** with `raw_input` = the user's ask, verbatim. Do NOT
   classify yourself, do NOT pre-filter to development jobs. It returns
   `{ jtbd, workItemLabel, deliverableTemplate, why, confidence, isGenericFallback, clarifyingQuestion?, personaCoverage }`.
   `isGenericFallback` (and `confidence`) are the typed-uncertainty signal: when it's `true`, the
   result is the catch-all (`build-feature` / `produce-deliverable`) or the classifier wasn't sure —
   it is NOT a confident match, and which render variant you use in step 2 depends on it. On that
   generic path the response also carries `clarifyingQuestion` — a plain-language question generated
   from the user's ask, which step 2b renders verbatim to disambiguate toward a specific job.

2. **Render the validation prompt** (rail stage `Job`). This gate is a plain-language VALIDATION of
   what you're about to build: restate the ask + the matched job in the user's words, then let them
   confirm or correct. Route to a variant by the response: a **`clarifyingQuestion`** present → **2b**
   (we're genuinely unsure — ask, but let them proceed); else `isGenericFallback` true → **2c** (a
   confident generic build — accept and proceed); else → **2a** (a confident specific match).

   **2a — Confident match** (`isGenericFallback` is `false`): the classifier matched a specific job.

   ```text
   Ritual build
   ● Job  ○ Scope  ○ Discovery  ○ Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

   Ritual will produce a {deliverableTemplate} for {restate the ask in one short clause}.

   Reply `proceed` if that's right, or tell me what to adjust.
   ```

   **2b — Genuinely unsure: ask, but let them proceed** (the response carries a **`clarifyingQuestion`**
   — the server sets it ONLY when it was essentially guessing: numeric confidence below 20, or it
   failed to classify and defaulted). A generic result alone does NOT land here — only a *low-confidence*
   one does; a confident generic build goes to **2c**. The clarifying question is a single plain-language
   question the server generated FROM the user's specific ask. **Render it verbatim** — it is grounded in
   their words and leak-free. Do not rephrase it, do not append a menu, do not mention classification /
   jobs / categories / confidence. The user has TWO ways out: answer to focus it, OR reply `proceed` to
   continue with the deliverable. **Leak rule (load-bearing):** the rendered copy must NEVER say
   "generic", "I couldn't classify", "fallback", "catch-all", or otherwise reveal that classification was
   uncertain — that is internal state. Present it as a normal question about their ask. (See
   `loud-fallback-escalation.md`.)

   ```text
   Ritual build
   ● Job  ○ Scope  ○ Discovery  ○ Recommendations  ○ Feature Brief

   You're looking to: {restate the ask in one short clause}

   {clarifyingQuestion — verbatim}

   Answer in a sentence — or reply `proceed` and I'll continue with a {Deliverable}.
   ```

   (Rare degraded case — you reached 2b but `clarifyingQuestion` is missing: ask which KIND of work it
   is, with the same `proceed` option — • a coding-agent / MCP / skill capability • a backend service
   or API • a frontend / UI feature • a refactor, migration, or infra change • something else, in your
   own words.)

   If the user ANSWERS, call `mcp__ritual__classify_work_item` AGAIN with the same `raw_input` plus
   `correction` = their reply (and `previous_jtbd`), then re-render: **2a** if it now matched a specific
   job, otherwise **2c**. If the user replies `proceed`, go straight to **2c** (accept the generic).

   **2c — Accept and proceed** (`isGenericFallback` is `true` with NO `clarifyingQuestion` — a
   confident-enough generic build — OR the user chose to proceed from 2b, OR a re-classification is still
   generic): do NOT interrogate. Present the deliverable as a normal accept-and-proceed — **same clean
   shape as 2a**. Internally the job stays generic and is renamable later, but **the rendered copy must
   NEVER say "generic", "couldn't classify", "fallback", or otherwise reveal that** — that is internal
   state. Just name what Ritual will produce for their ask. (Never show a function-specific deliverable
   like "Frontend Web" for an unclassified build — only the function-agnostic `Feature Brief`.)

   ```text
   Ritual build
   ● Job  ○ Scope  ○ Discovery  ○ Recommendations  ○ Feature Brief

   Ritual will produce a {Deliverable} for {restate the ask in one short clause}.

   Reply `proceed` if that's right, or tell me what to focus on.
   ```

   Do not render `personaCoverage` — persona representation is handled server-side now; only surface
   it if the user explicitly asks who's involved.

   Rail naming (deliverable-named rail, 2026-06-11): render `{Deliverable}` as the PROPOSED job's
   `deliverableTemplate` from the classify result (e.g. `Launch Brief`, `PRD`, `Service Build Brief`;
   `Feature Brief` for the generic `build-feature`), and OMIT the `Implementation (Your agent)` stage
   entirely when the proposed job is not a development job — non-dev rails have FIVE stages ending at
   the deliverable. A correction that changes the job updates the rail on the next render. Spec:
   `references/cli-output-contract.md` § Canonical stage table.

3. **[USER PAUSE]** — wait for the user's actual reply. Never infer confirmation from the original
   ask, auto-mode, or silence. `proceed` / `yes` / `ok` confirms. ANY other substantive reply is a
   correction: call `mcp__ritual__classify_work_item` AGAIN with the same `raw_input`, plus
   `correction` (the user's words) and `previous_jtbd` (the rejected slug), then re-render step 2.
   The clarifying QUESTION (2b) is asked AT MOST ONCE per gate — if the re-classification after the
   user's answer is still generic, render **2c** (proceed as a generic `Feature Brief`); do not ask
   the clarifying question again. Loop until the user proceeds.

4. **Remember the confirmed `jtbd`** — you pass it to `create_exploration` at Step 6. Only after the
   user proceeds does the flow enter the `Scope` stage (workspace pick onward).
<!-- lite:keep-end -->

#### Step 1 — Pick a workspace

<!-- skill-options:no-gate-change: connection-freshness ping check is a non-interactive warn, adds no user-facing gate or option -->
**Connection freshness check (one-time, warn-only) — fire on your FIRST MCP call this session.** Alongside the first `list_workspaces` call below, call `mcp__ritual__ping` **once** and inspect the returned identity:

- If the response is **missing `gitSha` or `toolContractHash`**, or reports **`version: "1.0.0"`** (the legacy hardcoded value), the user is connected to an **outdated / legacy Ritual MCP** — emit exactly ONE line, then continue normally (warn-only, never block):

  `⚠ Connected to an outdated Ritual MCP (no build identity) — some build features may be unavailable. Run \`ritual doctor\` to check, then \`ritual init\` if it flags a refresh.`

- Otherwise (identity present and not legacy), say nothing and proceed.

Do this **at most once per session** — don't re-ping on later steps.

Resolution order:

1. **Project-bound workspace (preferred).** Check for a `.ritual/config.json` at the project root (you can use the Read tool — the file is a small JSON with `workspaceId` + `workspaceName`). If it exists, that's the workspace this repo is bound to. Use it without pausing.

   **Validate the binding + get exploration count in one call.** Call `mcp__ritual__list_workspaces()` (no args). Each row in the response carries `_count.explorations` — the authoritative count, server-side, including any explorations created via web UI / other agents / out-of-band API calls. Find the row matching the bound `workspaceId`:

   - **Not found** (deleted, access revoked, wrong id in config): pause with a clear error and offer `workspace: list` to re-bind. Don't fall through to `list_explorations` later — it errors with a less actionable message.
   - **Found:** store `workspace.explorationCount` for Step 1.5. The SKILL never maintains a local "empty workspace" cache because that goes stale against anything that mutates the workspace outside this CLI's view.

   User-visible:

   > Using workspace: **{workspaceName}** from `.ritual/config.json`.
   > Override with `workspace: list`.

   Pause only if the file is missing/malformed, the workspace cannot be accessed (validation failed above), or the user explicitly asks to switch.
2. **List existing project workspaces.** If no `.ritual/config.json`, call `mcp__ritual__list_workspaces` — this returns project-type workspaces (the General workspace is excluded by default; agents never use it). This path is usually a first-time user who has never been told what a workspace IS — open the render with the one-line explainer (same register as the CLI's `ritual init`), then the numbered list (id, name):

   <!-- skill-options:no-gate-change: adds explainer prose to the existing workspace-pick gate; options and pause unchanged -->

   > A **workspace** is where Ritual keeps the context, decisions, and reasoning for related work — so future runs build on this one instead of starting cold. You're not in one yet.
   > {numbered list}
   >
   > Where should this run live? (pick one, or I'll create a new workspace for you)

   (Repo-agnostic on purpose: don't say "this repo" — agents like v0 have no repo. If there are NO existing workspaces, skip the list and just say *"Ritual will set up a workspace for this — a workspace keeps the context for related work. I'll name it `{name}`; sound good?"* and create it.)

   **[USER PAUSE]** for selection.
3. **Create a new one if none exist or user wants a fresh one.** Call `mcp__ritual__create_workspace` with a name — convention is to name it after the repo (basename of cwd, or origin remote). Confirm the name with the user first. **[USER PAUSE]**

Store `workspace_id` for the rest of the flow.

If you created a new workspace, persist the binding to `.ritual/config.json` so future runs in this repo skip the workspace-selection prompt. Write it yourself if you have filesystem write access; otherwise show the user the JSON and have them save it.

<!-- skill-options:no-gate-change: prose only — corrected the .ritual/config.json description and dropped mentions of the removed `--persona` flag; no decision gate or offered options changed -->
**`.ritual/config.json` is committed to the repo — it is shared, not per-user.** Same model as `.eslintrc.json` or `tsconfig.json`: it binds this codebase to a Ritual workspace (`workspaceId` / `workspaceName`) so everyone working on this repo resolves the same place. It holds ONLY repo-level facts — write nothing per-user into it. Persona and template defaults are user-scoped (your Ritual account's `user.persona`, set during `ritual init`), NOT stored here; PATs and auth tokens live in `~/.config/ritual/` and never in this file.

When you write the config, also write `.ritual/.gitignore` if it doesn't already exist so any future per-user state files in this directory get ignored while `config.json` itself stays tracked:

```
# .ritual/.gitignore — auto-generated by the SKILL.
# config.json is repo-shared and meant to be committed (workspace
# binding + team defaults). Per-user state files go below.
*
!.gitignore
!config.json
```

When you later see `.ritual/config.json` in `git status` output (modified or untracked), it's correct to commit it — don't ask the user whether it's per-user state; this comment is the answer.

#### Step 1.1 — No-arg `/ritual build` entry

<!-- skill-options:no-gate-change: ask-copy gains example asks + the granularity teaching line; no pause or option changes -->
If the user invokes `/ritual build` with no problem statement, set `raw_input = null` and **do not ask for a problem statement before checking the workspace**. A no-arg build is often a continuation or next-work discovery intent, so `resume` and `suggest high-leverage work` must remain available.

After workspace selection, proceed into the existing-exploration check below. User-facing copy should avoid internal step labels and should offer these paths when applicable:

```text
I can help you continue existing work or find the next high-leverage thing.

{existing exploration summary, if any}

Reply with:
- a number/name to resume
- `suggest` to have me look for high-leverage candidates from repo + workspace history
- a feature/problem description to start fresh
- `none` to exit

e.g. "audit log for admin actions" — a few words works; discovery extracts
the detail. Constraints and exclusions you type become binding scope.
```

If there are **zero existing explorations** and `raw_input = null`, do not say "starting fresh" and do not advance to template selection yet. Ask for the feature/problem first:

```text
Ritual build
✓ Job  ● Scope  ○ Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Using workspace: {workspaceName}.

No Ritual history here yet.

Next: start with a feature, or let Ritual suggest high-leverage work from the repo.

Any granularity works, and any job — not just code:
  "audit log for admin actions"
  "Add soft-delete for projects. Restorable 30 days, then purge via the
   existing background-job system. Don't touch billing records; exports
   must exclude deleted data."
  "draft the launch brief for the new pricing tier"
A few words → discovery extracts the detail. Constraints and exclusions
you type become binding scope.

Reply with a feature/problem description, `suggest`, `pulse <ask>`, or `none`.
```

For `pulse <ask>`, route to `/ritual context-pulse <ask>`. Keep it as an optional side path; do not make context-pulse feel like the required first move for `/ritual build`.

If the user replies `suggest` but the workspace has no prior explorations, explain that suggestions need prior workspace signal and ask for a feature/problem instead.

#### Step 1.5 — Resume vs start (cognitive-debt check)

**Skip the `list_explorations` call when the workspace is provably empty.** Two signals count as proof:

1. You just created the workspace in Step 1 (in-session creation — there are no explorations possible yet).
2. The bound workspace's `_count.explorations === 0` (server-side, read from the `list_workspaces` call in Step 1). This is authoritative against any source of mutation — web UI, other agents, out-of-band API calls.

If either fires, emit a single line and proceed straight to Step 2. **This skip covers ALL of Step 1.5 — including step 8 (the `check_exploration_overlap` call). No `list_explorations`, no `check_exploration_overlap`, no resume picker. There is nothing to compare against in an empty workspace; running either tool is pure overhead that resolves to "nothing here" after a wasted MCP roundtrip + LLM cost + an interactive permission prompt the user has to approve.**

> No prior work in this workspace — starting fresh.

<!-- skill-options:no-gate-change: 2026-06-23 — adds a shell/git-guarded resolve-by-branch probe at the TOP of Step 1.5. It either auto-resumes (a teleport into an existing exploration — NOT a new gate) or falls through to the existing picker. No new pause gate and no new Step header is added; the structural fingerprint (22 pauses / 26 steps) is unchanged. -->
**Resolve-by-branch first (when your agent can run shell + git).** Most of the time "which exploration?" is answered by the repo + branch the user is on — so try that before the picker, and skip it entirely on a match:

1. Run `ritual repo-key --json` (one shell call) → `{ repoKey, branch, isDefaultBranch }`.
2. Call `resolve_exploration(workspace_id, repo_key, branch, is_default_branch)`.
3. If the result's `matchedBy` is `"branch"`, that exploration IS the one for this branch — **teleport straight into its build flow at its current step (treat exactly as a `resume` pick — render per `references/resume-flow.md` § R2). No picker, no pause.** And later, pass `repo_key`/`branch`/`repo_key_scheme`/`repo_name`/`is_default_branch` (the whole `repo-key` object) to `create_exploration` so a brand-new exploration links to this branch.
4. If `matchedBy` is `"fallback"`, nothing matched this branch — ignore the returned row and fall through to the picker below (the user may want a different one).

**If your agent can't run shell/git** (v0, Lovable, browser-only agents), skip this probe entirely and use the picker below — the v0 profile sets the "shell/git" guards false.

Otherwise: before generating new sub-problems, check whether the user's intent might already be covered — partially or fully — by an existing exploration in this workspace.

The cost of skipping this step inappropriately is high: an engineer mid-loop on a feature ends up with two parallel explorations on the same problem, the build brief grounds on the wrong one, and the knowledge graph gets diluted with near-duplicate decisions. That's why the skip is gated on a positive server-side empty signal (in-session creation OR `_count.explorations === 0`), never on a client-side cache or heuristic.

Steps:

1. **Fetch the workspace's exploration list.** Call `mcp__ritual__list_explorations(workspace_id)`. Default returns each exploration with an `implementationStatus` block — the state badge tells you where each one stands without needing per-exploration follow-ups.

2. **Filter to recent + relevant.** Sort by most recently updated. Drop archived. Cap at 5 in the user-facing summary (the rest stay available if asked).

3. **Group by state badge** and surface to the user with a single message. Do not mention `Step 1.5` in the CLI.

   If `raw_input` is present, frame this as an overlap/continuation check before starting fresh:

   > I see {N} prior run{s} in this workspace:
   >
   > **{state_glyph} {state_label}** ({count})
   >
   > 1. **{name}** — {short scope summary, first 80 chars of problemStatement}
   >    {recommendationCount} rec{s} ({accepted}/{total} approved{implementationSegment}), {openDeferralsCount} open deferral{s}.
   >    Next: {state-specific call-to-action — see table below}.
   >
   > Recommended: resume one if it matches this work.
   > Reply with a number/name to resume, `suggest` to find high-leverage candidates from repo + workspace history, `delete N` to remove a duplicate/misfire, or `proceed` to start fresh.

   If `raw_input = null`, frame this as the user's no-arg start screen:

   > I can help you continue existing work or find the next high-leverage thing.
   >
   > **{state_glyph} {state_label}** ({count})
   >
   > 1. **{name}** — {short scope summary, first 80 chars of problemStatement}
   >    {recommendationCount} rec{s} ({accepted}/{total} approved{implementationSegment}), {openDeferralsCount} open deferral{s}.
   >    Next: {state-specific call-to-action — see table below}.
   >
   > Reply with:
   > - a number/name to resume
   > - `suggest` to have me look for high-leverage candidates from repo + workspace history
   > - `delete N` to remove a duplicate/misfire from this list (soft-delete; recoverable)
   > - a feature/problem description to start fresh
   > - `none` to exit

   **Picker rendering anti-pattern (load-bearing) — observed 2026-05-15 in `/ritual resume`, same shape applies here:** each exploration gets ONE picker number `{N}.` on its title line. The summary, recommendation count, and Next-line are indented continuation prose under that number, NEVER their own numbered or bulleted list items. Picker numbering is **flat across all state buckets** (1, 2, 3, … regardless of which `{state_glyph}` header they sit under), so a single number unambiguously picks one exploration. The `({count})` in parens after each state-bucket header is informational and is NEVER a picker number. See `references/resume-flow.md` § R2 for the full anti-pattern with a worked example.

   **`{implementationSegment}` resolution rule** — derive from `implementationStatus.implementationRecord` on the listing response:

   | Condition | Render |
   |---|---|
   | No `ImplementationRecord` | `` (empty — drop the segment) |
   | Has record but `prUrl` is null | ` · synced (no PR linked)` |
   | `prStatus = merged` | ` · implemented in PR #{prNumber}` |
   | `prStatus = open` or `draft` | ` · implementing in PR #{prNumber} [{prStatus}]` |
   | `prStatus = closed` (not merged) | ` · abandoned (PR #{prNumber} closed)` |

   In markdown-rendering agents, hyperlink `PR #{prNumber}` to `prUrl` so users can click through. In plaintext agents, append `prUrl` on the next line.

   **Rationale** — promotes recommendations to the visible noun and folds the previously-separate "decisions logged" count into the recommendation lifecycle. `Implemented` means "this exploration's approved recs shipped as code, here's the PR" — a stronger user-facing signal than a raw decision count. Decisions still exist as the underlying KG primitive (and are still surfaced explicitly by `/ritual lineage`), but they're no longer a headline concept in the build/resume status line.

   State badge → user-facing label + call-to-action:

   | Glyph | State | User-facing label | Suggested next action |
   |---|---|---|---|
   | 📍 | `in_progress` | "still in discovery" | "Continue discovery" |
   | 💬 | `awaiting_admin` | "waiting on admin to accept recommendations" | "Show recommendations for admin review" |
   | ✅ | `ready` | "ready for build brief" | "Generate the build brief and continue to implementation" |
   | 🛠 | `in_flight` | "implementation in progress" | "Resume — generate or refresh the build brief on remaining work" |
   | ✓ | `done` | "shipped with follow-ups" if open deferrals exist; otherwise "shipped context" | "Address follow-ups or use `/ritual lineage` if relevant. Hide fully complete shipped work by default." |
   | ⚠ | `implemented_ahead` | "code shipped before admin acceptance" | "Surface to user — ask admin to review the implementation against the un-accepted recs, or update the recs to match what shipped" |

   The `implemented_ahead` callout is load-bearing: it means a collaborator implemented a recommendation while it was still in `draft` or `pending_review`, and the snapshot column froze that timeline. The user (typically an admin) should know about this BEFORE you do anything else.

4. **[USER PAUSE]** — wait for the user to pick resume / suggest / fresh / abort, or to provide a new feature/problem description.

5. **If the user picks "resume":**
   - Set `exploration_id` to the picked exploration.
   - Use the state badge to decide which step to jump to (see "Suggested next action" column above).
   - Skip ahead in this skill — don't re-run Steps 2-9 for an exploration that already has them done.
   - For `ready` or `in_flight` states, jump directly to Step 10 (build brief generation).
   - For `awaiting_admin`, jump to Step 9 (review + `proceed`). Only an admin can move it forward; collaborators see the recs and proceed only if they're explicitly authorized to implement ahead.
   - For `implemented_ahead`, surface the situation to the user and ask what to do — typically the admin reconciles by either approving the recs post-hoc (no code change needed) or updating the recs to match shipped reality.
   - **For `done` or `in_flight` — branch-existence sanity check FIRST (when your agent can run shell + git).** *(CLI Tenet #9 — sanity-check the world before trusting the database.)* **If your agent can't run shell/git** (v0, Lovable, browser-only agents), skip this probe and the footprint probe below, treat the KG state badge as truth, and tell the user you couldn't cross-check it against local git. The state badge is computed from `ImplementationRecord` rows in the KG. If the KG was seeded from synthetic/bootstrap data (a common state in early pilot deployments), the record can assert a PR/branch that doesn't exist in this repo. Before treating the exploration as ✓ shipped, verify:

     ```bash
     # If implementationRecord.branch is set:
     git rev-parse --verify "origin/${implementationRecord.branch}" 2>/dev/null \
       || git rev-parse --verify "${implementationRecord.branch}" 2>/dev/null

     # If implementationRecord.prNumber is set (and `gh` is available):
     gh pr view "${implementationRecord.prNumber}" --json state 2>/dev/null
     ```

     If neither resolves, surface this to the user as a single-action proposal (CLI Tenet #2):

     > Note: per the KG this is shipped on `{branch}` (PR #{num}), but I don't see that branch in this repo or remote. The implementation record may be bootstrap/synthetic data.
     >
     > Treat as ready-to-implement-for-real? **(y/N, or tell me what's actually shipped)**

     Don't paint 3-4 options ("treat as done / treat as fresh / inspect the KG row / something else") — one decisive proposal with a yes/no/correct-me escape hatch. If yes: jump to Step 10 (build brief). If no/correct-me: take the user's input as ground truth and update the next move accordingly.

   - **For `ready` or `in_flight` — implementation footprint check FIRST (when your agent can run shell + git; otherwise skip — see the guard above).** *(Same shape as `/ritual resume` Step R3.5.)* The KG can't distinguish "brief generated, no code yet" from "mid-implementation, unsynced" from "implementation was started and then dropped" — all three look like `ready` because no `ImplementationRecord` exists until `sync_implementation` is called. Run the footprint probes using the `Ritual-Exploration: <id>` commit trailer mandated by Tenet #14:

     ```bash
     git log --all --grep="Ritual-Exploration: ${exploration_id}" --oneline 2>/dev/null
     git rev-parse --verify "feat/${exploration_slug}" 2>/dev/null
     gh pr list --search "Ritual-Exploration: ${exploration_id}" --state all --json number,state,headRefName 2>/dev/null
     ```

     The **dropped-work case** is the load-bearing one: `git log --all` finds attributed commits, but the branch is gone AND no PR exists. Without this check, the agent silently regenerates the brief and the user loses a day of work that was still recoverable from the reflog. Surface as:

     > ⚠ I see {N} commits attributed to this exploration in your git history from {N} days ago, but the branch is gone and no PR was opened. Looks like the implementation was started and dropped. Want me to: **(a)** show you the orphan commits so you can recover them (`git cherry-pick`), OR **(b)** start fresh implementation from the brief?

     Full decision table for all footprint shapes (mid-implementation, open PR, merged-but-unsynced, orphan-only, etc.) is in `/ritual resume` Step R3.5. Apply that table here verbatim when resuming via this path.

6. **If the user picks "start fresh":** continue to Step 2 normally. The new exploration will sit alongside the existing ones; they're independent rows in the workspace.

6a. **If the user picks `delete N` / "remove this from the list":**

   This path handles duplicates and misfires that pollute the resume picker. Common shape: user accidentally created a near-duplicate exploration (started fresh thinking the original was unrecoverable), or a NOT_STARTED row from a typo / wrong-scope misfire that never converged. Eiman hit this in `nebula` on 2026-05-14 — two `Nerve-center /home dashboard` rows, no way to clear the unwanted one. This option fixes that.

   Steps:

   a. **Resolve `N` to an exploration_id.** The user replied `delete 2` referencing the numbered list rendered in step 3. Pick the exploration at that index. If they typed a name instead (`delete "Nerve-center duplicate"`), match by `name` (case-insensitive, exact or prefix).

   b. **Show the target + ask for explicit confirmation** *(CLI Tenet #2 — single decisive proposal, not a 4-option menu)*:

      > About to archive: **{name}** ({recommendationCount} rec{s}, {openDeferralsCount} open deferral{s}, last updated {relative time}).
      >
      > This soft-deletes the row — the full record (matters, questions, recs, attestations, decisions) is preserved for audit. The exploration disappears from this and future resume pickers. Restore is admin-only and not exposed in the CLI today.
      >
      > **(y/N)** — y to archive, anything else to cancel.

   c. **[USER PAUSE]** — wait for `y` / `yes` (case-insensitive). Anything else = cancel back to the picker without calling the tool. Don't lecture; just say "Cancelled. Here's the picker again:" and re-render the menu.

   d. **Call `mcp__ritual__archive_exploration(exploration_id)`.** On error (404 / 403 / 5xx), surface the failure and re-render the menu — don't silently swallow.

   e. **Re-render the menu.** After successful archive, refresh the list (call `mcp__ritual__list_explorations` again) and show the updated picker. Lead with: "Archived **{name}**. Updated workspace:" — don't make the user re-derive what happened. Then return to step 4 ([USER PAUSE]) — the user can pick resume / suggest / fresh / `delete M` again.

   f. **Anti-pattern**: do NOT auto-pick "start fresh" or "resume the survivor" after a delete. The user chose to clean up, not to commit to a next step.

6b. **If the user picks `suggest` / "help me find the highest-leverage thing":**

   This path is for the "I have context but no concrete problem yet" case. The agent does a light workspace scan FIRST so suggestions land on real codebase and prior-deferral signals, not generic advice. This is **not** focused feature recon because no problem has been selected yet; focused recon still happens after the user picks a candidate.

   Steps:

   a. **Run a light workspace scan** (15-30 seconds of work, faster than Step 3's focused recon):
      - Glob top-level structure (README, package.json/setup.py, top dirs)
      - Skim 3-5 most-load-bearing files
      - Build a 5-10 line workspace scan summary: architecture shape, active modules, obvious seams, open deferral hotspots, and files tied to recent Ritual implementations
      - Collect a sources[] array — the file paths you actually read, 5-10 entries

   b. **Tell the user** what you found and that you're sourcing suggestions:

      > Reading the codebase: {recon summary, ≤ 8 lines}
      >
      > Now asking the workspace for high-leverage problem candidates…

   c. **Call `mcp__ritual__suggest_high_leverage_problems`:**

      ```
      {
        workspace_id,
        codebase_recon_summary: <the workspace scan summary from step a>,
        sources: <the file paths from step a>
      }
      ```

      One LLM call (~3-5 seconds). Returns up to 4 candidates with title, summary, rationale citing a specific signal (deferral, prior decision, etc.), and referencesPriorWork.

   d. **Surface the candidates** as a numbered list, with the rationale prominent — that's what makes the suggestion auditable. Use the readability-first dense-list shape from the Developer-facing output contract, not compact wrapped paragraphs. Each candidate should have a blank line before the next candidate and labeled blocks for `Why high-leverage:` and `Touches:`:

      ```text
      Based on this workspace's state, here are {N} candidates ranked by leverage:

      1. {candidate.title}

         {candidate.summary}

         Why high-leverage:
         {candidate.rationale — cite the specific RB, deferral, prior decision, shipped PR, or file-level signal.}

         Touches:
         {referencesPriorWork — list exploration names/ids, PRs, RB ids, or deferrals. Wrap if long.}


      2. {candidate.title}

         {candidate.summary}

         Why high-leverage:
         {candidate.rationale}

         Touches:
         {referencesPriorWork}


      Reply with a number to lock that scope, `suggest` to regenerate candidates, or describe a different problem to start fresh.
      ```

      If one candidate would resume an existing in-flight exploration rather than create a duplicate, add a short note after the picker:

      ```text
      Note on #{N}:
      There's already an in-flight exploration for {RB/problem}. If you pick it, route into
      `/ritual resume` on that exploration rather than creating a duplicate.
      ```

   e. **[USER PAUSE]** — wait for the pick.

   f. **If the user picks one (1-N):**
      - Set the chosen candidate's `summary` as the `raw_input` for the rest of the flow.
      - **Skip Step 1.5 step 8 (overlap check)** — the user just picked from system suggestions explicitly grounded in workspace state; a fresh overlap pass would be redundant noise.
      - **Run the unchosen-candidates gate (f.1) BEFORE continuing**, then continue to Step 2.

<!-- skill-options:no-gate-change: f.1 is an OPTIONAL skippable sub-prompt nested in Step 1.5 step 6 (default skip); adds no tracked pause gate or Step header, so the structural fingerprint is unchanged (check-skill-options-contract green). -->
   f.1 **Unchosen-candidates gate (2026-06-14, unchosen-options → discovery worktrees).** The candidates the user did NOT pick are paths worth not silently dropping. Render ONE compact, SKIPPABLE prompt — for each unchosen candidate, the user can spin up **discovery now** (a background worktree reasons it to a build brief) or **log it as a future job**. Promote DELIBERATELY: the default is to drop. (This gate is itself skipped in autonomous/worktree mode — never spawn discovery recursively.)

      <!-- skill-options:no-gate-change: prose-only copy tightening of the discover/next-job/skip descriptions; option tokens + gate unchanged -->
      ```text
      You picked #{k}. For the rest:
        • `discover <nums>`  — explore unpicked option(s) in parallel; returns a build brief, no code.
        • `next-job <nums>`  — save as future work.
        • `skip`             — drop them. Default.
      ```

      Resolve the reply, then continue to Step 2 for the picked candidate:
      - **`discover <nums>`** → for each, run `ritual lite "{candidate.summary}" --worktree` **in the
        BACKGROUND** (do not block the build — use your shell's background/async execution). It spins a
        git worktree and runs autonomous discovery to a brief there; tell the user where (`<repo>.ritual-discover/<slug>`).
        The result is an exploration with `spawn_origin: 'discovery_worktree'`; its brief is
        agent-authored, not human-reviewed. (See `references/unchosen-options-discovery-worktrees.md` in `documents/architecture/`.)
      - **`next-job <nums>`** → for each, call `mcp__ritual__create_exploration` with the candidate's
        `title` as `name`, its `summary` as `problem_statement`, `spawn_origin: 'next_job'`, and NO
        `agentic` flag — a NOT_STARTED draft that shows in the workspace roster as a future job. Cheap; nothing runs.
      - **`skip` / no reply about them** → drop silently.

      Keep it ONE prompt, never per-candidate pauses. If the user just proceeds without addressing it, treat as `skip`.

   f.2 **Continue to Step 2 (template selection)** for the picked candidate.

   g. **If the user says "none" / "let me describe":** continue to Step 2 normally; treat as if they had originally picked "start fresh" with no raw_input yet (they'll provide one at Step 3-4 time).

   h. **If `suggestions` came back empty** (LLM produced nothing or workspace was too sparse): tell the user "I couldn't find anything to suggest — let's start with something you describe" and continue to Step 2.

7. **If there are zero existing explorations** in the workspace:

   - If `raw_input` is present: skip the user pause entirely. Say one line ("No existing explorations in this workspace — starting fresh.") and move to Step 2.
   - If `raw_input = null`: pause and ask what they want to build/explore before moving to Step 2. Use the no-arg copy from Step 1.1.

   Don't run the suggester from an empty workspace — there's no priors signal yet, and the user opening Ritual for the first time has stronger user-driven intent than the suggester could offer.

8. **Before the user commits to "start fresh"** — if they DID say "start fresh" AND the workspace has existing explorations to compare against — run a **semantic overlap check** against the workspace. This catches the case where what the user is describing is a near-duplicate of something that already exists, BEFORE they burn LLM cost on Steps 4-5:

   **Skip this overlap check entirely when the workspace has zero explorations.** Two signals count as proof the workspace is empty: (a) you just created the workspace in Step 1 (in-session creation), or (b) `list_workspaces._count.explorations === 0` for the bound workspace (server-side count from the Step 1 call). With zero existing explorations, there's literally nothing to overlap with — the call would return `candidates: []` after a wasted MCP roundtrip + LLM cost + (in interactive permission modes) a needless user approval prompt. This was an oversight in cli 0.9.3's empty-workspace skip path: the top of Step 1.5 correctly said "proceed straight to Step 2", but this step 8 instruction still ran the overlap check when there was nothing to overlap with. Fixed in cli 0.9.5.

   Call `mcp__ritual__check_exploration_overlap(workspace_id, raw_input)`. Pass the user's full natural-language description of what they want to explore as `raw_input` — the SAME text you'd later pass to `generate_considerations`.

   The response:

   ```
   {
     candidates: [{
       explorationId, name, problemStatement,
       jaccardScore, llmConfidence, llmRationale
     }],
     totalCandidatesScanned: number
   }
   ```

   - **If `candidates.length === 0`**: silently proceed to Step 2. Don't mention the overlap check happened. The whole point of the two-tier filter is silence in the common case.

<!-- skill-options:no-gate-change: 2026-06-16 overlap-gate copy — disambiguates it from the workspace picker (anchors "Using workspace:", drops "exploration"/"overlap" headline, names continue/inspect/new). Displayed start-fresh verb changes proceed→`new` but `proceed` stays an accepted silent alias; the pause, the three semantic options (resume/details/start-fresh), and the structural baseline (22 pauses / 26 steps) are unchanged. -->

   - **If `candidates.length > 0`**: surface a COMPACT callout BEFORE moving to Step 2 — a match list + one recommendation + one CTA. No URLs, no per-candidate "why it overlaps" essay, no future field names:

     > Using workspace: {workspace.name}.
     >
     > I found related prior runs in this workspace. You can continue one, inspect one, or start a new run.
     >
     > {for each candidate (in order, strongest first), numbered from 1:}
     > {N}. **{candidate.name}** — {candidate.matchLabel}
     >    {candidate.problemStatement, first ~100 chars, one line}
     > {endfor}
     >
     > Recommended: continue one if it's the work you meant.
     > Reply `resume 1`, `details 1`, or `new` to start a new run.

     This gate looks like the workspace picker but isn't — the workspace is already chosen (anchor it with the `Using workspace:` line), and this screen is only about reusing related prior work vs. starting fresh. Do NOT headline it with "exploration" or "overlap". `check_exploration_overlap` returns `matchLabel` as plain language (`strong match` / `likely match` / `possible match`) — render it verbatim; the raw model confidence is projected out, so there is no number to surface. The model's `whyOverlaps` rationale and the exploration URL are NOT rendered at the gate — they live behind `details {N}`.

   - `resume {N}`: treat the chosen one as the resumed exploration (same as Step 1.5 step 5 — jump to the right downstream step based on its state badge).
   - `new` (display this verb; accept `proceed` as a silent alias): continue to Step 2 (a new exploration; the relationship to the candidates is captured automatically server-side — do not narrate that).
   - `details {N}`: show the chosen exploration's full state via `mcp__ritual__get_exploration` (+ `get_recommendations` if any), including `whyOverlaps` and the URL, then re-render the compact callout above.

   **Calibration:** the threshold for surfacing is conservative — the agent is biased toward "miss not false-flag" (you'd rather silently skip a real overlap than noisily prompt the user when there isn't one). If you DO see this prompt, take it seriously — it's likely there's real overlap.

#### Step 2 — Template selection (server-side, silent)

> **Rewritten 2026-05-21 (CLI 0.9.0+), chain updated 2026-06-11 (JTBD-first entry).** Previously this section had three branches (persona-pinned / legacy-pinned / list-and-pick) that the SKILL had to navigate, and could optionally call `mcp__ritual__list_templates`. That tool is gone from the agent-facing MCP surface as of CLI 0.9.0. Template selection is now entirely server-side: when `create_exploration` is called without an explicit `template_id`, the server resolves the right SYSTEM template from the exploration's `jtbd` (the job confirmed at the Step 0.7 Job gate) → `workspace.defaultTemplateId` (team override) → `user.persona` (legacy fallback — no longer set during onboarding; not CLI-settable) → a designated generic fallback → system default, then forks it into a per-exploration Template atomically inside the same `create_exploration` request.

**For the agent: there is no template-selection step. Skip this Step entirely and go to Step 3.** Don't read `.ritual/config.json` for persona, don't try to call `list_templates` (it's not registered), don't render a "Using persona X" confirmation.

Why no user-visible confirmation: a "do you want to continue with your persona?" prompt without a real way to customize sections is theatre. If the user wants to change persona, they re-run `ritual init`. If they want to customize the template's section structure for one exploration, that's a separate not-yet-shipped capability (tracked on the FTUE backlog as "agent-side template customization via `template_schema` parameter on `create_exploration`"). Until that ships, no per-build confirmation has anything actionable to offer.

**What still happens inside `create_exploration`** (server-side, agent doesn't see it):

```
1. Resolve PARENT template from the chain:
     explicit dto.templateId
     → jtbd → the picked job's deliverable template
     → workspace.defaultTemplateId
     → user.persona via schema.id-matching SYSTEM template (legacy)
     → designated generic fallback (build-feature → Backend Service
       (Implementation Brief); produce-deliverable → Product Brief)
     → first SYSTEM template by createdAt (last resort)
2. FORK the parent into a per-exploration Template row
   (type='EXPLORATION', parentTemplateId set, schema copied)
3. CREATE the Exploration pointing at the forked template
4. Return { id, ... } to the agent
```

All atomic in one HTTP request. See `apps/api/src/modules/explorations/explorations.service.ts#create` for the exact code path.

**Role inference (still applicable):** the resolved template's primary ICP / role still drives recommendation tone, sibling exploration cap, and Step 8 run-mode default. The agent doesn't need to compute or display role — server-side resolution does the right thing per the persona's mapped ICP (e.g., `frontend-web` → ENGINEER → engineering-flavored recs). Only surface role when the user explicitly asks how the flow is being biased:

> Using **{role}** defaults. Override with `role: product` if needed.

Recognized roles (use the role keyword the API returns, not a paraphrase): `engineering`, `product`, `design`, `marketing`, `delivery`, `operations`.

If the user corrects the role mid-flow ("actually I'm building a PRD"), update internal role tracking. **Do not** re-pick the template — that requires re-creating the exploration, which is bigger than a mid-flow correction warrants. If the user genuinely wants a different template for this exploration, ask them to start over with `/ritual build` and correct the job at the Job gate (the jtbd drives the template now).

Proceed to Step 3.

#### Step 3 — Code reconnaissance moved (no step here)

> **Relocated 2026-06-11 (context-at-create).** Recon no longer runs before sub-problem
> generation — it runs AFTER the user locks the problem frame, as **Step 5.7**, so the first
> product output (sub-problems + frame) lands seconds after the Job gate instead of waiting on
> repo reads. Step 4 generates sub-problems from the user's ask alone; grounding arrives at
> discovery via the `additional_context` persisted at create. Nothing to do here — continue to
> Step 3.5.

#### Step 3.5 — Stage knowledge sources (PRDs / tickets / transcripts / etc.)

Code grounding happens silently after the frame locks (Step 5.7). Most real features ALSO have non-code context — PRDs, Jira/Linear tickets, design specs, meeting transcripts, Slack threads, customer-research notes — that get paraphrased into the problem statement and lose detail. Step 3.5 ingests those as first-class **knowledge sources** attached to the exploration BEFORE generating sub-problems, so the priorContext you'll see in Step 4 (`generate_considerations`) and downstream is grounded in what the user actually brought, not the paraphrase.

##### 3.5.1 — Reactive only — do NOT prompt for non-code context

**Do NOT proactively ask the user to attach PRDs/tickets/designs/transcripts.** This is a pure capability, not a gate — surfacing an "Optional: add non-code context" prompt before the user has even framed the problem is front-of-flow friction we deliberately removed (it also tends to over-justify *why* it matters, which is internal reasoning the user doesn't need). There is **no pause here.**

Handle knowledge sources **only reactively**: if the user *spontaneously* pastes a file/URL/text or says "use this PRD/ticket," ingest it via 3.5.2–3.5.4 below. Otherwise say nothing and proceed silently to Step 4 with code context only. The user can always attach context later via `/ritual context-pulse <exploration>` or by dragging refs in mid-flow.

##### 3.5.2 — Read the content

For each item the user provided, use the agent's local tools to obtain the text content. Different routes by what the user supplied:

| What the user provided | What to do |
|---|---|
| Local file path (PDF, markdown, txt, png, pptx, docx) | `Read` the file. For binary files (PDF/image/pptx) the agent's Read tool returns extracted text or visual description; for text files just read the bytes. |
| URL (Confluence / Notion / Jira / Linear / public web) | `WebFetch` the URL to get the text content. |
| Pasted text | Use the pasted text directly. |
| Local directory | `Glob` for likely docs (`*.md`, `*.pdf`, `*.docx`), then Read each. Cap at 5 files unless user says otherwise. |

Detect each item's **`source_content_type`** from format + content cues:

- Filename + content shape: `prd.md` with "Problem statement" → `PRD`; `*.pdf` with "Slide 1" markers → could be `PRD` or `SPEC` depending on body; user research notes with multiple speakers + timestamps → `TRANSCRIPT`.
- URL host: `*.atlassian.net` / `linear.app` / GitHub issue URL → `TICKET`; generic blog/docs URL → `URL`; Slack/Discord export → `CHAT`.
- Content signal: presence of `endpoints` / `paths:` / `openapi:` → `SPEC`; image binary → `IMAGE`; multi-speaker + timestamps → `TRANSCRIPT`.
- If ambiguous: prefer the broader category (`DOC` over `OTHER`; ask user when in doubt for high-leverage items).

##### 3.5.3 — Stage each source for registration after exploration creation

For each item, create a staged source record in working memory. Do **not** call `mcp__ritual__add_knowledge_source` yet because no `exploration_id` exists until exploration creation.

Staged record shape:

```json
{
  "source_content_type": "PRD | TICKET | URL | CHAT | TRANSCRIPT | SPEC | DOC | IMAGE | OTHER",
  "content": "<full text content the agent obtained>",
  "title": "<explicit title | first H1 | filename | TYPE from date>",
  "source_url": "<original URL if applicable>",
  "source_path": "<original local path if applicable>",
  "origin_feature": "DISCOVERY"
}
```

Surface only a staging summary:

> Staged **{title}** ({source_content_type}) for this exploration. I'll register it after the exploration is created; the content is already in my context for planning.

##### 3.5.4 — Update the augmented `raw_input` + score impact

The content the agent collected in Step 3.5.2 also gets folded into the augmented `raw_input` for Step 4's `generate_considerations` so the LLM sees the references inline:

```
{original user problem}

--- Codebase context ---
{codebase_context_packet from Step 3}

--- Reference context (provided by user) ---
[PRD — billing-export.md]
{first ~2000 chars of content, marked with type + title}

[TRANSCRIPT — billing planning sync 2026-05-09]
{...}

[TICKET — LINEAR-1234]
{...}
```

Cap the inline reference context at ~10000 chars total (priority: PRD/SPEC > TRANSCRIPT/TICKET > CHAT/DOC > URL > IMAGE). Longer refs stay accessible via `get_knowledge_source` after extraction completes, but for THIS build the inline summary keeps the LLM call bounded.

##### 3.5.5 — Pulse impact

Each registered knowledge source contributes to **Repo Grounding** (which, despite the name, covers BOTH code grounding from Step 3 AND reference grounding from Step 3.5 — the dimension will be split in MVP-2). For MVP-1 scoring (per `/ritual context-pulse` § CP3):

- Repo Grounding gets +5 points per registered knowledge source, capped at +15 total (so 3+ refs is the cap).
- Combined with code-recon signals already in the dimension, Repo Grounding stays in the 0-100 range.
- After Step 3.5 completes, fire the standard Step 3 pulse — the user will see Repo Grounding jump if they attached refs.

##### 3.5.6 — Skip path

If the user says "skip" / "none" / "later", proceed silently to Step 4. Do NOT pressure for more — refs are a feature multiplier, not a requirement.

The user can always come back later with `/ritual context-pulse <exploration>` to see the current Reference Grounding score, OR drag refs in mid-flow (e.g. at Step 8 if the agentic run surfaces a question that a PRD would have answered).

#### Step 3.9 — Work item settled at the Job gate (no step here)

> **Removed 2026-06-11 (JTBD-first entry).** Classification moved to the front of the flow — the
> Job gate at Step 0.7 (server-side `classify_work_item`, user-confirmed). The lead-persona PICKER
> that used to live here is gone with it: persona is no longer a user choice. The server resolves
> the job's full persona set (lead + contributors, weighted) and guarantees balanced representation
> in what it generates — discovery questions first. Nothing to render and nothing to ask here;
> continue to Step 4 with the `jtbd` confirmed at Step 0.7.

#### Step 4 — Generate sub-problems

##### 4.1 First draft

Call `mcp__ritual__generate_considerations` with:
- `workspace_id`
- `raw_input` — the user's problem/ask, **verbatim** (plus any reference context the user spontaneously supplied). **Recon does NOT feed this call (2026-06-11, context-at-create):** sub-problems are deliberately generated from the ask alone so the first product output lands fast; repo grounding enters at Step 5.7 and reaches discovery via the persisted `additional_context`.
- `template_id` — **OPTIONAL.** Per Step 2 (server-side template resolution), the agent does NOT pick a template_id. Omit this field unless the user explicitly passed `--template-id` on the CLI; the server resolves the right template from `user.persona` → `workspace.defaultTemplateId` → system default and uses the same resolution chain `create_exploration` will use at Step 6. Passing it explicitly only matters when overriding the default.
- `sources` — **OMIT** (recon hasn't run yet; it happens at Step 5.7 after the frame locks).

LLM call, ~5–10s. Returns 5–6 sub-problems — different framing axes the system should investigate. Track each one as `{ text, version: 1 }` in your working memory.

**If the response includes `kg_context_used` with `implementationCount > 0`:** surface this to the user BEFORE presenting the considerations. It's the visible signal that prior shipped work shaped this draft.

> Prior Ritual work on these files may shape this draft:
>  - **"Anonymous checkout opt-in"** (shipped 2026-04-12) · 1 open deferral
>  - **"Payment-method routing"** (shipped 2026-03-22)
>  - **"Session-data persistence"** (shipped 2026-02-08)
>
> The sub-problems below account for them.

(Drop the per-exploration decision count from this listing — recommendations + ship status are the user-facing signals, not decision counts. Keep `· N open deferral{s}` when `deferrals > 0` since open deferrals are scope-warning notes the user cares about. If `deferrals === 0`, just show `(shipped {date})` with no trailing segment.)

If `implementationCount === 0`: don't mention the KG check (silent — would just be noise on a cold KG).

**No pause, and no separate render — auto-accept all generated sub-problems** as `considerations[]` and proceed to Step 5. **Do NOT render the sub-problems on their own here.** A sub-problems-only screen has no decision on it; scope is only meaningfully reviewable once the assembled problem frame sits beside it. So the sub-problems are presented **together with the frame as one Scope gate at Step 5** (§5.1). Store the set (each as `{ text, version: 1 }`) for that combined render. (No `[USER PAUSE]` here — sub-problems are not their own gate. If you surfaced the prior-work KG note above, render it just before the Step 5 Scope gate, not as its own turn.)

**Rationale for auto-accept:** sub-problem selection is a SCOPE-LOCKING decision, and per the SKILL's own rule "`all` is a legitimate declarative choice — often the right one when the agent has surfaced a tight 3-5 sub-problem set." Asking the user to pick before they've seen the problem frame is theater — the problem statement is the assembled artifact where scope is meaningfully visible, and the refine_problem_statement loop at Step 5 accepts arbitrary change prompts ("drop the observability angle", "make this contract-first") that round-trip through the same sub-problem refinement under the hood. Surfacing the sub-problems as info preserves visibility; dropping the pause preserves FTUE flow.

##### 4.2 Sub-problem refinement (only when user explicitly asks)

The user may, at the Step 5 problem-statement gate, say something like "rethink the sub-problems" or "the framing is off — show me other angles." When that happens, call `mcp__ritual__refine_considerations` and re-render the sub-problem set + a fresh problem statement. In the default flow this path is unreachable; it exists for the explicit "rethink scope" escape hatch.

**Pre-flight (mandatory):** before calling `refine_considerations`, run the change pre-flight in `references/change-preflight.md` — restate the change in the user's terms, show the exact `change_prompt` you're about to send, and wait for `yes`. This is a hard pause (even in auto-mode) and fires on every such request, including one-word ones. Do not call the tool until the user confirms.

Call `mcp__ritual__refine_considerations` with:
- `workspace_id`, `raw_input`, `sources` — unchanged from the generate call. Critical: pass the SAME `sources` array each iteration so the KG-injected priorContext stays consistent.
- `template_id` — same rule as Step 4: omit unless the user explicitly overrode it. If you passed `template_id` to the original `generate_considerations` call, pass the same value here for symmetry; otherwise leave it off and let server-side resolution stay consistent across iterations.
- `change_prompt`: the user's request verbatim
- `selected`: items from prior versions the user kept (track `{ text, from_version }`, send just `text`)
- `dismissed`: items the user explicitly rejected
- `session_id`: omitted on the first refinement; pass the `session_id` from the previous refine response on subsequent ones to chain context

Track the new items as `{ text, version: N+1 }`. After the refinement, regenerate the problem statement and present it. The user's next pause is again the problem-statement gate.

**Critical**: never re-call `generate_considerations` for a refinement. That endpoint is stateless and re-rolls a fresh seed; you'll lose what the user just told you. The whole point of `refine_*` is the LLM sees the iteration context.

Store the final sub-problems for Step 5 — they go into `considerations[]`.

#### Step 5 — Generate problem frame

<!-- skill-options:no-gate-change: Step 5 adds a render-only rule (do not surface follow_up_questions / an "open questions" preview / fuzzy-meta at the frame gate); the frame's pause + options + Reply line are unchanged. -->

##### 5.1 First draft

Call `mcp__ritual__generate_problem_statement` with:
- `workspace_id`
- `raw_input` (same augmented version from Step 4)
- `considerations` (the picks from Step 4)
- `template_id` — OPTIONAL, same rule as Step 4. Omit unless the user explicitly overrode; server resolution stays consistent across `generate_considerations` → `generate_problem_statement` → `create_exploration`.
- `sources` (the same file-path list passed to generate_considerations — keeps the KG anchor consistent)

Returns a candidate problem statement plus optional follow-up questions and quality scores. For engineering / agentic-coding templates, translate the returned statement into a developer-oriented **problem frame** before showing it. Do not default to "How might we…" unless the selected template is product/design oriented or the user asks for HMW phrasing.

Engineering style:
- `Problem frame: {verb/outcome} while preserving {constraints}.`
- `Build/enable {capability} without {key failure modes}.`
- `Scope: {implementation objective} across {surfaces}.`

Keep RB IDs, recommendation IDs, prior exploration IDs, and source links OUT of the frame — the frame is one clean sentence. Provenance is not shown at this gate (it's persisted on the exploration and surfaced where it's actionable, not re-printed here). If the response includes `kg_context_used` with `implementationCount > 0`, that prior-work signal is surfaced by the Step 4 prior-work note above the Scope gate — do not add it to the frame.

**[USER PAUSE]** Present like this:

```text
Ritual build
✓ Job  ● Scope  ○ Discovery  ○ Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

Scope — {N} sub-problems, framed as one build

1. {Sub-problem title}
   {short explanation, wrapped for terminal width}
2. {Sub-problem title}
   {short explanation}

Problem frame
{developer-oriented problem frame}

Reply `use` to lock this scope and review discovery questions.
Narrow it — `drop 3,5` or `keep 1,2,4`. Reshape the frame — `tighten`, `broaden`, `focus on outbox`. Or `pause`.
```

Rules:
- **Render the combined Scope gate exactly as shown — and nothing else:** the build rail, the numbered sub-problems (from Step 4's `considerations[]`), a one-sentence `Problem frame`, and the Reply line. Nothing more — no "Optimize for" block, no "References" block, no constraints list. The sub-problems carry the scope; the frame is the one-sentence lock-point. The sub-problems and the frame are one gate now — never split them across two turns. The `generate_problem_statement` response may include `follow_up_questions` and quality scores: those are for YOUR internal awareness, never for display. Do NOT add an "Open questions" / "what discovery will resolve" section, do NOT preview or list discovery questions here, and do NOT editorialize about what's "still fuzzy" or "what the next step pins down." Discovery is the next step and owns open questions; the frame is a lock-point, not a discovery preview. Surfacing them here both pre-empts Step 7 and clutters the gate.
- **Number the sub-problems in render order** (1..N) — the numbers are the handles the user references in `drop {N}` / `keep {N}`. Title line gets the number; one-line explanation underneath; blank line between items. No version labels like `(v1)`.
- Do not show the old versioned scope heading.
- Do not show `Engineering problem:` as the heading; use `Problem frame`.
- Do not say `ship it` unless the user used that language first.
- Visible CTA is `use`. Accept `lock`, `l`, `go`, `continue`, or `next` as aliases for backwards-compat — do NOT display them. Per `references/cli-output-contract.md` § Surface-aware continuation prompts, do NOT treat empty input as proceed inside agent chat.
- `lock` is demoted to alias only: "lock" sounded final/irrevocable for a frame that's very much iterable; `use` carries the right tone.

##### 5.1a Narrow the scope — `drop {N}` / `keep {N}` (subset pick)

The numbered sub-problems are selectable at this gate. A **numeric subset pick** is a precise, unambiguous instruction — handle it directly; it does NOT go through the §5.2 change pre-flight (there is nothing fuzzy to restate, unlike an NL edit such as "make it contract-first").

- **`drop {N}`** / **`drop {N,M,…}`** — remove those sub-problems, by their rendered number, from `considerations[]`.
- **`keep {N,M,…}`** — keep only those; drop the rest.
- Guard: never empty the set. If a pick would drop every sub-problem, decline in one line ("Keep at least one sub-problem.") and re-render the gate unchanged.

After filtering `considerations[]` to the kept set, **re-derive the frame so it matches the narrower scope** — call `mcp__ritual__refine_problem_statement` with `considerations` = the kept set, `previous_problem_statement` = the current draft, and `change_prompt` = `"Narrow scope to these sub-problems: {kept titles}."` (This is the one refine call that SKIPS the pre-flight, per above — the pick already states the change precisely.) Then **re-render the combined Scope gate** (§5.1) with the reduced sub-problem list + the re-derived frame, and pause again. The user can narrow again, reshape with an NL edit (§5.2), or `use`.

`drop {by name}` (e.g. `drop dashboard`) stays an **NL reshape**, not a numeric pick — it's fuzzy intent, so it routes through §5.2 (with the pre-flight). Only bare numbers are the direct subset path.

When the user replies `use`, carry the surviving `considerations[]` — whatever subset remains — into Step 5.7 / `create_exploration`. `use` always means "lock the scope exactly as shown."

##### 5.2 Iteration loop

If the user asks for a refinement:

**Pre-flight (mandatory):** before calling `refine_problem_statement`, run the change pre-flight in `references/change-preflight.md` — restate the change in the user's terms, show the exact `change_prompt` you're about to send, and wait for `yes`. This is a hard pause (even in auto-mode) and fires on every refinement request, including a one-word `tighten`/`broaden`. Do not call the tool until the user confirms.

Call `mcp__ritual__refine_problem_statement` with:
- `workspace_id`, `raw_input`, `considerations`, `sources` — unchanged. (Same `sources` as the original generate call — keeps the KG anchor stable.)
- `template_id` — same rule as Step 4 / Step 5.1: omit unless the user explicitly overrode; if you passed it to the original `generate_problem_statement` call, pass the same value here for symmetry.
- `previous_problem_statement`: the FULL TEXT of the current best draft
- `change_prompt`: the user's request verbatim
- `version`: optional telemetry only; do not show version labels to the user
- `session_id`: omitted on the first refinement; chain on subsequent ones

The returned text becomes the new current draft. Show it using the same `Problem frame` format above, still without version labels.

**Critical**: each refinement's `previous_problem_statement` is the LATEST draft, not the original. Otherwise the LLM keeps refining the same starting point and the user can't compose multiple refinements.

When the user locks the frame, store the final text as `problem_statement` for Step 6.

**No pulse here.** The context pulse appears only from the curate-questions step onward (cli-output-contract § Inline pulses) — early on the score is low/noisy and the line clutters the gate. The first pulse is at Step 7.4.

#### Step 5.7 — Context grounding (internal only — runs AFTER the frame locks)

**Never render this section's title, its step number, or the word "recon" to the user.** This step produces ZERO user-visible output — no "running…", no "grounding…", no "reading the codebase…". It happens between the problem-frame gate and the first product output; the user sees nothing until the next gate or an approved status line.

**Skip only if the user explicitly asks ("just generate, don't read the code") OR if you're operating outside a codebase context.**

**When this runs (relocated 2026-06-11, context-at-create):** AFTER the user locks the problem frame at Step 5 and BEFORE `create_exploration` at Step 6 — the natural "creating your exploration…" beat, so the user never waits on repo reads before seeing product output. Sub-problems (Step 4) were deliberately generated from the ask alone; THIS step is where grounding enters: the `codebase_context_packet` you build here is passed to `create_exploration` as `additional_context`, persisted on the exploration, and injected by the server into discovery-question generation (the questions surface the most important tradeoffs the context implies) and the build-brief fallback. The goal is not to show the user what you found; the goal is to ground downstream generation.

**Capability Boundary Check (load-bearing):** If recon detects a mismatch between the user's ask and what THIS repo can actually implement — typically because the feature spans systems (backend service, mobile app, billing provider, email worker, schema migrations) that aren't present in the current checkout — DO NOT invent the missing systems and DO NOT continue as if the repo is complete. Apply the boundary heads-up rule in § 5.7.1 below (one line, no pause) before creating the exploration. Frame the missing half as a normal architecture boundary, not a failure: *"This repo looks like the frontend side of a larger feature,"* not *"I could not find backend dependencies."* The user has not done anything wrong; the agent is asking how to scope the work.

Common boundary mismatches to detect:

- Full-stack feature ask + frontend-only repo (UI present, no API/service code)
- Mobile feature ask + no API client contract or backend
- Billing/payments feature + no payment service / subscription code
- Email/notification feature + no worker / job / email-provider integration
- Auth/session feature + no user mutation / session backend
- Data/analytics feature + no schema, migration, or storage layer

##### 5.7.0 — Check for a pre-build context seed

Before doing fresh recon, check whether the user already seeded one via `/ritual context-pulse`. Glob for `CONTEXT-*.md` at the repo root.

If a `CONTEXT-<slug>.md` is found AND its `## The ask` section close-matches the current `raw_input`:

- **Use it to seed `codebase_context_packet`.** Parse the file's `## Candidate files` list — those become the seed for `sources[]`. Parse `## Prior KG context` as evidence inside the packet, not as final prioritization.
- **Skip fresh recon** unless the seed is stale or obviously incomplete. If you skip fresh recon, still normalize the seed into the packet structure below before calling MCP tools.
- **Surface a compact note**:
  > Code recon
  > Found `CONTEXT-<slug>.md` from `/ritual context-pulse`.
  > Using {N} candidate files + {M} related prior exploration{s} as the recon base. Override with `recon: refresh`.
- Proceed directly to 5.7.2.

If no seed file is found, OR the seed's `## The ask` doesn't match the current `raw_input`, do fresh recon. For mismatch, mention the ignored seed in one line and do not delete it.

##### 5.7.1 — Fresh recon

1. **Read the README + top-level project structure.** Use `ls` / Glob to see top-level files. Identify the language, framework, key directories, and likely entry points.

2. **Glob for relevance.** Derive patterns from the user's problem. Examples:
   - User says "auth flow" → `**/auth/**`, `**/login*`, `**/user*`, `**/session*`
   - User says "checkout" → `**/checkout/**`, `**/cart/**`, `**/order/**`, `**/payment*`
   - User says "notifications" → `**/notif*`, `**/email/**`, `**/sms/**`, `**/push/**`
   Cap at ~15 hits per pattern.

3. **Skim 3–5 most-relevant files.** For each, read the first ~100 lines + scan for class/function names. Triangulate whether the behavior lives there or calls into another area.

4. **Build three recon artifacts.**

   A. `raw_recon_notes` — internal evidence only
   - files read and why they were selected
   - symbols/classes/functions inspected
   - relevant comments, schema details, tests, migrations, and config
   - KG hits, prior deferrals, and prior implementation references
   - uncertain observations, false leads, and things not found
   - do **not** show this by default and do **not** pass it as the main MCP planning input

   B. `codebase_context_packet` — downstream planning input
   - this is the synthesized artifact passed into `raw_input`, context pulses, and any MCP field named `recon_context`
   - it helps MCP understand what the coding agent observed locally without deciding the final considerations itself
   - separate factual observations from agent hypotheses
   - include confidence levels for hypotheses
   - use neutral labels like `agent_observed_scope_pressure` or `candidate_scope_pressure`, not `priority_considerations`
   - never present the packet as authoritative; MCP/tooling decides final sub-problems, recommendations, and scope

   C. `recon_digest` — **internal-only by default; NOT surfaced to the user.** Recon
      is silent plumbing at the lock→create boundary: we do NOT dump repo signals /
      constraints / a recon summary back to the user. Keep a compact digest in
      working memory for your own use (and to render ONLY if the user explicitly
      asks "what did you find?"), but by default show nothing — the only render is
      the one-line boundary heads-up (§ 5.7.1) on a hard capability mismatch. The
      `codebase_context_packet` feeds `create_exploration.additional_context`
      silently.
   - keep it tight if ever shown: key surfaces, hard constraints, scope corrections
   - never list every file read; never quote non-load-bearing comments

   `codebase_context_packet` structure:

   ```markdown
   --- Codebase context packet ---

   ## User intent
   {verbatim or lightly normalized ask}

   ## Observed relevant surfaces
   - `path` — observed role in this feature or constraint
   - `path` — observed extension point, lifecycle, model, or integration seam

   ## Evidence
   - `path:symbol` — factual observation from code
   - Prior Ritual signal: {exploration / PR / RB / deferral}, if available
   - Missing or not-found evidence when it corrects the user's framing

   ## Agent hypotheses
   - This may make {candidate area} important because {evidence-backed reason}
     Confidence: low / medium / high

   ## Agent-observed scope pressure
   - Privacy / lifecycle / migration / compatibility / async / ownership / testing risk
   - Only include pressure that intersects with the feature intent and code evidence

   ## Scope corrections
   - The ask says X, but the code suggests Y
   - Missing fields, renamed concepts, or assumptions the code contradicts

   ## Open questions for discovery
   - Questions the code cannot answer and the user/Ritual exploration should resolve
   ```

   Example `codebase_context_packet` excerpt:

   ```markdown
   ## Observed relevant surfaces
   - `apps/conversions/abstract_models.py` — append-only conversion event model; lifecycle changes are modeled as follow-up rows.
   - `apps/conversions/outbox.py` — async publish/retry surface; payload shape may affect erasure semantics.
   - `apps/order/models.py` — raw guest email appears to live on the order side, not in conversion events.

   ## Agent hypotheses
   - Erasure semantics may need to cover both mutable raw PII and append-only pseudonymous digests.
     Confidence: high; supported by model fields and schema comments.
   - Outbox purge/replay behavior may be a scope pressure because retries can outlive the original conversion write.
     Confidence: medium; verify worker idempotency before scoping implementation.

   ## Scope corrections
   - No `guest_session_id` column was found in the inspected conversion models; scope may need to use the actual guest attribution identifiers.
   ```

   Example `recon_digest` — single-path case (low ambiguity):

   ```text
   Code recon

   Repo signals:
   - `apps/conversions/abstract_models.py` — append-only conversion events.
   - `apps/conversions/outbox.py` — async publish/retry lifecycle.
   - `apps/order/models.py` — raw guest email surface.

   Constraint:
   - Erasure likely needs to handle mutable raw PII separately from pseudonymous conversion digests.

   Scope correction:
   - I did not find `guest_session_id` in the inspected models.

   Next: attach PRDs/tickets if they should shape scope, or `proceed` to continue.
   ```

   **No explore-directions picker here (removed 2026-06-11).** The problem frame is already
   locked — direction ambiguity was resolved by the user's own framing at Step 5. If recon
   contradicts the locked frame outright, use the boundary heads-up rule below; never re-open
   a picker.

   Capability Boundary Check (feature spans systems not in this repo) — **internal/packet-only; NOT displayed:**

   When the user's ask requires capabilities that aren't present in this repo (frontend-only repo asked for full-stack feature, mobile repo with no API contract, etc.), capture the boundary + the inferred default scope **into the `codebase_context_packet`**, then surface exactly ONE heads-up line (no pause — see below). The persisted packet drives discovery-question generation to probe the boundary; the locked frame stays as-is unless the user reacts. NEVER continue as if the repo can implement the missing half; NEVER invent the missing systems. The block below is a **reference for what to capture in the packet**, not something to print.

   ```text
   Code recon

   Action needed

     This feature likely spans another repo or service.
     Add the backend/API context, or choose a narrower scope.

   Repo boundary:
   - This repo contains the checkout UI and guest checkout flow.
   - I found no backend account-creation endpoint, user/order linking
     mutation, email job, or migration layer.
   - So the full "join while booking" feature likely spans this repo plus
     an API/backend service.

   Can build here:
   - Checkout/thank-you page UI
   - Password capture or account-claim form
   - API client integration point
   - Mocked frontend tests
   - Empty/error/success states

   Needs outside context:
   - Endpoint that creates or claims the account
   - Contract for linking a guest order to a user
   - Auth/session behavior after claim
   - Email/verification behavior, if required

   Scoping inferred: contract-first (default for unsettled API)

     This repo can build: UI integration, API client surface, mocked tests
     This repo cannot build: account-creation endpoint, order-linking, email job
     Considerations will be scoped to what this repo can ship.

   Pulse: Reasoning Readiness ~30% · Context Debt 70% (repo boundary unresolved)

   (lift bridge) The plan isn't grounded in your code yet — scoping to what this
   repo can actually ship is what the next step settles.

   ```

   With the frame already locked, the user-facing output of a boundary hit is ONE line, no pause:

   > Heads-up: this repo covers {the in-repo half} — I've scoped the exploration's context
   > accordingly. Say `re-frame` to widen the scope, or just continue.

   Notes on the boundary-check shape:
   - **No pause.** One heads-up line, then continue to Step 6. The boundary information is preserved in the `codebase_context_packet` (persisted as `additional_context`), where discovery-question generation reads it; the user can say `re-frame` to reopen the frame, and discovery itself will probe the boundary.
   - **"Scoping inferred:" not "How should I scope this?"** — the agent makes the default narrowing (contract-first when API unsettled; repo-side-only when the missing half is clearly out-of-tree) and names what it picked. The user corrects at Step 5 if it was wrong.
   - **"This repo can build:" + "This repo cannot build:"** are paired one-liners — they document the IN/OUT split so the inferred scoping is auditable. Keep them compact (one line each); the full lists live in `codebase_context_packet`.
   - **Default narrowing logic:** if the user's ask names a backend/API endpoint, choose **contract-first**. If the user's ask is clearly UI/UX-shaped or the missing systems are obviously out-of-tree (mobile app, separate billing service), choose **repo-side only**. If ambiguous, default to **contract-first** — it preserves more of the user's intent in the downstream artifacts than narrowing to repo-side does.
   - **The pulse line stays parenthetical** with a user-facing reason (`repo boundary unresolved`), per the Pulse tier labels rule in `references/cli-output-contract.md`.
   - **Internal classification (not user-facing):** track each candidate piece against the boundary as `in_repo_buildable`, `external_dependency_known`, `external_dependency_unknown`, `needs_additional_repo`, or `contract_first_candidate`. These shape how downstream scoring + build-brief generation handle the missing half. Stamp the inferred default scope as `inferred_scope` in the packet so discovery generation and the build brief see it. None of these labels should appear in user-facing copy.

##### 5.7.2 — Recon is silent

**Recon runs silently.** Do NOT surface the recon digest, repo signals, constraints, or the `codebase_context_packet` to the user by default — recon is plumbing at the lock→create boundary. The packet feeds `create_exploration.additional_context` (Step 6); the user sees nothing here.

**There is no explore-directions picker (removed 2026-06-11)** — the frame the user just locked IS the direction. For a crisp single-direction repo read: render nothing and go straight to Step 6.

**Capability boundary detection does NOT pause.** When recon shows the feature spans systems not in this repo, fold the boundary + the inferred default scope into the `codebase_context_packet` (see § 5.7.1 internal classification), pick the default per the "Default narrowing logic" rule, surface the ONE-line heads-up from § 5.7.1, and proceed to Step 6.

If the user explicitly asks "what did you find?", you may show a tight digest then — otherwise stay silent.

**No pulse here** (pre-curate — see cli-output-contract § Inline pulses; the first pulse is at Step 7.4).

##### 5.7.3 — Collect the `sources` array

Collect the file paths you actually read and consider load-bearing for this problem — exactly as they appear in the repo (e.g. `"apps/checkout/views.py"`, not `"./apps/checkout/views.py"` or absolute paths). This list is passed to `create_exploration` (Step 6) — persisted on the exploration so the answer engine, context pulses, and `generate_build_brief` anchor priorContext consistently without you re-passing it.

Keep the list focused. 5–10 is the sweet spot; >20 dilutes the KG signal.


#### Step 6 — Create the exploration

Generate a short name (≤60 chars) from the scope — typically the noun phrase, not the full HMW. E.g. "Reduce T2 customer churn in Q3" → name `T2 churn reduction (Q3)`.

Read the codebase silently (Step 5.7) first, then create the exploration — the job was already confirmed at the Step 0.7 Job gate, so do not add a *further* confirmation here. If a name is ambiguous, **choose the shortest clear noun phrase and continue without pausing** — the name is editable later and shouldn't become a decision gate. Do NOT rely on "proceed on Enter" or empty input in agent chat (see `references/cli-output-contract.md` § Surface-aware continuation prompts).

User-visible before the call, if needed:

```text
Creating exploration: **T2 churn reduction (Q3)**
```

Call `mcp__ritual__create_exploration` with:
- `workspace_id`
- `name`
- `problem_statement` (the scope from Step 5)
- `template_id` — **OPTIONAL.** Per Step 2, omit by default. The server resolves from `explicit dto.templateId → workspace.defaultTemplateId → user.persona → first SYSTEM template`, then forks the resolved template into a per-exploration Template row atomically inside this same `create_exploration` request. Pass `template_id` ONLY when the user explicitly overrides on the CLI (`/ritual build --template-id <id>`). If you passed `template_id` to Step 4's `generate_considerations`, pass the same value here so the LLM prompt context the considerations were generated under matches the exploration's stamped template. Do NOT read `.ritual/config.json` or invent a `template_id` from persona — the server does the resolution.
- `agentic: false` — **do NOT** pass `agentic: true`. We want explicit per-step control so the user gets to pick discovery questions in Step 7. Auto-agentic skips that.
- `additional_context` — the full `codebase_context_packet` from Step 5.7 (omit only if recon was skipped). Persisted on the exploration; the server injects it into discovery-question generation as evidence (the questions cover the important tradeoffs it implies) and uses it as the build-brief recon fallback — so it survives `/ritual resume`.
- `sources` — the file-path list from Step 5.7.3.
- `jtbd` — **REQUIRED for `/ritual build`.** The slug the user CONFIRMED at the **Step 0.7 Job gate** (e.g. `'build-backend-service'`, `'refactor-code'`). Tags the exploration's job-to-be-done so the workflow surfaces the build-brief → code-plan → implement → PR deliverable phase across every surface (the Spark panel, etc.), not the generic produce-deliverable flow. Omit only if this is a non-build exploration (defaults to `produce-deliverable`).
- `lead_persona` — **OMIT (2026-06-11, JTBD-first entry).** Persona is no longer a user pick: the server resolves the job's canonical lead and owns balanced persona REPRESENTATION across the job's full persona set (lead + contributors, weighted) in generation. Do not call `work_item` to pick a lens and do not pass this field.

Store `exploration_id`. Move the progress header from Scope to Discovery:

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Exploration created.

Next: generate discovery questions to resolve the implementation trade-offs.
```

##### 6.1 — Promote the pre-build seed (if one was consumed in Step 5.7.0)

If Step 3.0 consumed a `CONTEXT-<slug>.md` seed file, promote it into the exploration's artifact trail now that an exploration id exists. Move + rename the file from `CONTEXT-<slug>.md` to `.ritual/exploration-notes/<exploration-id>.md` using the Bash tool:

```bash
mkdir -p .ritual/exploration-notes
git mv CONTEXT-<slug>.md .ritual/exploration-notes/<exploration-id>.md 2>/dev/null \
  || mv CONTEXT-<slug>.md .ritual/exploration-notes/<exploration-id>.md
```

Surface to the user as a one-line note:

> Promoted `CONTEXT-<slug>.md` → `.ritual/exploration-notes/<exploration-id>.md` so it stays tied to this exploration.

This keeps the repo root clean (CLI Tenet #1 — files for reference, not clutter) and preserves the seed's content for future `/ritual lineage` or audit lookups. The file remains git-tracked at the new path.

If `git mv` fails (file wasn't tracked yet): use plain `mv` instead — same outcome, the user just commits the move whenever they next commit.

##### 6.2 — Register staged knowledge sources (load-bearing)

If Step 3.5 staged any knowledge sources in working memory (PRDs / tickets / transcripts / etc.), register them NOW that `exploration_id` exists. The staging step deliberately deferred the MCP call because `add_knowledge_source` requires an exploration to attach to — this is where the deferral resolves.

For each staged record from § 3.5.3, call `mcp__ritual__add_knowledge_source` with:

- `exploration_id` (from Step 6)
- `source_content_type` (from the staged record)
- `content` (the full text the agent obtained)
- `title` (from the staged record)
- `source_url` / `source_path` (whichever applies, optional)
- `origin_feature: 'DISCOVERY'`

Fire these in parallel — they're independent inserts + async extraction kickoffs. Cap concurrency at 5 if the user staged more than that (rare).

Surface a single compact summary after all registrations resolve:

> Attached {N} knowledge source{s} to the exploration: {comma-separated titles, truncated to 80 chars total}. Extraction running in the background.

**Failure handling:** if any `add_knowledge_source` call fails (network / 4xx / 5xx), retry once. On a second failure, surface a one-line note and continue — do NOT block the build flow on a knowledge-source registration failure:

> ⚠ Couldn't register `{title}` ({error in 1 sentence}). The exploration is still usable; you can re-add the ref later with `/ritual context-pulse <exploration> --add-ref {path}`.

**Skip path:** if Step 3.5 was skipped (user said "skip" / "none" / "later"), there are no staged records and this step is a silent no-op. Do NOT prompt the user again — they already declined at Step 3.5.

**Why this lives at 6.2, not inside `create_exploration`:** sources are deliberately decoupled from the exploration row so a partial source-registration failure doesn't block exploration creation. Step 6 must always succeed if the underlying validation passes; Step 6.2 is best-effort on top.

<!-- lite:skip-start reason="unpicked-consideration preservation is not part of lite" -->
#### Step 6.5 — Preserve unpicked considerations without cluttering the workspace

Unpicked or dismissed considerations are useful signal, but automatically creating sibling explorations can clutter the workspace. Do **not** fork sibling explorations by default.

Default behavior:

1. If `dismissed[]` or unpicked considerations are empty, skip silently.
2. If there are unpicked considerations, preserve them in working memory as `phase_later_candidates[]` for the current build.
3. Append the concise set to the build brief's `recon_context` payload under a heading like `Explicit phase/later candidates from discovery` so they can appear in **Phase Candidates / Deferrable Items** if relevant. Keep the base of `recon_context` as the `codebase_context_packet`, not raw notes.
4. Surface at most one compact line:

   > Saved {N} unpicked sub-problem{s} as later candidates for the brief.

Only call `mcp__ritual__fork_sibling_explorations` when the user explicitly asks to save separate tracks, or when an unpicked item maps cleanly to a known open deferral / existing exploration and the user confirms.

If sibling creation is confirmed, call:

```
{
  primary_exploration_id: <id from Step 6>,
  unpicked_considerations: dismissed.map(d => d.text)
}
```

Then summarize the created siblings in the dense-list format. Do not pause after creation; return to the primary build flow.

<!-- lite:skip-end -->
#### Step 7 — Discovery questions

Longest phase because generation is async + the user picks per-Area. (Internally the API field is `matter_id`; user-facing copy always says Area.)

**Step 6 → Step 7 transition anti-pattern (load-bearing):** after `create_exploration` succeeds in Step 6, you MUST NOT jump to Step 8's answering/run — discovery questions must be generated, picked, and committed first. Required next actions, in order, before Step 8 is allowed:

1. Call `mcp__ritual__suggest_discovery_questions(exploration_id)` (Step 7.1) — no user input needed; just kick it off.
2. Poll `mcp__ritual__get_discovery_state(exploration_id)` until `ready: true` (Step 7.2).
3. Render the **Area rail + Area 1's questions together** and walk Area-by-Area per § 7.3.1 (the rail orients; a rail with NO questions under it — a bare index — is the failure mode).
4. `[USER PAUSE]` — the suggested-12 landing (§ 7.3.1): the user replies `proceed` (commit the 12), `expert` (walk + adjust; floor 6 to run, aim 15–20, no cap), or `pause`.
5. Commit all picked Areas in ONE `mcp__ritual__accept_discovery_questions_batch` call (Step 7.4) — never one parallel call per Area.
6. Optionally capture anti-goals (Step 7.5), then proceed to Step 8 — but only **after the Step 7.4 `accept_discovery_questions_batch` response returns** (you need its `materialized[]` question ids to run against). For engineering/delivery/operations, then **auto-fire the run** (answer the picked questions + `submit_all_answers`, or the server fallback) — no `run` CTA, no pause. For product/design/PRD flows, render the `1`/`2` run-mode choice (stop-after-answers review vs run-through). Never start answering/running before the accept resolves.

**Picking is a deliberate step-through, not a bulk action (load-bearing):** the user going Area by Area and choosing the questions that matter IS the value of discovery — that per-question judgment shapes the whole downstream chain. So **nudge the user to step through and pick**; don't lead with bulk shortcuts.
- **Nudge to step through.** Walk the user Area-by-Area (drop into Area 1, `next`/`prev`) and invite deliberate picks per Area, with `show more` to expand an Area. The framing is "which of these should we dig into?", not "want all of them?".
- **Floor (HARD): at least 6 questions** across any Areas — below this, do NOT commit or proceed (tell them how many more to pick and keep them in the picker). There is NO "skip discovery" path — the agentic run needs a real question set to develop answers against. **Good coverage (SOFT): 15–20 questions** — nudge toward it on the Summary, but never block once ≥6. **No upper cap** — picking many (or all) is a legitimate explicit choice, never a default or fallback. (Uncovered scope is handled downstream when recommendations + requirements are generated and audited, so a thin set is the failure mode to prevent.)
- **The default is the suggested 12, never "all."** `proceed` commits exactly that suggested set (not every generated question). An ambiguous reply (`proceed`, `go`, `ok`) at this gate means **accept the suggested 12** — never silently accept everything. (The landing summarizes rather than lists them; `expert` is the path to read/adjust the set before committing.)
- **Taking all IS allowed — but only as an explicit user choice, never the default or a fallback.** If the user genuinely says "take all" / "all of them", honor it and commit them; that's a legitimate choice, not an error. Just never *offer* "I'll take all" as the default, and never auto-fall-back to it. (Worth mentioning once, not as a gate: every accepted question is answered individually in the agentic run, so accepting all of them across every Area means many more questions to answer and a much longer run — but it's the user's call.)

**Forbidden behaviors:**

- Calling `start_agentic_run` before at least 6 discovery picks have been committed for this exploration (via `accept_discovery_questions_batch`, or `accept_discovery_questions`). There is no skip-discovery exception.
- Silently auto-picking all generated questions and proceeding to Step 8 — observed in agent output 2026-05-15 as "the engineering-mode default is to run, which skips the per-question picker." There is no such default; the picker is mandatory.
- **Offering "or I'll default to taking all of them" (or any accept-all fallback), then committing the full set on an ambiguous reply** — observed 2026-06-05 (a `proceed` at this gate → `accept_discovery_questions_batch` with all 68 questions → a ~25-min run the user never chose). Accept-all is a legitimate choice **only when the user explicitly asks for it** — it is NEVER the default you offer, and NEVER the fallback. The default you offer + fall back to is always **the suggested 12 rendered on the landing**. An ambiguous reply (`proceed`/`go`/`ok`) at the pick gate means **accept those 12**, not the full set — structurally safe because the 12 are on screen in full.
- Starting Step 8 — auto-firing the answers (engineering) or rendering the product/design run-mode choice — anywhere in the chat before Step 7.4 has committed the picks.

The picker is **not** a UI suggestion — it's the load-bearing decision gate where the user expresses what to investigate. Skipping it converts the agentic run into an automated "answer everything" pass and erases the user's judgment.

##### 7.1 — Kick off

Call `mcp__ritual__suggest_discovery_questions(exploration_id)`. Returns immediately with `task_id`. Tell the user with the full rail (we just entered the Discovery phase):

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

Generating discovery questions…
```

##### 7.2 — Poll until ready

Loop:
- Call `mcp__ritual__get_discovery_state(exploration_id)`
- If `ready: false`, wait 10 seconds, poll again
- If `ready: true`, exit loop

Don't poll faster than every 10 seconds (matches the Spark UI's 10s discovery cadence). Follow the global polling rule above: single `Bash sleep 10` per iteration and a one-line update every ~2 polls (~20s). Polling heartbeats are exempt from the Build rail rule per `references/cli-output-contract.md` § Build progress anchor — does NOT apply to.

##### 7.3 — Question picking: the suggested-12 landing (default) + the expert walk (on request)

The state contains `matters[]`, each with `id`, `name`, and `questions[]`. Internally these are `matter`s; user-facing copy ALWAYS calls them **Areas**.

**Landing-first (2026-06-12).** The default render is NOT the Area walk — it is the **suggested-12 landing**: Ritual's 12 suggested questions across all Areas, listed IN FULL (never truncated), grouped by Area, pre-selected. One word (`proceed`) commits them; `expert` opens the Area-by-Area walk with the 12 already selected (toggle to adjust). The walk MIRRORS the Spark `/discover` picker (Area rail + current Area's questions + Summary before commit) and remains the place to push toward the 15–20 good-coverage range — it's just opt-in now instead of mandatory.

The two failure modes this contract prevents:
- **A bare Area index** — the rail (or a "pick an Area" menu) with **no questions under it**. The rail without its current Area's questions is exactly the removed model; always render the questions inline. (This is the failure d3 caught on 2026-06-07: the agent rendered the Area list alone.)
- **A full dump** — every Area's questions in one message. Only the **current** Area's questions render per turn.

**Turn boundaries (load-bearing — this is a multi-turn walk, not a one-shot render).** Render the rail + **exactly ONE Area's questions per turn**. After rendering, **STOP and end your turn** — wait for the user's reply (`numbers` / `next` / `prev` / `skip` / `done`). Each of `next` / `prev` / `done` produces the **next render in a NEW turn**, never appended to the current message. You already hold every Area's questions from `get_discovery_state` — that is NOT license to render the whole walk or multiple Areas' questions in a single message. The rail lists Area *names + counts* (cheap orientation); only the current Area's *questions* render. One Area → STOP → reply → next Area. The Summary (§ 7.3.3) is likewise its own turn.

###### 7.3.0 — Compute the suggested 12 + per-Area recommendations (internal, not user-facing)

Three things are computed up front, **none auto-committed**:
- **(a) The suggested 12** — 12 questions TOTAL across all Areas, the landing's content. Selection rubric (a rule, not vibes): start from the server's ranked/recommended flags; guarantee at least one question from every Area that contains a genuinely hard question; fill the rest by leverage, biased toward questions that probe **tradeoffs, constraints, and the scope-pressure/boundary items** the exploration's additional context surfaced. If fewer than 12 questions clear the bar, suggest fewer (floor 6) — never pad to hit the number.
- **(b) The Area rail** (expert mode) — every Area's name + its running picked count, shown above the current Area's questions.
- **(c) The per-Area ★ recommended set** (3–4 questions, expert mode) — computed for the Area currently showing.

The user always confirms; nothing is committed without their reply.

**Per-Area recommended set** (the ★ set, for the Area currently shown):

- Pick the top 3–4 questions per Area most likely to shape the recommendations, based on the problem statement, locked sub-problems from Step 4, and the codebase context read at Step 3. Bias toward questions whose absence would force later stages to invent consequential facts.
- Area has **< 4 questions**: all are recommended.
- Area has **4–7 questions**: top 3 are recommended.
- Area has **8+ questions**: top 4 are recommended.

**Legacy token:** `accept shortlist` (the old 6–10 power path) is retired as a displayed option — the suggested 12 IS the landing now. If a user types it anywhere, treat it as the landing's `proceed` (commit the suggested 12) and note in one line that the landing already covers it.

###### 7.3.1 — First render: the suggested-12 landing (the default)

Render the **compact landing**: one summary line (counts + that the 12 most impactful were identified) and the action bar. Do NOT list the questions here — the full set is inspected on demand via `expert` (the Area walk). Keeping this terse is deliberate; the earlier "render all 12 in full" landing was too verbose. Full phase rail on this message (we just entered Discovery).

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

We've generated {M} discovery questions across {N} areas and identified the 12 most impactful questions.

Reply `proceed` to generate answers and recommendations for these questions, `expert` to inspect and adjust the question set, or `pause`.
```

Branch on reply:
- **`proceed`** (or an ambiguous `ok`/`go`): commit exactly the suggested 12 via § 7.4's single batch call (grouped per Area), then continue to § 7.5 → Step 8. Ambiguous replies (`ok`/`go`) map here. The questions aren't listed at this landing by design — a user who wants to read or change them before committing uses `expert`.
- **`expert`**: enter the Area walk below with the suggested 12 **pre-selected** (`picked so far: 12`, ✓ on each suggested row). Numbers TOGGLE in expert mode — typing a selected question's number unselects it.
- **`pause`**: stop here; nothing committed.

###### 7.3.1b — Expert mode: the Area walk (entered via `expert`)

Open ON Area 1 with the **rail above and Area 1's questions below it** — never the rail alone. The rail lists every Area (current one marked, picked count per Area); the questions are Area 1's ★ recommended set, with ✓ already on rows that are in the suggested 12. Subsequent Area messages use the in-phase chip. The 15–20 soft nudge lives here: the user arrives with 12 — the walk is where they push toward broader coverage (floor 6 HARD if they unselect).

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Question picking · Area 1 of {N} · {Area name}          picked so far: 12

Areas   ● {Area name 1}   ○ {Area name 2}   ○ {Area name 3}   ○ {Area name 4}   ○ {Area name 5}
        ● current · ✓N after a name = picked in that Area · move with `next` / `prev`

Expert mode — the suggested 12 are pre-selected (✓). Numbers toggle;
aim for 15–20 total (6 minimum to run, no cap).

Showing the {k} most likely to change the plan ({total} in this Area):

  1. {recommended question 1, wrapped readably}
  2. {recommended question 2, wrapped readably}
  3. {recommended question 3, wrapped readably}

pick   numbers (e.g. `1,3`)  ·  `suggested` (these ★)  ·  `add <your question>`  ·  `show more` ({total−k} more)
walk   `next`  ·  `prev`  ·  `skip`  ·  `done` (≥6)
```

**Single numbering stream — number the QUESTIONS only; the rail Areas are NOT numbered.** The 2026-05-15 failure numbered Areas AND question previews in one view, so a reply of `5` was ambiguous. Here the rail uses `●`/`○` markers + names (no numbers) and you move it with `next`/`prev` — the only numbered list is the current Area's questions, so a bare number is never ambiguous. Wrap long question text readably. The `picked so far` count, the rail markers/`✓N` counts, and the `Area i of N` breadcrumb all update on every render of the walk.

**Vocabulary split:** the landing's `proceed` commits the suggested 12 (questions); Step 9's `proceed` continues recommendation review. Inside expert mode, the ★ marks the per-Area recommended set and `suggested` picks it; `accept shortlist`/`accept recommended` are legacy aliases for the landing's `proceed`.

###### 7.3.2 — Within an Area (pick → auto-advance)

**Picking IS progress (2026-06-12).** A pick reply (`numbers` or `suggested`) ADVANCES to the next Area — never re-render the same Area and wait for `next` (that costs two replies per Area and stalls the walk; observed live: users picked, then were shown the same Area again). `prev` is the way back if they want to adjust; `next` still exists for moving WITHOUT picking.

**Every render in this section keeps the `Areas …` rail line on top** (current Area marked, `✓N` counts updated) — it's omitted from the snippets below only for brevity. Never re-render an Area's questions without the rail above them.

- **`numbers`** (e.g. `1,3` or `1,2,5`): TOGGLE those questions — unselected ones join the picked set, already-✓ ones (including pre-selected suggested-12 rows) leave it. Then **ADVANCE: render the NEXT Area** (rail + its questions), opening with a one-line ack of the Area just left — `{Area name}: {n} picked ✓` — and the updated `picked so far`. On the LAST Area, a pick advances to the Summary (§ 7.3.3). Do NOT re-render the same Area after a pick; `prev` returns if the user wants to adjust.
- **`suggested`**: pick this Area's recommended (★) set in one go — then advance exactly like `numbers`.
- **`show more`**: reveal the rest, grouped Recommended / More (lazy per-Area expansion — never a global dump):

```text
Question picking · {Area name}                          picked so far: {T}

Recommended:
  1. {recommended question 1}      ✓
  2. {recommended question 2}
  3. {recommended question 3}

More questions:
  4. {non-recommended question 1}
  5. {non-recommended question 2}
  ...

Reply numbers (e.g. `1,4`), `next`, `prev`, or `skip`.
```

- **`next` / `prev`**: move to the next / previous Area (picks preserved). At the last Area, `next` goes to the Summary (§ 7.3.3).
- **`skip`**: leave this Area with no picks, advance to `next`.
- **`done`**: jump straight to the Summary (allowed from any Area).
- **`pause`**: stop here — state is saved, nothing committed.
- **`show all`**: accepted as a reply (expands every Area's questions into one long list) but NOT advertised on the CTA line — per-Area `show more` is the default, not a global wall.
- **`add <your question>`** (e.g. `add How should we handle partial refunds?`): add a USER-AUTHORED question to THIS Area. **Pre-flight format-validate it locally first:** it must read as a single, clear question (non-empty, interrogative or ends with `?`, ≤ ~200 chars). If it's malformed (a statement, a fragment, multiple questions, too long), say what's off and ask them to rephrase — do NOT hold a malformed one. When valid, **hold it locally** for this Area and re-render the Area (rail + questions) with it shown as `＋ (your)  {text}` beneath the questions, `picked so far` incremented. It counts toward the floor/target like any pick. It is NOT written to the server yet — every custom question is persisted in ONE batch at `commit` (§ 7.4).

###### 7.3.3 — Summary (after the last Area, or on `done`) — the review-before-commit gate

Render all picks grouped by Area. This MIRRORS Spark's Summary tab and is the gate where the user confirms before the run. Use `✓` picked / `—` none / `□` untouched. NEVER strikethrough (renders inconsistently across terminals).

```text
Question picking · Summary                              {T} picked

  ✓ 1. {Area name 1}        {n} picked
        – {picked question}
        – {picked question}
  — 2. {Area name 2}        none picked
  ✓ 3. {Area name 3}        {n} picked
        – {picked question}
  ...

{if T < 15}   A good set is usually 15–20 — you've picked {T}. Reply an Area
              number to add more, `more` to suggest new Areas, or `commit`
              (run discovery → recommendations).
{if T ≥ 15}   Reply `commit` to run discovery on these {T} questions
              (answers → recommendations, ~a few minutes), an Area number
              to adjust, `more` for new Areas, or `pause` to stop.
```

**The minimum model — floor 6 HARD, good 15–20 SOFT, no cap:**

- **`commit` with T < 6** → REFUSE (hard floor). *"Pick at least 6 to run discovery — you have {T}, choose {6−T} more,"* then return to the Summary (or the Area they were on). No skip path; do NOT call `accept_discovery_questions_batch` or `start_agentic_run`.
- **`commit` with 6 ≤ T < 15** → allowed. Proceed to § 7.4 after the one-line "good is 15–20" nudge — do NOT re-nag or block.
- **`commit` with T ≥ 15** → proceed to § 7.4.
- **An Area number** at the Summary → re-open that Area's questions (picks preserved), then return here.

**Held custom questions + pending new Areas render in the Summary** so the user reviews everything before `commit`: a held custom question shows under its Area as `＋ (your) {text}`; a pending agent-suggested new Area shows at the bottom as `＋ (new) {name}  {n} questions`. They count toward `{T}`. All are persisted at `commit` (§ 7.4).

- **`more`** at the Summary → the user wants broader coverage. **Suggest 2–3 NEW candidate Areas inline yourself** — each a short name + 3–4 questions — authored from the problem statement, the locked scope, and the Areas already shown, chosen to fill **gaps** the current Areas miss. Label the candidates with **LETTERS (`A`, `B`, `C`) — not numbers** — to avoid colliding with the question-number stream, and ask which to add (`letters`, e.g. `A` or `A,C`, or `none`). Picked candidates become **pending new Areas held locally** (persisted at `commit`). Do NOT call a server "generate-more" endpoint — you have the context, so propose directly (it's faster). **Never auto-add — the user picks.**

###### 7.3.4 — Power paths (available from any Area or the Summary)

- **`accept shortlist`** (legacy alias): treat as the landing's `proceed` — commit the suggested 12 via ONE `accept_discovery_questions_batch` call (§ 7.4, one entry per Area) and continue to Step 7.5. The walk is how a user reaches the 15–20 good-coverage range; the suggested 12 is the quick high-signal set.
- **`show all`**: accepted as a reply but NOT advertised on the CTA line. Expands every Area's questions into one long list. Use only when the user explicitly asks — the per-Area `show more` is the default.
- **`done`**: jump to the Summary from any Area to review + `commit`.
- **Below the floor** (fewer than 6 picked on `commit`): do NOT proceed. Reply with how many more are needed and return to the Summary — e.g. *"Pick at least 6 to run discovery — you've picked 3, choose 3 more."* There is no skip path. (6–14 is allowed with the soft nudge; ≥15 is the good-coverage target — see § 7.3.3.)

###### 7.3.5 — What NOT to say

- DO NOT add machinery copy like *"The answer engine will then investigate them by reading the codebase and surface clarifying questions for you to review."* The user only needs to know that picking them triggers investigation.
- DO NOT use `Press Enter` anywhere in this picker (see § Surface-aware continuation prompts).
- DO NOT say `lock` for the picking confirmation; use `done` (to the Summary) then `commit`.
- DO NOT number Areas and questions in the same view — one numbering stream (the current Area's questions). The breadcrumb `Area i of N` carries position; it is not a pickable number.

###### Legacy alias notes

- `suggest` (legacy per-Area shortcut) is now spelled **`suggested`** — picks the current Area's recommended (★) set. If a user types `suggest` inside an Area, treat it the same.
- `accept recommended` (legacy global shortcut): treat as the landing's `proceed` (commit the suggested 12) with a one-line note. (At Step 9 the recommendation-review CTA is `proceed` for continuing review.)
- `all` (legacy fourth option) remains removed (see § Removed below).

###### Removed: `all` (the old fourth option)

The legacy `all` shortcut was removed because in practice it produced low-signal selections — picking everything is indistinguishable from not discriminating, which makes Reasoning Readiness scoring less meaningful at the boundary and pushes recommendation generation against a noisy answer set. Users who really did mean "everything" can still type the full number list (e.g. `1,2,3,4,5`) — but that requires conscious intent rather than a one-keystroke default. If you see a SKILL or external reference still mentioning `all`, it's stale.

##### 7.4 — Commit picks (ONE batch call across all Areas)

**load-bearing — forbidden behavior:** do NOT fan out one
`accept_discovery_questions` call per Area in parallel. Each per-Area call
does several DB round-trips; firing them concurrently exhausts the server's
connection pool and returns 503s on the later Areas (observed in prod). The
batch endpoint exists precisely to avoid this — use it.

Call `mcp__ritual__accept_discovery_questions_batch` **once** with every
Area's picks in a single atomic request:
- `state_id` (from the discovery state)
- `picks[]` — one entry per Area the user picked in, each `{ matter_id, question_ids[] }`

```ts
// ONE call. All Areas, one atomic transaction, one successor state.
await accept_discovery_questions_batch(state_id, [
  { matter_id: areaA.matter_id, question_ids: areaA.question_ids },
  { matter_id: areaB.matter_id, question_ids: areaB.question_ids },
  // …one entry per Area with at least one pick
]);
```

Use the single-Area `accept_discovery_questions` ONLY when the user picked in
exactly one Area. If for some reason you must use it across several Areas
(e.g. the batch tool is unavailable), call it **sequentially** (`await` each
in turn) — never in parallel.

User-facing: emit the ONE approved status line for the whole save, not one per Area (verbatim — it's in the rule #8 allowlist):

```text
Saving selected questions…
```

The batch call is all-or-nothing — validation fails the whole request if any
pick is malformed, so there's no partial-success state to reconcile. Areas the
user chose not to pick from are simply left unpicked.

**If there are NO held custom questions or pending new Areas, proceed to anti-goals.**

###### 7.4.1 — Persist held custom questions + new Areas (only if any were held)

Custom questions (`add`, § 7.3.2) and pending new Areas (`more`, § 7.3.3) were held
LOCALLY during the walk because `add_discovery_question` needs a **workspace** matter id,
which only exists after the batch above materialized the picked Areas. Persist them now,
AFTER the batch call:

1. **Resolve workspace matter ids.** Call `mcp__ritual__get_exploration(exploration_id)` and
   map each Area **name** → its workspace `matters[i].id`. (The batch only materialized Areas
   the user picked AI questions in.)
2. **For each Area that has held custom questions:**
   - if a workspace matter for that name exists → use its id;
   - if not (a custom-only Area, or a pending new Area) → `mcp__ritual__create_discovery_matter(exploration_id, name)` first, use the returned id.
   - then call `mcp__ritual__add_discovery_question(exploration_id, matter_id, text)` for each held question — **SEQUENTIALLY** (`await` each), never in parallel (same connection-pool caution as the batch).
3. **For each pending new Area** (from `more`): `create_discovery_matter(...)` then `add_discovery_question(...)` per its questions, sequentially.

One status line for the whole persist step (not one per question):

```text
Adding your {M} question(s) across {K} Area(s)…
```

Only after all holds are persisted, proceed to anti-goals. The floor (≥6) counts
custom + AI questions together — never `start_agentic_run` before the held questions are
written.

##### 7.5 — Optional: capture out-of-scope items

If the user mentioned things they DON'T want investigated ("don't touch enterprise SSO", "skip pricing"), capture them as anti-goals.

**Pre-flight (mandatory):** before calling `set_anti_goals`, run the change pre-flight in `references/change-preflight.md` — restate the out-of-scope items you heard and show the exact anti-goal `text` array you're about to send, then wait for `yes`. A misread anti-goal poisons rec-gen and the R4 audit downstream, so this hard pause (even in auto-mode) applies even when the user's phrasing seemed clear. Do not call the tool until the user confirms.

Call `mcp__ritual__set_anti_goals(exploration_id, [{ text, reason? }, ...])`.

If no anti-goals were mentioned, skip this with NO user-visible output. (No mention = nothing to confirm; the pre-flight only runs when the user actually states out-of-scope items.)

**Pulse (Step 7.4 done — and again after 7.5 if anti-goals were set):** Emit a pulse — decision resolution and (if 7.5 ran) assumption safety just moved. Compact format unless this crosses Under-specified → Exploration-safe.

#### Step 8 — Run discovery through recommendations

The pipeline runs answers → recommendations. **Choose the answerer by whether you
actually have the code to ground answers in — this is NOT decided by the fact
it's `/ritual build`.**

- **You're genuinely repo-linked** — Step 5.7 recon ran and you read real files
  (you have a `sources` list / codebase context packet, and filesystem access to
  the repo): **YOU answer the picked questions** yourself. You're closest to the
  code, so the answers are grounded in what you actually read.
- **You're not** — recon was skipped (Step 5.7.6), no repo is open, or the ask
  isn't a codebase task: use the **server agentic run** (`start_agentic_run`),
  which sources answers from the knowledge graph + registered sources instead.

Pick the path honestly; don't claim to answer from code you didn't read.

<!-- skill-options:no-gate-change: Step 8 answerer is chosen by real repo-linkage (recon ran / code open), not by the /ritual build invocation; agent-answers when repo-linked, server-run fallback. Includes prose guidance on answer length (~300-600 words), that attached code is OPTIONAL illustrative reference (not part of the answer, not a verbatim copy), and a hard no-secrets/no-PII redaction rule for the BYO answerer. As of 2026-06-21 the engineering/delivery/operations run gate is REMOVED (auto-proceed after the §7.4 commit) — the options-contract drops that gate; no new pause gate or Step header is added. -->

For `engineering`, `delivery`, and `operations` roles there is **no run confirmation**: the user already chose "generate answers and recommendations" when they proceeded from the discovery pick gate (§ 7.3.1), so a second "ready to run?" prompt is redundant friction. **Auto-proceed with no `run`/`pause` CTA and no wait for a reply.**

<!-- skill-options:no-gate-change: prose only — adds a strict accept-returns-before-run ordering precondition to Step 8 (and the §7-transition rule); no decision gate, offered option, or Step header is added, removed, or changed. -->
**Strict ordering (load-bearing — do NOT skip, reorder, or parallelize):** the run begins **only after the Step 7.4 `accept_discovery_questions_batch` call has RETURNED its response**. That accept is what commits the picks and returns `materialized[]` (the committed question rows + their `id`s); you answer those exact ids. Do NOT call `write_answer_context`, `submit_all_answers`, or `start_agentic_run` before the accept resolves, and never fire them in parallel with it — there is no committed question set to run against until the accept returns. Removing the old `run` gate removed a human turn, NOT this dependency: await the accept, read `materialized[]`, then run. Once you have the accept response, print one non-blocking status line so the hand-off isn't silent, then begin:

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Answering your picked questions, then generating recommendations.
This usually takes a few minutes — I'll keep working; nothing needed from you.
```

(Match the line to the path you'll actually take: repo-linked → "Answering your picked questions from the codebase…"; fallback → "Ritual is sourcing answers for the picked questions…". Don't claim to answer from code if you're taking the server path.)

**If you're genuinely repo-linked (per the check above), answer the questions yourself** (BYO-answerer; do NOT call `start_agentic_run`):
1. The Step 7.4 accept (`accept_discovery_questions_batch`) returned `materialized[]` — the committed questions with their row `id`s. (If you didn't keep them, the same ids are what you passed to accept.)
2. For each saved question, call `mcp__ritual__write_answer_context(question_id, content)` with an answer grounded in your reading of the codebase — the files you read at Step 5.7, the actual code, real constraints. Answer in PARALLEL where your agent supports it (e.g. one subagent per Area). The content is provisional + provenance-tagged agentic until saved; only the final saved set drives recommendations.
   - **Length:** keep each answer to **~300–600 words by default** — tight and grounded, not an essay. Go longer only when the question genuinely needs it.
   - **Code:** the answer itself is **prose** — keep it that way. Code is **optional reference, not part of the answer**: attach a snippet only when it would help a future reader or agent reason about your answer (a key type, contract, or call site worth pointing back to), never to complete the answer. When you do, `content` is **markdown** — add it as a **fenced code block with a language tag** (e.g. ` ```ts `) with the `file/path` and the minimal illustrative lines, never a whole-file paste. Spark lifts these fences out of the prose into a collapsed "View details" reference beside the answer, and markdown keeps them portable to the `.ritual/` projection.
   - **Never leak secrets or sensitive data.** A snippet is **illustrative, not a verbatim copy** — it only has to convey the shape/idea, so simplify and elide freely. **NEVER** include API keys, tokens, passwords, connection strings, credentials, `.env` values, real customer data, or PII — even if they're literally in the file you read. Replace them with obvious placeholders (`process.env.X`, `"<api-key>"`, `"user@example.com"`). The same goes for the prose: describe constraints without pasting secret values.
3. When every committed question has answer context, call `mcp__ritual__submit_all_answers(exploration_id)` — it commits the set and triggers recommendation generation. Then go to the recommendation wait (Step 8.1, agent-answered path).

**Fallback — server answers (no repo / nothing to ground in):** only after the Step 7.4 accept has returned (the run needs the committed question set it produced), call `mcp__ritual__start_agentic_run` with `scope_type: 'exploration'` + `exploration_id`, then follow the server polling path (8.0 → 8.1).

For `product`, `design`, or explicitly PRD-style flows where answer review is useful, offer two choices without time estimates (this path uses the SERVER answer engine so the user can review each generated answer — Step 8.5):

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Run discovery

How do you want to run discovery?

  1. Stop after answers — review and refine the generated answers
     before recommendations.
  2. Run through recommendations — fastest path to a recommendation set.

Reply `1` or `2`. Reply `pause` to stop here.
```

If they pick 1, call `start_agentic_run` with `stop_after: 'answers'` and continue to Step 8.5 when it pauses. If they pick 2, call without `stop_after` and continue to Step 9 when complete.

##### 8.0 — "You're unblocked" pre-roll (once server-side work is running)

This pre-roll is for the **rec-generation wait** — fire it once server-side work is running: on the agent-answered path, right after `submit_all_answers` returns (recommendation generation is now queued); on the server fallback, right after `start_agentic_run` returns the run_id. (On the agent-answered path the *answering itself* is your active work — don't show the pre-roll until you've submitted.)

**Lock the product promise BEFORE you enter the polling loop.** Recommendation generation continues server-side; the user is free to step away. The polling loop becomes the agent's job, not the user's obligation.

Tier the pre-roll by projected duration. Latency baseline: ~15s/question (V5.2 + KG injection, calibrate quarterly against `recs-pipeline.ts` eval results). Multiply the picked-question count by 15s, divide by 60 to get minutes.

**Projected ≤ 2 min** — skip the pre-roll entirely. The polling micro-copy below covers the framing.

**Projected 2–20 min** — warm framing:

```text
Deep reasoning run started — this may take ~{minutes} minutes.

You're unblocked: the run continues server-side while you do other work.
Grab coffee, switch tasks, or close the terminal safely.

For live progress, open a NEW terminal and run:
  ritual status --watch          # terminal command, not a slash-command

Or check inside this session:
  /ritual status                 # SKILL subcommand (in-chat)

Come back later:
  /ritual resume
```

**Projected 20+ min** — longer framing:

```text
Long reasoning run started — this one may take 20+ minutes.

You can safely step away; the run continues server-side even if this terminal
closes. For live progress:

  ritual status --watch          # in a separate terminal (not /ritual status)

Or check inside this session:
  /ritual status                 # SKILL subcommand for in-chat status

To come back later:
  /ritual resume
```

**Two surfaces, two contexts:**

- `ritual status [--watch]` — **terminal command** (CLI 0.7.14+). Run from a separate shell. Survives this session closing; supports `--watch` for live tail.
- `/ritual status` — **SKILL subcommand** inside Claude Code / Cursor / your agent. Read-only mirror; useful when the user wants a quick check without context-switching to a terminal. Defined in `references/status-flow.md`.

Pick whichever fits the user's flow — they're equivalent in content. Do not introduce a `reply watch` mode in this SKILL; the CLI command IS the live-tail affordance.

##### 8.1 — Polling loop

<!-- skill-options:no-gate-change: adds a convergence note at the top of the rec-wait — both answerers (local coding agent vs Ritual server) poll get_recommendations_preview until ≥1 rec; the only difference is who produced the answers. No new pause gate or Step header; the run/pause gate + its options are unchanged. -->

<!-- skill-options:no-gate-change: Step 8.1 rec-wait polls get_exploration_status.recommendationsStatus (not_started|generating|ready|empty|failed); on `failed` it offers retry_recommendations (re-enqueues rec-gen only). Render-only signal + an offered action, no pause/option/Step-header change. -->
**Both answerers converge here — once the run is underway, poll until recommendations are READY.** The job from this point on is the SAME regardless of who produced the answers. **Poll the authoritative signal: `mcp__ritual__get_exploration_status(exploration_id).recommendationsStatus`.** It removes the guesswork that bit us before — it is unambiguous:
- `not_started` / `generating` → **keep polling.** A zero `recommendationCount` here is NORMAL — generation is enqueued/in flight, NEVER a "miss." (Older servers may omit the field; if `recommendationsStatus` is absent, fall back to polling `get_recommendations_preview` until ≥1.)
- `ready` → recommendations exist. Fetch them (`get_recommendations_preview`) and continue to Step 9.
- `empty` → generation FINISHED with genuinely zero recs (rare, real terminal state). Surface it plainly — do NOT render a fake Step 9 landing, do NOT re-run.
- `failed` → generation exhausted its auto-retries (terminal). Surface it with the one-line `recommendationsError` if present, and **offer to retry** — on a `yes`, call `mcp__ritual__retry_recommendations(exploration_id)` (re-enqueues ONLY rec-gen on the existing answers; status returns to `generating`, resume polling). Do NOT call `start_agentic_run` (that re-answers the whole exploration) and do NOT auto-retry without asking.

The *only* difference between the two answerer paths — **local coding agent** (you, repo-linked) vs **Ritual's server agentic run** — is how you reach this wait (agent-answered → straight to the status poll; server → poll the run to `COMPLETED` first, then the status). Never render the Step 9 landing, and never call `accept_recommendations`, from anything but `ready`.

**Agent-answered path (default):** you already wrote + `submit_all_answers`'d, so there's no agentic run to poll — go straight to the recommendation wait: poll `mcp__ritual__get_exploration_status(exploration_id).recommendationsStatus` (`Bash sleep 20` per iteration, a "still generating recommendations…" line every ~3 polls) until it reads `ready`, then fetch + continue to Step 9. `generating` → keep polling; `empty` → genuine zero-rec terminal; NEVER render the Step 9 landing or call `accept_recommendations` from anything but `ready`; if 10+ min pass still `generating`, surface it as an anomaly. (Skip the `get_agentic_run` polling below — that's the server-fallback path.)

**Server fallback path** (you called `start_agentic_run`): poll `mcp__ritual__get_agentic_run(run_id)` using `references/async-polling.md`: **`Bash sleep 20` (constant 20 — matches Spark's 20s agentic cadence; never escalate)** per iteration, then a fresh status call. Even if the run takes 2+ minutes, the sleep value stays a constant 20; the harness blocks chained-shorter-sleeps-at-increasing-N just like it blocks `sleep ≥ 30`, but a fixed `20` is non-escalating and under 30 → guard-safe. Agentic runs CAN exceed 5 min for large explorations — if you see status still running past ~5 min of polling, switch to the `Monitor` + `until <check>; do sleep 2; done` pattern from `references/async-polling.md` § Long waits.

**On the FIRST poll only** (not every poll), prepend one line that locks the "background execution is default" mental model:

> I'll keep working in the background. For a live tail, run `ritual status --watch` in a separate terminal — or type `/ritual status` here for an in-chat snapshot.

Then print progress only when `progress_pct` or `current_step` changes, or every ~3 polls if unchanged:

> Agentic run: {progress_pct}% — {current_step}

When `status` is `COMPLETED`: **wait for `recommendationsStatus: ready` before Step 9.** The run reporting
`completed` does NOT mean recommendations exist yet — rec generation is a separate queued job that
lands MINUTES later (the 2026-06-05 premature-accept incident class; observed again live 2026-06-12
and 2026-06-15). Poll `mcp__ritual__get_exploration_status(exploration_id).recommendationsStatus` on
the standard cadence (`Bash sleep 20` per iteration, "still generating recommendations…" line every
~3 polls): `generating` → keep polling; `ready` → continue to Step 9; `empty` → genuine zero-rec
terminal, surface it. NEVER render the Step 9 landing — and never call `accept_recommendations` —
from anything but `ready`. If 10+ minutes pass still `generating`, surface that as an anomaly
instead of proceeding.

<!-- skill-options:no-gate-change: Step 8.1 adds a load-bearing clause closing the "zero-rec = generation miss → re-run / reroute" loophole; tightens the existing wait-for-rows rule only — no pause, option, or Step header added or changed. -->
**A zero-rec read is NEVER a "generation miss," and re-running is NOT a recovery (load-bearing).** The run reporting `completed` only means *answering* finished — recommendation synthesis is a SEPARATE async job that may still be in flight, so zero rows means **not yet**, never **failed**. Do NOT relabel it a "generation miss" / "the synthesizer came back empty" / "0 recommendations" and act on that: do NOT call `start_agentic_run` again to "regenerate" (the answers are already committed — a re-run re-answers the whole exploration from scratch, burns a full pipeline, and can double-generate), and do NOT propose "routing around" synthesis by building a plan from the raw discovery answers. Just keep polling `get_exploration_status.recommendationsStatus` until `ready` (or `empty` — the rare genuine terminal). The synthesizer is almost never the problem — being early in the async window (`generating`) is. The ONLY escalation, and only after the 10-min ceiling still `generating`, is to surface it as an anomaly and offer `/ritual status` or the web app — never an automatic re-run, never a reroute.
When `status` is `COMPLETED_WITH_ERRORS`: tell the user, then apply the same wait-for-rows rule — partial recommendations may still be useful.
When `status` is `FAILED`: surface the error message, ask if they want to retry (`start_agentic_run` again with same exploration_id) or stop.
When `status` is `PAUSED_FOR_REVIEW` (product/design answer-review mode only): continue to Step 8.5.

If user wants to abort mid-flight: `mcp__ritual__cancel_agentic_run(run_id)`.

#### Step 8.5 — Run Agentic Exploration (product/design answer-review mode only)

When the pipeline pauses at `PAUSED_FOR_REVIEW`, the exploration is at step `REVIEWING_ANSWERS`. Every Area's questions have v1 answers + at least one clarifying question per consideration, but nothing has been committed for recommendation generation yet.

**The agent walks the user through each question one at a time as part of the running agentic exploration.** Render the full rail at the **landing** (the first answer-review message), then use the in-phase chip on subsequent per-question views.

**On naming:** this step is **Run Agentic Exploration** in user-facing copy and section headings — NOT "Per-answer iteration" (the old internal label). The phase the user is in is "the agentic exploration is running and pausing for your input on each answer before recommendations generate." That's what the heading should say.

Landing (first question, full rail + intro):

```text
Ritual build
✓ Job  ✓ Scope  ● Discovery  ○ Recommendations  ○ Build brief  ○ Implementation (Your agent)

Run Agentic Exploration

Ritual drafted answers for {totalQuestions} questions across {N} Areas.
For each question, you can submit the v1 answer or iterate with a
follow-up. When all questions are submitted, Ritual generates
recommendations.

────────────────────────────────────────────────────────────────────

Discovery — question 1 of {total}: {Area name}

Q: {question.text}

v1 answer:
{currentDraft, first 400 chars …}

My follow-up: {first consideration's latest assistant message}

Reply `submit` to lock in v1, or reply with text to iterate.
Reply `pause` to stop here.
```

Each subsequent per-question view uses the in-phase chip only (no full rail):

```text
Discovery — question 2 of {total}: {Area name}

Q: {question.text}

v1 answer:
{...}

My follow-up: {...}

Reply `submit` or reply with text to iterate.
```

For each question's loop:

1. **Fetch the state.** Call `mcp__ritual__get_answer_state({ question_id })`. Returns:
   - The question text
   - The current draft answer (v1)
   - The considerations (sub-aspects) with their chat sessions
   - The latest assistant message per consideration — this is the **first clarifying question** the answer engine already generated during Phase 3

2. **Present using the landing-or-chip shape above.** Two choices, that's it (no "skip"):

   - **submit** — happy with v1; lock it in and move to the next question
   - **iterate** (any free-text reply) — answers the follow-up OR explains what's wrong with v1; the answer engine regenerates

3. **Branch on user's choice:**

   - **If "submit":** call `mcp__ritual__submit_answer({ question_id })`. The question advances to COMPLETED. Move to the next question's Step 8.5 loop iteration.

   - **If "iterate" (any free-text reply):** call `mcp__ritual__iterate_answer({ consideration_id, message: user_text })`. The answer engine:
       - Persists the user message in the consideration's chat
       - Generates a new AI response (which is either the next clarifying question OR a recognition that the answer is now complete)
       - The new response is **automatically KG-aware** as of PR 5: the answer engine reads the exploration's persisted `sources` and pulls in relevant prior decisions + open deferrals when forming the next question

     **Loop back to step 2 with the updated state.** Fetch fresh state via `get_answer_state` (the considerations array now reflects the new chat message + AI response), show v_N+1, prompt again. Cap at ~5 iterations per consideration before suggesting "let's submit and move on" — keeps cost bounded.

4. **When ALL questions are submitted:** call `mcp__ritual__resume_agentic_run({ run_id })`. Pipeline runs Phase 4 (submit all answers — the per-question submits above already advanced individual questions, but submit_all_answers is the canonical batch checkpoint) + Phase 5 (recommendations). Poll as in Step 8. When `status` becomes `COMPLETED`, continue to Step 9.

**Skip-the-iteration escape hatch:** the user can say "just resume" at any point. Call `resume_agentic_run` immediately. Recs generate from whatever state the answers are in (whether v1 or partially iterated). Equivalent to having picked Mode A from the start, just with the option to iterate later via the web UI.

**Abandon:** `cancel_agentic_run(run_id)`. The exploration stays at `REVIEWING_ANSWERS` — the user can come back later and either resume or start fresh.


**Pulse (Step 8 done):** Emit a pulse — decision resolution moved significantly (answers complete, draft recommendations now exist). Render full if this crosses Under-specified → Exploration-safe, else compact.

<!-- lite:keep-start -->

#### Step 9 — Review recommendations (compact landing → proceed or expert)

This is the most-read screen in the build flow, and — as of 2026-06-08 — a **non-blocking review**. Recommendations are **auto-accepted at generation** (created `approved`); the artifacts that depend on them (requirements, the deliverable doc, and — for developer-function jobs — the build brief) are **already being generated** the moment rec-gen completes. Step 9 is the user's chance to **read and refine** the set, not an accept-or-reject gate. Replying `proceed` records that a human reviewed it (stamps `reviewedAt` / `reviewedBy`) and continues to the build brief — it never blocks, and there is **no reject path here**.

**Landing-first (2026-06-12; compact 2026-06-22) — the same shape as the suggested-12 discovery landing:** the default render is ONE compact screen — `We've generated {N} recommendations across {K} categories`, then ONE numbered line per category listing that category's recommendation **titles only**, comma-joined. The user scans the shape of the set and replies `proceed` immediately. Depth is opt-in via **`expert`**, which re-renders the full detail (every rec's description + `R{N}` ids) where `drill R{N}` / `edit R{N}` become available. The goal is the shortest honest path to the {Deliverable}: scan the compact set, optionally go `expert` to read/refine, proceed. (Mirrors the discovery gate's `proceed`/`expert` split exactly — the compact landing summarizes, `expert` is the path to read or change before committing.)

**Data source.** Use `mcp__ritual__get_recommendations(exploration_id)` (the raw array) — the walk shows full per-rec content, so you need the fields a titles-only preview omits:

- top-level: `id`, `title`, `content` (the description / summary), `status`, `priority`, `points`, `confidence`
- `categoryName` — **the load-bearing grouping key** (one rec → one category; `get_recommendations` exposes it top-level so you never reach into raw metadata for it)
- `metadata.explainability` — `rationale` (chained `→` arrow string), `faq_references[]`, `problem_alignment`, `inferred_elements`
- `metadata.acceptance_criteria[]` — concrete pass conditions (optional to surface; see § 9.1)

Assign stable `R1..RN` IDs **globally across all categories** in page order (NOT restarting per-category), and remember the `R{N}` → `id` map so you can resolve `edit R{N}` to the rec UUID for the MCP calls.

**Vocabulary — load-bearing:**

- Recommendations are grouped by **category** (the `categoryName` field). They are **NEVER** grouped by `matter` or by `Area` — those are discovery-phase concepts. `matter_id` must never appear in user-facing copy. Anti-pattern observed in agent output: *"44 recs grouped by matter"* — the right framing is *"44 recs across K categories."*
- Do NOT use "Reasoning chain" / "reasoning_chain" in user-facing copy. The user-visible label is **"Why this"** — a short Problem / Discovery / Tradeoff distillation derived from the `rationale` field, NOT the literal `→` arrow chain (that's the model's internal scratchpad shape).

**Action set — load-bearing.** The compact landing offers exactly **two**:

- `proceed` — mark the set reviewed and generate the {Deliverable} (the job's deliverable — render its rail name, e.g. `Service Build Brief`). Available everywhere. (§ 9.3)
- `expert` — re-render every recommendation in full (description + `R{N}` ids), where you can read, `drill`, or `edit` before proceeding. (§ 9.1a)

Inside `expert` (and only there) two more become available:

- `drill R{N}` — open ONE recommendation in full: complete description, "Why this", pass criteria. (§ 9.1b)
- `edit R{N} <your change>` — refine one recommendation: regenerate its title / description / reasoning from a plain-language ask, **preview** the change, then **apply** it. (§ 9.2)

**Do NOT freelance other actions.** There is **no `drop` / reject** (recs are auto-accepted and the review is non-blocking — a rec the user dislikes is refined with `edit` in `expert`, or simply left as-is), **no `comment`**, and **no `next`** (there is no pagination — `expert` already shows everything). Reject invented compounds too (`dedupe`, `accept the survivors`, `merge similar`, `open the admin UI` — all forbidden). If the rec set itself looks wrong (e.g. apparent duplicates), surface the anomaly explicitly and consult `mcp__ritual__get_recommendation_attestation` (`duplicateTitlePrefixes`) — don't paper over it with an invented action.

##### 9.1 — The compact landing: titles only, one line per category

**Zero-rec guard (load-bearing):** if `get_recommendations` returns an empty array, do NOT render this landing and do NOT call `accept_recommendations` — you arrived before rec generation finished. Go back to the Step 8 wait-for-rows polling. A "0 recommendations across 0 categories" render is always a bug, never a state to present.

**[USER PAUSE]** Render the COMPACT landing: a one-line lead (`We've generated {N} recommendations across {K} categories`) then ONE numbered line per category — the category name, then its recommendation **titles only**, comma-joined. NO descriptions here (that's `expert`). This is a scan surface: titles carry the signal; `expert` carries the depth. Never omit a category or a rec ("… N more" is forbidden — the compact line lists every title in that category); never add a description line here (that's the wall-of-text failure mode this landing exists to prevent).

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ● Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

Scope:
{one-line compressed scope — ~80-120 chars; truncate at a clause boundary, no ellipsis}

We've generated {N} recommendations across {K} categories.

1. {Category name 1}: {title}, {title}, {title}
2. {Category name 2}: {title}, {title}
3. {Category name 3}: {title}, {title}, {title}, {title}

Pulse: Reasoning Readiness 88% · Context Debt 12% ↓16% (answering discovery dropped it 16%)

Reply `proceed` to generate the {Deliverable}, or `expert` to review and refine each recommendation.
```

Notes:

- **Titles only, comma-joined per category line.** No `R{N}` ids and no descriptions on the compact landing — those appear in `expert`. The category numbering (`1.`, `2.`, …) orients the eye; it is NOT an addressable id (you don't act on a category).
- **Every category, every title.** The compact line for a category lists ALL of its rec titles — never truncate the list with "…".
- **`proceed` is the primary CTA** — the user never has to enter `expert` to continue.

##### 9.1a — `expert`: every recommendation in full

On `expert`, re-render the SAME set with full detail — every recommendation grouped by category, each with its global `R{N}` id, title, and ONE truncated description line — then wait. This is the fuller view of the same Step 9 gate (the compact landing §9.1 holds the gate's pause); `expert` is not a new decision point, so the proceed-or-refine decision is unchanged — only the level of detail differs.

```text
Recommendations · expert

{Category name 1}
  R1  {title} — {description truncated ~90 chars at a word boundary…}
  R2  {title} — {truncated description…}

{Category name 2}
  R3  {title} — {truncated description…}

{…every category, every rec, one line each…}

Reply `drill R{N}`, `edit R{N} <change>`, or `proceed` to generate the {Deliverable}.
```

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ● Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

Scope:
{one-line compressed scope — ~80-120 chars; truncate at a clause boundary, no ellipsis}

{N} recommendations across {K} categories. Scan the set, drill into any,
or proceed to your {Deliverable}.

{Category name 1}
  R1  {title} — {description truncated ~90 chars at a word boundary…}
  R2  {title} — {truncated description…}

{Category name 2}
  R3  {title} — {truncated description…}
  R4  {title} — {truncated description…}

{…every category, every rec, one line each…}

Pulse: Reasoning Readiness 88% · Context Debt 12% ↓16% (answering discovery dropped it 16%)

A few assumptions are still unverified — the {Deliverable} is what locks them down.
Reply `drill R1`, `edit R1 <change>`, or `proceed` to generate the {Deliverable}.
```

Notes:

- **Global `R{N}` IDs** in page order across categories. The R-ID is how the user references a rec in `drill R{N}` / `edit R{N}`; never restart numbering per category.
- **Title + one truncated description line per rec** — truncate at a word boundary with `…`. No "Why this" at the landing; that lives in the drill view.
- **`proceed` is the primary CTA** — the user never has to drill anything to continue.

##### 9.1b — `drill R{N}`: one recommendation in full

**[USER PAUSE]** Render the single recommendation completely, then wait:

```text
Recommendations · R{N} — {title}

{content — the full description, wrapped at terminal width}

Why this: {one-line Problem→Discovery→Tradeoff distillation, plain prose}
Pass: {acceptance_criteria, one line each — omit the block if empty}

Reply  edit R{N} <your change>   ·   back (all recommendations)   ·   proceed (generate the {Deliverable})
```

`back` re-renders the landing (§ 9.1, unchanged). Drilling is read-only — nothing advances or persists.

##### 9.2 — `edit R{N} <ask>`: preview, then apply

This mirrors Spark's "Revise → Preview Revision → Apply revision" exactly: the change is **previewed before anything persists**.

1. Resolve `R{N}` → rec UUID from the walk's ID map.
2. Call `mcp__ritual__suggest_recommendation_edit({ recommendation_id, instruction: "<the user's ask, verbatim>" })`. This runs an LLM and returns a **transient proposal** — nothing is mutated yet. It carries `id` (the proposal id), `summary` ("what changed"), and `diff[]` of `{ field, before, after }` where `field` is `title`, `description`, or `chain.<idx>`.
3. **[USER PAUSE]** Render the preview and wait:

```text
Recommendations · R{N} — proposed revision

What changed: {proposal.summary}

Title
- {before}
+ {after}

Description
- {before}
+ {after}

Why this — step {i}
- {before}
+ {after}

Reply  apply (save this revision)   ·   discard (keep the original)
```

   - Render ONLY the `diff` fields that are present. Map `field: "title"` → `Title`, `"description"` → `Description`, `"chain.<idx>"` → `Why this — step {idx+1}`.
   - If the proposal's `diff` is empty (the LLM found no meaningful change), say so plainly and return to the category view unchanged — don't fabricate a diff.

4. On `apply`: call `mcp__ritual__apply_recommendation_proposal({ recommendation_id, proposal_id })`. It persists a new version, replays the reasoning chain, and returns the applied proposal. Re-fetch the rec (`get_recommendations`) and **re-render the view the user came from** — the landing (§ 9.1) or the drill view (§ 9.1b) — with R{N} updated in place.
   On `discard`: return to that view unchanged — nothing was persisted.

Editing is non-destructive and does not advance the flow — the user can `edit` several recs before `proceed`.

##### 9.3 — `proceed`

- **`proceed`** (from the landing or any drill view) → call `mcp__ritual__accept_recommendations({ exploration_id })`. Under the non-blocking model this **records the human review** (stamps `reviewedAt` / `reviewedBy`) and advances; it is NOT a draft→approved promotion (the recs are already `approved`). The downstream artifacts were queued at rec-gen time, so this returns fast. Then show the completion rail and continue to Step 9.5:

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ○ {Deliverable}  ○ Implementation (Your agent)

Reviewed {N} recommendations.

Next: generate the {Deliverable}.
```

(The `{Deliverable}` stage stays `○`, not `●` — this screen records the review and names what's next; the stage flips to `●` only when brief generation actually starts. Render `{Deliverable}` as the job's `deliverableTemplate`, e.g. `Frontend Feature Brief`, never the literal "Build brief".)

**Pulse (recommendations reviewed):** emit a pulse — this is almost always a state-tier crossing into **Recommendation-ready**. Render full.

Continue to Step 9.5 (`Wait for requirements`).

<!-- lite:keep-end -->

#### Step 9.5 — Wait for requirements (auto-triggered by Step 9)

`accept_recommendations` fires requirement generation **fire-and-forget** the moment it succeeds. By the time you reach this step, generation is already in flight (or done, for fast LLM calls). The brief in Step 10 needs requirements ready, so wait here.

Steps:

1. **Tell the user once** that requirements are being generated:

   > Generating requirements for the build brief…

2. **Poll `mcp__ritual__get_requirement_set_status(exploration_id)` every ~5s.** The response shape:

   ```
   {
     exists: boolean,
     status: 'GENERATING' | 'READY' | 'FAILED' | null,
     icp, startedAt, completedAt, errorMessage
   }
   ```

   Polling rules in this harness:
   - **`Bash sleep 5` per poll. Always 5. Never escalate to 15/20/25.** The harness blocks chained sleeps, `sleep ≥ 30`, AND successive `sleep N` calls across turns at increasing N. One short sleep per turn dodges all three guards AND keeps the user-facing progress feel live.
   - **Update the user every ~3 polls** with a "still generating…" line so they know you haven't stalled.
   - If polling crosses ~5 minutes, switch to the `Monitor` + `until <check>; do sleep 2; done` pattern from `references/async-polling.md` § Long waits.

3. **Exit conditions:**

   | Response | Action |
   |---|---|
   | `status === 'READY'` | Proceed to Step 10 |
   | `exists === false` (still null) for 3+ polls | The fire-and-forget hasn't reached the DB yet, OR `proceed` (accept_recommendations) hasn't run yet (no LLM call yet). After several polls either keep polling OR proceed to Step 10 — the API auto-triggers generation inline if the set is still missing when the brief is requested (adds ~30s to the brief call but never hard-fails). |
   | `status === 'GENERATING'` | Keep polling |
   | `status === 'FAILED'` | Surface `errorMessage` to the user; offer to retry by calling `generate_build_brief` directly (which will auto-trigger a fresh generation), OR by hitting `POST /requirements?force=true` via the web UI |

4. **Special case — `proceed` not yet called (accept_recommendations hasn't run):** if the user jumped ahead without the rec-review `proceed`, there's no fire-and-forget auto-trigger from that path. Skip the polling entirely and let Step 10's auto-trigger handle requirement generation inline. The brief call will take ~30s longer than it otherwise would. (Note: auto-finalize at rec-gen completion usually already queued requirements, so this case is rare.)

5. When `status === 'READY'`, render the approved status line `Requirements ready.` and continue to Step 9.6 (if anti-goals exist) OR directly to Step 10 (if no anti-goals, the audit step runs with NO user-visible output).

#### Step 9.6 — Audit the recommendations + requirements against declared anti-goals (load-bearing — audit-repair loop)

Run a constraint-survival audit on the typed Recommendation + Requirement substrate BEFORE brief generation. The audit answers the question: *"Did the anti-goal directives the user declared actually constrain the recs+reqs, or are they decorative?"* — the R4 operator (constraint-perturbation) applied to the (anti-goals, recs+reqs, R4) triple per the audit-triple-framing rule.

**Why this is load-bearing**: an inert anti-goal — declared but not actually constraining anything in the recs+reqs — propagates downstream as an unconstrained brief. By Step 11 (implementation) it's too late; the agent codes against a substrate whose forbidden states were never enforced. The audit catches inert directives at the upstream typed substrate where the fix is cheap (rec content edit), not at the brief markdown where the fix is expensive (full regen).

**Skip condition**: if the exploration has zero anti-goals (`set_anti_goals` was never called OR all anti-goals are `confidence < 0.4`) OR no APPROVED recommendations exist OR the latest RequirementSet isn't READY, skip this step with NO user-visible output and continue to Step 10. The audit tool returns 404 in any of those cases; check the substrate state first if unsure.

**Build modes** (per `documents/architecture/audit-suite.md` § 7a) — the gate prompt below renders differently depending on which mode flag the user invoked:

| Mode | Prompt behavior | Default on enter |
|---|---|---|
| bare `/ritual build` | Compact opt-in: "Reply `audit` or `proceed`" | `proceed` |
| `/ritual build --audited` | Elevated: "Recommended: run constraint-survival audit. Reply `audit`, `proceed`, or `always audit for this build`" | Awaits user input (no implicit default) |
| `/ritual build --audit=strict` | Audit auto-runs; user sees results + repair menu, not the gate prompt | N/A (no gate prompt rendered) |

`auditMode` is read from working memory (set at Step 0 from the user's invocation flags). Mid-flow, `always audit for this build` upgrades the session to `--audit=strict` behavior for any remaining audit gates (Audit 2 at Step 10b.5, Audit 3 at Step 11.1 — both PR B/C).

**Strict mode time budget**: each audit chain runs up to 3 iterations of verifier calls (~5-15s per iteration × 3 = ~15-45s typical). Hard wall-clock cap of 90s per chain — on timeout, the gate degrades to `--audited` behavior (surface findings, let user decide rather than block the build).

### Step 9.6.1 — Render the gate prompt (mode-aware)

**For `bare` mode:**

```text
Recommendations + requirements are ready. Optional constraint-survival audit available.

Reply `audit` to run, or `proceed` to skip the audit and generate the {Deliverable}.
```

**For `--audited` mode:**

```text
Recommendations + requirements are ready.

Recommended: run constraint-survival audit before brief generation.
This checks whether anti-goals survived into the recs + requirements.

Reply `audit` to run, `proceed` to skip and generate the {Deliverable}, or `always audit for this build`.
```

**For `--audit=strict` mode:** SKIP the prompt; jump directly to Step 9.6.2 (run the audit).

### Step 9.6.2 — Run the audit (when chosen or in strict mode)

Render:

```text
Auditing recs + requirements against {N} declared anti-goal{s}…
```

Call `mcp__ritual__audit_recommendations({ exploration_id })` with the default config (threshold mode, 80% acceptance threshold, max 3 iterations). The response shape:

```json
{
  "chain_id": "ac-...",
  "audit_status": "ok" | "needs_attention" | "blocked",
  "iteration": 1,
  "findings": [
    {
      "repair_id": "ri-...",
      "after_audit_id": "...",
      "severity": "blocker" | "high" | "medium" | "low",
      "directive_text": "Audit log must be append-only.",
      "status": "inert" | "omitted" | "weakened" | "contradicted",
      "gap_kind": "global_inert" | "local_gap" | "weak_coupling" | "contradiction",
      "affected_entities": [{"entity_type": "recommendation", "entity_id": "..."}],
      "message": "Anti-goal #2 is referenced but not by the entity it most-applies-to — ...",
      "auto_dispatchable": true | false
    }
  ],
  "summary": {
    "total_constraints": 7,
    "survival_rate_percent": 57,
    "by_severity": { "blocker": 1, "high": 0, "medium": 2, "low": 0 },
    "by_gap_kind": { "global_inert": 1, "local_gap": 2, "weak_coupling": 0, "contradiction": 0 }
  },
  "decision_reason": "...",
  "attestation_digest": "sha256:...",
  "next_step_hint": "..."
}
```

### Step 9.6.3 — Render the findings + repair-action menu

Render based on `audit_status`:

**`audit_status: "ok"`** — survival rate met threshold AND no blockers. Render one line and proceed silently to Step 10:

```text
✓ Audit passed: {survival_rate_percent}% of {total_constraints} anti-goals preserved. Chain accepted.
```

**`audit_status: "needs_attention"` or `"blocked"`** — surface the findings inline so the user sees them before deciding:

```text
⚠ Audit — {iteration} of {max_iterations} — {audit_status}

  {survival_rate_percent}% of {total_constraints} anti-goals preserved.
  Findings ({findings.length} total):
    {for each finding, severity-prefixed (⛔ blocker / ⚠ high / · medium / · low):}
    {severity_glyph} {repair_id} — {directive_text}
       status: {status} · gap: {gap_kind} · affects: {affected_entities.length} entit{ies/y}
       {message[:120]}…

Reply:
  · `resolve all`              — apply all auto-dispatchable repairs, re-audit
                                  (recommended — your config has blocker findings
                                   set to always_resolve)
  · `resolve {repair_id}`      — apply a single repair (good for inspection)
  · `waive {repair_id}: <reason>`
                                — record explicit acceptance of one finding;
                                  document the gap and continue
  · `accept`                   — accept current substrate, document all remaining
                                  findings as gaps (BLOCKED while any
                                  blocker-severity finding remains; the chain
                                  config enforces this)
  · `show chain`               — render the full audit chain trail
                                  (calls get_audit_chain)
  · `pause`                    — stop here; resume via /ritual resume
```

**On `resolve all`** — for each `auto_dispatchable: true` finding, call `mcp__ritual__apply_repair({ repair_id, chain_id, after_audit_id })`. Each call returns:

```json
{
  "action_id": "ra-...",
  "action": "apply",
  "status": "applied",
  "next_iteration_id": "...",
  "hint": "Re-audit ran (SurvivalReport ...). Call get_audit_chain with chain_id=... to see the updated trail and whether the chain accepted."
}
```

Apply-repair is sequential per finding; the server runs the next audit iteration inline after each successful apply, so just call them in order. After the last `auto_dispatchable: true` finding, call `mcp__ritual__get_audit_chain({ chain_id })` to fetch the final state and re-render the loop UX with the new survival rate. If `chain_status === 'accepted'` after this round, proceed to Step 10; otherwise re-render the findings (the chain may have iterated and produced new findings the next iteration surfaces).

**On `resolve {repair_id}`** — single-finding apply. Same dispatch shape; render the next iteration's findings on completion.

**On `waive {repair_id}: <reason>`** — `apply_repair({ repair_id, chain_id, after_audit_id, action: 'waive', waive_reason: '<reason>' })`. No re-audit; render confirmation + return to the loop UX.

**On `accept`** — only allowed when no `blocker`-severity findings remain (the L1 tool returns `audit_status: "blocked"` while they do). Surface a single confirm: *"Accepting substrate with {findings.length} documented gap(s). Proceed?"* On yes, proceed to Step 10. The audit chain's final state is recorded; future `/ritual lineage` on this exploration surfaces the chain trail + the gaps the user explicitly accepted.

**On `show chain`** — render the full trail (iterations + repairs + status) from `get_audit_chain`. Keep it compact: one line per iteration + one line per repair. Then re-render the loop UX so the user can pick their next action.

**On `pause`** — stop here. Chain stays `in_progress`; resume via `/ritual resume`.

**On `halt_unresolvable`** (chain reached `max_iterations` with unresolved must-resolve findings) — the L1 tool returns `audit_status: "blocked"` and the chain is terminated. Surface:

```text
⛔ Audit halted after {max_iterations} iterations — {n_blockers} blocker(s) unresolved.

The repair loop didn't converge. Options:
  · `extend max-iterations <N>`  — re-run the audit with a higher cap (creates a new chain)
  · `force accept`               — proceed to Step 10 with the substrate as-is; remaining
                                   blockers are recorded on the chain trail but no longer
                                   gate the build flow
  · `pause`                      — stop here for human review
```

**Special: contradiction-class findings** — when a finding has `gap_kind: "contradiction"`, it surfaces as `auto_dispatchable: false`. The repair (`replace_recommendation`) IS implemented and CAN be applied via `apply_repair {repair_id}`, but `resolve all` skips it because replacing a rec is a structural change worth explicit user consent. The SKILL should render contradiction findings with an explicit "needs review" prefix:

```text
⛔ {repair_id} — CONTRADICTION — {directive_text}
   A rec actively violates this directive. `replace_recommendation` will regenerate the rec
   under the constraint. Confirm by replying `resolve {repair_id}` explicitly.
```

**Verifier-generator separation**: the audit's verifier model is automatically resolved by the server to a different family than whichever model generated the recs — agents don't need to manage this; it's enforced at the API. The audit's attestation digest records both model ids for post-hoc auditability.

#### Step 10 — Generate the build brief

The Build Brief is the markdown document the engineer reads RIGHT BEFORE writing code. It bridges accepted recommendations + synthesized requirements with the implementation. Sections:

- **READ THIS FIRST — These Will Block Review If Missing** (RB-numbered table of must-haves)
- **Goal** (1-2 sentences, restated for code-time clarity)
- **Required Outcomes** (specific, testable)
- **Suggested Implementation** (high-level approach + the trade-offs the agent considered)
- **Codebase Anchors** (file paths + existing patterns to extend, grounded in Step 3's recon)
- **Previously Deferred — Worth Addressing?** (only present when `sources` overlap prior implementations with open deferrals)
- **Phase Candidates / Deferrable Items** (what to intentionally punt for v2)

##### 10a — Call `generate_build_brief`

Call `mcp__ritual__generate_build_brief` with:

- `exploration_id`
- `icp` — **omit this.** The brief sources from the requirement set the flow already generated (on accept), whose ICP the server resolves from the exploration's persona/template. Passing a different ICP here forces a redundant requirement regeneration and a slow cold start. The engineering flavor is already baked into the server-resolved template — you do not need to (and should not) pass `TECH_PM` or any other ICP.
- `recon_context` — the Step 3 `codebase_context_packet` plus any explicit phase/later candidates from discovery. Do not pass raw recon notes. This grounds "Codebase Anchors" in real file paths while keeping agent hypotheses auditable and non-authoritative.
- `sources` — the **same** file-path array passed to `generate_considerations` and `generate_problem_statement` in Steps 4–5. Critical for KG consistency: the brief's "Previously Deferred" section only populates when overlapping prior implementations exist on these files.

Returns **immediately** with `status: 'GENERATING'` (synthesis runs in the background — poll per Step 10b) UNLESS it's a cache hit, which returns `status: 'READY'` with the brief markdown directly. The brief is **idempotent on (exploration, icp)** — same recommendation+requirement hashes return the cached READY row. Pass `force: true` only when a prompt-version update requires re-generation (also returns `GENERATING` → poll).

##### 10b — Status polling (CLI Tenet #8)

`generate_build_brief` is **fire-and-poll**: it returns almost immediately with `status: 'GENERATING'` (the synthesis runs server-side in the background) — NOT the finished brief. A cache hit returns `status: 'READY'` directly; treat that as done. So you no longer wait on a local timeout — you poll the status from the start.

**Don't treat the GENERATING response as the brief, and don't re-call generate to "check".** Poll the status:

1. After `generate_build_brief` returns `GENERATING` (or on the rare local timeout), call `mcp__ritual__get_build_brief_status(exploration_id, icp)`.
2. Poll using the standard async polling rule: one `Bash sleep 5` per poll iteration, then a fresh status call. Print a brief "still generating…" update every ~3 polls when the status is unchanged.
3. Exit conditions:

   | Response | Action |
   |---|---|
   | `exists === false` for 3+ polls | The fire-and-forget never landed — try calling `generate_build_brief` once more (it will likely succeed now that requirements are ready). |
   | `status === 'GENERATING'` | Keep polling. |
   | `status === 'READY'` | Read `content` field — proceed to Step 10c as if generate had completed. |
   | `status === 'FAILED'` | Surface `errorMessage` to the user. Propose a single action (CLI Tenet #2): *"The brief failed: {errorMessage}. Retry with a fresh generation? (y/N)"*. On yes: call `generate_build_brief` again with `force: true`. |

You can ALSO call `get_build_brief_status` **proactively** before `generate_build_brief` — if `exists === true && status === 'READY'` and the hashes haven't changed, you've saved a write-tool roundtrip. Tradeoff: tiny read cost for skipping a maybe-slow write.

##### 10b.5 — Verify brief assertions against the actual code

**This step is mandatory, not opt-in.** The brief generator runs server-side and does NOT have repo access — it writes assertions about cited files / functions / classes based on the agent's earlier recon summary (which is text, not code). Brief assertions that contradict the actual code are invisible to the brief generator AND to the user reading the brief. Step 10b.5 closes that gap before the user is asked to approve the brief at Step 10d.

This step is **SKILL-only — no MCP tool, no LLM cost on Ritual's API.** The verification happens locally in the calling agent because the agent is the one with repo access. The canonical instruction set is at `references/brief-verification-checklist.md` (methodology + output schema + worked example). This Step 10b.5 prose is the thin orchestration layer.

Steps:

1. **Tell the user what's about to happen** (one line, not a multi-line pre-roll):

   > Verifying brief assertions against the actual codebase. Reading cited functions / classes / files, comparing against the brief's claims — about 20–60 seconds.

2. **Read `references/brief-verification-checklist.md`** for the methodology, output schema, and verdict definitions. **Walk the methodology in order — do NOT skip to the output schema.**

3. **Read `BUILD-BRIEF.md`** (the version just generated in Step 10a/10b but NOT YET written to disk — keep it in-memory; you'll write to disk AFTER verification at Step 10c). Extract every specific code citation: symbol + file + assertion. Cap at 15 citations (highest-leverage first).

4. **For each citation, read the actual code** via Grep / Glob / Read. Assign a verdict per citation:
   - `verified` — brief claim matches the code.
   - `contradicted` — brief claim is wrong; the code does something different.
   - `not_found` — symbol couldn't be located.

   **Narrating a finding (if you surface one before the summary): frame it as resolving drift, not as an error report.** Lead with *resolving drift between the brief and the codebase*, then ONE plain sentence describing the drift and where the real pattern lives. Do **not** lead with "X doesn't exist" / "references a function that doesn't exist" — a `not_found` / `contradicted` verdict is the verification working as intended (it caught a brief-vs-code gap before you shipped), not a failure to alarm the user about.

   ❌ `get_core_apps is not in the codebase — the brief's RB-1 references a function that doesn't exist. The actual pattern is direct INSTALLED_APPS manipulation (index + replace), as seen in tests/settings.py.`
   ✅ `Resolving drift between the brief and the codebase: RB-1 cites get_core_apps, but the repo edits INSTALLED_APPS directly (index + replace — see tests/settings.py). Noting it in the verification.`

   This is a progress line, not a gate — keep it to one sentence and continue; the structured findings land in `BUILD-BRIEF-VERIFICATION.md` and the Step 10d gate.

5. **Write `BUILD-BRIEF-VERIFICATION.md`** to disk alongside `BUILD-BRIEF.md` using the schema in `references/brief-verification-checklist.md`. Cite file + line range + actual code snippet on every contradiction. Do not fabricate evidence.

6. **Sync the verification to Ritual's KG** — call `mcp__ritual__sync_brief_review` with:

   ```
   {
     exploration_id,
     review_type: 'BRIEF_VERIFICATION',
     content: <full BUILD-BRIEF-VERIFICATION.md markdown>,
     cited_files: <union of every file path cited across the verification>,
   }
   ```

   This persists the verification as a durable `BriefReview` row attached to the exploration. Future briefs on overlapping files will inherit the verified facts via `priorContext`; `/ritual lineage` on any cited file will surface this verification.

7. **Print a compact CLI summary** (≤ 8 lines, CLI Tenet #1, #6):

   ```text
   ✓ Verification complete — saved `BUILD-BRIEF-VERIFICATION.md`.

   Verified: {N}  ·  Contradicted: {M}  ·  Not found: {K}

   {If M > 0:}
   Top contradictions:
     ⚠ {cited_symbol} — brief says "{brief_assertion[0:60]}…"
        actual: "{code_reality[0:60]}…"
     ⚠ {next contradiction, if M > 1}
   ```

   Rules:
   - **If M = 0 AND K = 0:** print one line, *"✓ Verification complete — N citations checked, all verified. `BUILD-BRIEF-VERIFICATION.md` synced."*
   - **If M > 0:** print up to 3 top contradictions inline; rest are in the file. At the Step 10d gate, surface the contradictions count + note that plan mode will read them via KG priorContext.
   - **If brief made zero citations:** print *"✓ Verification skipped — the brief makes no specific code citations to verify."* Skip the sync call (nothing to persist). Proceed to Step 10c.

8. **Continue to Step 10c** with `BUILD-BRIEF.md` + `BUILD-BRIEF-VERIFICATION.md` both ready to write to disk and the verification synced to KG.

**Step 10d integration:** when contradictions exist, Step 10d's gate prepends an inline summary so the user sees *what the agent learned about the brief* before they decide whether to proceed. The brief itself is NOT rewritten — it stays the historical artifact Ritual generated. The KG carries the truth via the synced `BriefReview` row, and **plan mode (Step 11.1) reads the brief + KG-persisted reviews via `priorContext`** so the implementation incorporates the corrections without the brief content needing to change.

**Anti-patterns:**

- ❌ Skipping Step 10b.5 because "the brief looks fine." Brief-quality is invisible from reading the brief alone — the verification compares against the code.
- ❌ Treating the brief's hedge ("*may deviate if codebase has a stronger pattern*") as license to skip. The hedge means *"go verify"* — exactly what this step does.
- ❌ Padding the `verified` list. Only enumerate citations the brief actually made.
- ❌ Re-writing the brief at Step 10b.5. The verification produces findings; the brief stays as-is. Plan mode reconciles via KG priorContext.
- ❌ Skipping the `sync_brief_review` call. The local `BUILD-BRIEF-VERIFICATION.md` alone benefits this session only; the KG sync is what lets future briefs on overlapping files inherit the verified facts.

##### 10c — Write to `BUILD-BRIEF.md` + CLI summary (CLI Tenet #1, #5)

When the brief content is in hand (from generate OR polling), **don't dump 300 lines of markdown into the terminal**. The brief belongs in a file the user can open, search, share, and revisit; the CLI surface is for the decision.

1. **Write the markdown to `BUILD-BRIEF.md`** in the repo root. **The build brief is a LOCAL, per-build working file — never commit it.** It's a throwaway the coding agent reads to plan THIS build; the moment the code lands it's stale. The DURABLE record lives in Ritual (the exploration + its KG), not in git history — so the brief must stay out of the repo's tracked files. **Before writing, ensure it's gitignored:** if `.gitignore` does not already ignore `BUILD-BRIEF.md`, append a ritual-managed block ignoring `BUILD-BRIEF.md`, `BUILD-BRIEF-VERIFICATION.md`, `UX-REVIEW.md`, and their slug variants (`BUILD-BRIEF-*.md`, `UX-REVIEW-*.md`) — e.g. under a `# Ritual build artifacts (local, do not commit)` comment. Idempotent: skip if those patterns are already ignored. Prepend a Ritual attribution header before writing:

   ```markdown
   <!--
   Generated by Ritual
   Exploration: https://app.ritualapp.cloud/e/{exploration_id}
   Build brief id: {brief_id}
   Do not remove this header; it preserves implementation lineage.
   -->
   ```

   If a `BUILD-BRIEF.md` already exists:
   - **Same exploration** (recommendationsHash matches the cached row): silent overwrite + one-line note in the summary that you refreshed it.
   - **Different exploration**: surface a confirm: *"A `BUILD-BRIEF.md` already exists from exploration `{previous_exploration_name}`. Overwrite with brief for `{this_exploration_name}`? (y/N, or save-to-`BUILD-BRIEF-{slug}.md`)"*. (CLI Tenet #11 — confirm before destructive.)

2. **Print a compact CLI summary** — the top-of-mind information, the verification result, plus a single line pointing at the file:

   ```
   ✓ Build brief ready — discovery has become an implementation path.

   Signal: {N} accepted recommendations were converted into {M} code-time requirements.
   File: BUILD-BRIEF.md ({line_count} lines, {file_kb_size} KB)
   Verification: {V} verified · {C} contradicted · {NF} not found  (from Step 10b.5; see BUILD-BRIEF-VERIFICATION.md)

   Goal: {first line of Goal section, ≤ 100 chars}

   Top review-blockers (must address):
     RB-001 — {RB-001 title} → {one-line "what's required"}
     RB-002 — {RB-002 title} → {one-line "what's required"}
     RB-003 — {RB-003 title} → {one-line "what's required"}

   Top codebase anchors:
     {path1} — {pattern to extend, ≤ 60 chars}
     {path2} — {pattern to extend, ≤ 60 chars}
     {path3} — {pattern to extend, ≤ 60 chars}

   {ONLY IF Previously Deferred section is non-empty:}
   ⚠ {N} previously-deferred item{s} overlap this scope — see "Previously Deferred" section in BUILD-BRIEF.md
   ```

   Rules for the summary (CLI Tenets #3, #6):
   - **The `Verification:` line is mandatory** — render the actual numbers from Step 10b.5. If 10b.5 was legitimately skipped (brief made zero specific code citations), render `Verification: n/a — brief made no code citations to verify` instead of omitting the line. The line existing-but-zero is fine; the line being MISSING is a structural signal that 10b.5 was skipped without justification. Reviewing this summary should let the user (and a future SKILL self-check) catch a skipped-verification regression by spotting the missing line. The 2026-05-21 demo regression was Step 10b.5 silently skipped on a brief that cited `AbstractCommunicationEventType`, `utils.py Dispatcher`, `notify_user()`, and `oscar_send_alerts.py` — exactly the case 10b.5 is supposed to verify.
   - **Cap RBs and anchors at top 3 each.** Engineers don't read 12-row tables in terminals.
   - **Omit any section that's empty.** No "Previously Deferred: none" lines — just don't render that line. (The `Verification:` line is exempt — it's always rendered, see above.)
   - If `kgContextUsed.implementationCount > 0`, append one line above the goal: *"Grounded in {N} prior implementation{s}: {top match name}, …"* (CLI Tenet #4 — cite the specific signal).

3. **Offer to open the file** (CLI Tenet #10 — OS-aware affordances, available not mandatory):

   ```bash
   # Detect, in order: VS Code on PATH, JetBrains `idea` on PATH, $EDITOR set, macOS `open` available.
   command -v code >/dev/null && code BUILD-BRIEF.md
   command -v idea >/dev/null && idea BUILD-BRIEF.md
   [ -n "$EDITOR" ] && "$EDITOR" BUILD-BRIEF.md
   command -v open >/dev/null && open BUILD-BRIEF.md   # macOS
   ```

   If any of these are detectable, offer: *"Open `BUILD-BRIEF.md` in your editor? (y/N)"* — single yes/no, never a 4-way picker. If none are detectable, omit the offer entirely; the path is still clickable in most terminals.

##### 10d — Confirm and proceed (CLI Tenet #2, #12)

End Step 10 with a single recommended action plus a cheap escape hatch — never a 3-way option bloom.

**Rendering contract (load-bearing — see SKILL.md § Contract strength):** the user-facing block below is **verbatim**. Render the text inside the fenced block exactly as written — same option names (`go`, `drill {N}`, `ux-review`, `pause`), same one-line descriptions, same order, same connector word ("Before `go`, you can run `ux-review`…"). Do NOT paraphrase to "implement", "sync", "hold", "ship", or any other reworded synonyms. Do NOT collapse the option list. Do NOT add or omit options. The 2026-05-21 demo regression was an agent rendering `Reply implement / sync / hold` instead of this block — three different options, two with different semantics than the SKILL intends (`sync` ≠ `pause`). The contract-strength rule in SKILL.md is the backstop; this notice is the local reminder.

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ● Build brief  ○ Implementation (Your agent)

Build brief ready

`BUILD-BRIEF.md` is on disk. Skim the RBs + anchors, then decide:

  · `go` — ready to implement; move to coding
  · `drill {N}` — drill into RB-{N} before deciding

Before `go`, you can run `ux-review` for a design-quality pass on the brief (recommended for UI/UX features — produces `UX-REVIEW.md` and a tailored plan-mode prompt so plan mode stops asking you the same UX questions it always does). Reply `pause` to stop here.
```

Branch by user response. The CTA on screen is `go`, but accept these as synonyms so a user typing the obvious intent doesn't get penalized for word choice:

- **`go` / `y` / `yes` / `proceed` / `continue` / `next` / `implement` / `ship`**: continue to Step 11. Plan mode will read `BUILD-BRIEF.md` + any synced reviews (verify-brief from Step 10b.5; UX review from Step 10.5 if it ran) via KG `priorContext`. If verify-brief produced contradictions, plan mode picks them up there — the brief content itself stays as Ritual's historical artifact. (Synonyms accepted because the agent's drift to "Reply `implement`" trained users to type that word; until the verbatim rendering enforcement is fully reliable, treat user input charitably.)
- **`ux-review` / `review` / `ux`**: continue to Step 10.5 (writes `UX-REVIEW.md`, syncs it to KG via `sync_brief_review`, then continues to Step 11 with the tailored plan-mode prompt). Opt-in; absence is the existing path.
- **`drill {N}`**: open RB-{N} in the markdown, discuss inline, then loop back to the gate above.
- **`pause`** / `hold` / `stop`: stop here. The brief is on disk; the user can resume with `/ritual resume`.

**No `refine` action at Step 10d.** The brief is read-only after generation. Two reasons:

1. **Verification findings reach plan mode via KG, not via brief rewrites.** Step 10b.5 syncs `BriefReview` rows via `sync_brief_review`; plan mode reads them via `priorContext`. Re-rewriting the brief content adds LLM cost for zero implementation-correctness gain — the implementation is governed by plan mode + KG, not by the brief text itself.
2. **The brief stays as the historical record** of what Ritual generated. If the user wants new content (because underlying recs / requirements actually changed), call `generate_build_brief` with `force: true` — that's full regen with new source data. Don't conflate that with editing existing brief content.

**Pulse (Step 10 done):** Emit a pulse — this often crosses into **Implementation-ready** (90%+). Render full when that crossing happens. Use the build-brief celebration line: `✓ Build brief ready — discovery has become an implementation path.` If still below 90% (e.g. brief flagged residual debt), surface that in the pulse line itself and propose addressing it before coding.

<!-- lite:skip-start reason="optional UX brief review is not part of lite" -->
#### Step 10.5 — Optional UX brief review (entered ONLY when the user picks `ux-review` at Step 10d)

This step is opt-in. If the user picked `go` at Step 10d, skip directly to Step 11. The `ux-review` path is reached only when the user explicitly asks for it at the Step 10d gate — there is no auto-gating in this MVP (later iterations may use Stage E's UI-surface classifier to suggest the path automatically; see `backlog_design_recon_stage_e.md`).

Purpose: make the coding agent reason about the experience BEFORE it reasons about files. Plan mode otherwise interrogates the user for the same 10-question UX checklist on every UI-shaped feature. Paying for it once at the right moment — with the brief and the codebase both available — is cheaper than paying it implicitly through plan-mode interrogation.

This step is **SKILL-only — no MCP tool, no LLM-cost on Ritual's API.** The analysis happens locally in the calling agent because the agent is the one with repo access. The reference `references/ui-ux-checklist.md` is the canonical instruction set (methodology + output schema + plan-mode prompt template); this Step 10.5 is the thin orchestration layer that drives the agent through it.

Steps:

1. **Tell the user what's about to happen** (one line, not a multi-line pre-roll):

   > Running a design-quality pass on the brief. Reading `BUILD-BRIEF.md`, mining the repo for existing UI patterns, writing `UX-REVIEW.md` — about 30–60 seconds.

2. **Read `references/ui-ux-checklist.md`** for the methodology, output schema, and plan-mode prompt template. **Walk the methodology in order — do not skip to the output schema.** The methodology's six steps (read brief → identify UI surfaces → find repo analogues → compare brief vs analogues → fill schema with evidence → generate tailored plan-mode prompt) are load-bearing; the output schema only gets filled correctly when the analysis upstream is done.

3. **Read `BUILD-BRIEF.md`** end-to-end. Classify what it covers vs what it's silent on. The brief itself is the input signal — the review's value is on the gaps and codebase-grounding, not on re-deriving brief content.

4. **Mine the repo for existing UI analogues.** Use Grep / Glob / Read against the implied UI surfaces from the brief. Cite file paths in the review; every claim must trace back to either a brief line or a real repo file. **Do not fabricate analogues** — if `Grep` returns nothing, the surface is "new work," not a hallucinated path.

5. **Write `UX-REVIEW.md`** to disk alongside `BUILD-BRIEF.md` (same directory — repo root or `.ritual/`, whichever the brief landed in). Use the exact output schema from the reference file. Prepend the Ritual attribution header:

   ```markdown
   <!--
   Generated by Ritual — UX brief review
   Exploration: https://app.ritualapp.cloud/e/{exploration_id}
   Source brief: BUILD-BRIEF.md
   Do not remove this header; it preserves implementation lineage.
   -->
   ```

   If a `UX-REVIEW.md` already exists:
   - **Same exploration**: silent overwrite + one-line note in the summary.
   - **Different exploration**: confirm before overwriting (same convention as `BUILD-BRIEF.md` in Step 10c — *"A `UX-REVIEW.md` already exists from `{previous}`. Overwrite, or save-to-`UX-REVIEW-{slug}.md`?"*).

5a. **Sync the UX review to Ritual's KG** — call `mcp__ritual__sync_brief_review` with:

   ```
   {
     exploration_id,
     review_type: 'UX_REVIEW',
     content: <full UX-REVIEW.md markdown>,
     cited_files: <union of every file path cited across the review's Screen/Component, Design System Fit, and other sections>,
   }
   ```

   Persists the UX review as a durable `BriefReview` row attached to the exploration. Plan mode reads it via `priorContext` so the plan-mode prompt's mismatches / gaps / new-work items are KG-grounded, not just session-local. `/ritual lineage` on any cited UI file surfaces this review.

   **Anti-pattern:** skipping the sync because *"UX-REVIEW.md is right here on disk."* The local file benefits this session only; the KG sync is what lets future briefs / explorations on overlapping files inherit the findings.

6. **Print a compact CLI summary** — the file path + the load-bearing findings only, capped at ≤ 10 lines (CLI Tenet #1, #6):

   ```
   ✓ UX review ready — `UX-REVIEW.md` is on disk.

   Mismatches surfaced: {N}
     {first mismatch one-liner — brief X vs analogue Y}
     {second mismatch one-liner}

   Gaps surfaced: {M}
     {first gap one-liner — brief silent on Z, codebase default is W}

   New-work surfaces: {K}
     {first new-work surface one-liner}

   Plan mode will read this first when you proceed to `go`.
   ```

   Rules:
   - Cap each list at 3 entries. The full set is in the file.
   - Omit any list that's empty (e.g. "Mismatches surfaced: 0" → don't print the line).
   - If ALL THREE lists are empty: the brief is unusually complete. Print one line: *"Brief is unusually complete — no mismatches, gaps, or new-work surfaces. Plan mode will verify state coverage against codebase."*

7. **Offer to open the file** — same OS-aware affordance as Step 10c (VS Code → idea → $EDITOR → macOS open). Single yes/no, never a multi-way picker.

8. **Return to the Step 10d gate** with the updated framing — `UX-REVIEW.md` is now part of the implementation context:

   ```text
   Reply `go` to start implementation with the UX review as plan-mode input,
   or `drill {N}` / `pause` per the earlier options.
   ```

   When the user replies `go`, continue to Step 11 with the explicit instruction (passed to plan mode) to read both `BUILD-BRIEF.md` AND `UX-REVIEW.md`, and to use the "Plan Mode Prompt" block at the bottom of `UX-REVIEW.md` as its first numbered list — not a generic plan.

**Anti-patterns to avoid in this step:**

- **Don't render the full `UX-REVIEW.md` to the terminal.** It belongs in the file; the CLI surface is the summary plus the path.
- **Don't auto-`go` after writing the file.** The user explicitly opted into the review — let them open the file and decide when to proceed.
- **Don't enter plan mode mid-step.** Plan mode is Step 11. This step writes the artifact plan mode will read.
- **Don't propose visual designs.** This is a planning packet, not a design tool. Where the codebase has no design system, surface that fact and route back to the user.

**Pulse (Step 10.5 done):** Re-emit the Step 10 pulse if the review surfaced material gaps or mismatches — Readiness can dip back below 90% when significant UX work is flagged that the brief didn't capture. If the review came back clean (zero mismatches, zero gaps, zero new-work), keep the existing pulse — the brief was already implementation-ready.

<!-- lite:skip-end -->
<!-- lite:keep-start -->
#### Step 11 — Implement

This step happens **inside** the same `/ritual build` chat if the agent is also the coding agent (Claude Code / Cursor / etc.), or hand-off if the user is implementing themselves.

The Implementation phase landing — full rail (the rail moves to Implementation for the first time):

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ✓ Build brief  ● Implementation (Your agent)

Implementation (Your agent)

The build brief is on disk. From here, your agent codes against the
build requirements. Ritual will track commits via the `Ritual-Exploration:` trailer
so they link back to this exploration when you sync.

Next: I'll do a quick branch / dirty-worktree safety check, then hand
off to your agent's plan mode so the first pass is a plan grounded
in BUILD-BRIEF.md — not file edits.
```

##### 11.0 — Branch strategy (CLI Tenet #13)

**Never commit to `main` / `master` from an agent workflow.** Before writing a single line of code:

1. Check for uncommitted user work:
   ```bash
   git status --porcelain
   ```
   If there are unrelated user changes, pause before editing and ask whether to keep working on this branch, stash, or abort. Do not overwrite or mix with user work silently.

2. Check the current branch:
   ```bash
   git branch --show-current
   ```

3. If on `main` / `master` / `trunk` / `develop` (or any branch named in the repo's default-branch protections): **create a feature branch FIRST.** Do not ask whether to commit to trunk. Branch creation is free and reversible. Naming heuristic:
   - `feat/<exploration-slug>` when the slug is short (≤ 4 words)
   - `ritual/<exploration-short-id>` as a fallback (e.g. `ritual/exp-7a2b9c`)
   - If the user already named one in chat ("call it `feat/conversions-tracking`"), use that.

   User-visible:

   > Created branch `{branch}` for this Ritual implementation.
   > Override with `branch: <name>` before implementation begins.

4. If already on a feature branch and the working tree is clean or only contains this flow's changes: stay there. Don't switch.

**Never offer "commit to `main` directly" as an option in any user prompt.**

##### 11.0.5 — Plan-mode handoff (load-bearing — [USER PAUSE])

**Branch is created, working tree is safe — now hand off to plan mode.** Plan mode is user-invoked (the agent can't toggle it programmatically in Claude Code / Cursor / etc.), so without an explicit prompt the implementation phase starts with the agent improvising file edits instead of producing a reviewable plan grounded in `BUILD-BRIEF.md`. This step happens AFTER branch creation (Step 11.0) because plan mode in Claude Code blocks Bash, so branch creation has to happen first.

**Rendering contract — verbatim:**

```text
Branch ready. Switch your agent into plan mode so the first pass is
a plan grounded in BUILD-BRIEF.md, not file edits.

  · Claude Code: press Shift+Tab to cycle to "plan mode" (footer shows
    "plan mode" instead of "default" or "auto-accept edits")
  · Cursor: open Composer → toggle to "Plan" mode
  · Other agents: equivalent "plan / propose-only" mode if available;
    otherwise reply `skip` and I'll continue without

Reply `ready` once you're in plan mode (or `skip` if your agent has no
plan-mode equivalent). I'll load BUILD-BRIEF.md (and BUILD-BRIEF-
VERIFICATION.md / UX-REVIEW.md if present) as the FIRST inputs and
produce a numbered plan you can review before any file is edited.
```

[USER PAUSE] Branch on response:

- **`ready`**: continue to Step 11.1 (plan generation).
- **`skip`**: log a one-line note ("Plan mode skipped — agent has no plan-mode equivalent or user opted out. Proceeding directly to implement; risk: less reviewable first pass.") and skip Step 11.1 + 11.1.5, jumping straight to Step 11.2 (implement). This is an escape hatch, not the default.
- Any other response: re-render the prompt once. If still not `ready` / `skip` after two tries, default to `skip` with the warning line.

**Why this is load-bearing:**

1. Plan mode is the only mechanism that produces a reviewable plan BEFORE file edits. Skipping it means the user is reviewing a diff, not a plan — a more expensive correction loop.
2. `BUILD-BRIEF-VERIFICATION.md` contradictions are most valuable when they become explicit plan constraints, not when they're discovered during implementation.
3. Without an explicit prompt, the agent typically goes straight from "build brief ready" to file edits — observed regression during 2026-05-21 demo testing.

##### 11.1 — Plan mode generates the implementation plan

The user is now in plan mode (from Step 11.0.5). The agent must:

1. **Load `BUILD-BRIEF.md`** as the first input. If `BUILD-BRIEF-VERIFICATION.md` exists, load it too — every `contradicted` and `not_found` entry becomes an explicit constraint in the plan ("the brief claimed X but the code does Y; the plan must reconcile / not assume X"). If `UX-REVIEW.md` exists alongside `BUILD-BRIEF.md` (the user opted into Step 10.5), use the "Plan Mode Prompt" block at its bottom as the FIRST input — its numbered list of mismatches / gaps / new-work surfaces is the tailored agenda. The generic plan-mode template is the fallback for when only the brief exists.

2. **Load the SCOPE CONTRACT as hard constraints (the load-bearing step — prevention, not just detection).** The brief read (`get_build_brief_status` → `scopeContractResolved`, or the `generate_build_brief` response) carries the SAME typed contract Ritual will audit your plan against at Step 11.1.6. Treat it as binding and put it at the TOP of the plan-mode prompt verbatim:

   > **Scope contract — your plan must honour this (it will be audited):**
   > - **MUST cover** (one or more plan steps each, and cite the requirement): {each `scopeContractResolved.inScope[].text`}
   > - **Do NOT implement — deferred to a LATER PR** (out of scope for this change): {each `deferred[].text`}
   > - **Do NOT cross — non-goals**: {each `antiGoals[].text`}
   > - **Open questions — do NOT silently implement; flag if you must touch**: {each `discoveryGates[].text`}

   This is what makes plan mode deliver on the promise of the brief (which delivers on the recs). Feeding the contract in UP FRONT prevents the divergences Step 11.1.6 would otherwise have to catch and send back.

3. **Produce a numbered implementation plan** that:
   - has **one or more steps covering EVERY in-scope requirement** above (map each step to the requirement id it implements — this is the coverage the audit checks),
   - implements **none** of the deferred items and crosses **none** of the non-goals,
   - puts the RBs, any verification contradictions, and any UX "new work" surfaces at the top,
   - names the specific files / functions / new modules each step touches — concrete enough that the user can spot a mistake before any edit.

4. **Stay in plan mode until the user accepts the plan.** Do NOT switch to edit/auto-accept mode until the user explicitly approves the plan in plan mode (Claude Code's "accept plan" affordance, or the user typing `accept` / `looks good` / `go`).

##### 11.1.5 — Optional: save the implementation plan as a markdown artifact

After plan mode produces the implementation plan, **but before any code edits**, ask whether to save it.

**Rendering contract — verbatim:**

```text
Plan ready

Your agent generated an implementation plan from BUILD-BRIEF.md
{and BUILD-BRIEF-VERIFICATION.md / UX-REVIEW.md if those exist}.

Save this plan to `IMPLEMENTATION-PLAN.md` before coding? (y/N)
```

[USER PAUSE] Branch on response (default is no — not every plan is worth committing):

- **`y` / `yes` / `save`**: write `IMPLEMENTATION-PLAN.md` alongside `BUILD-BRIEF.md` in the repo root (or `.ritual/IMPLEMENTATION-PLAN.md` if the repo prefers tooling artifacts out of the top level — check `.gitignore` first). Prepend the Ritual attribution header:

  ```markdown
  <!--
  Generated by Ritual via plan mode
  Exploration: https://app.ritualapp.cloud/e/{exploration_id}
  Build brief: BUILD-BRIEF.md (Ritual requirements)
  This file: agent's concrete execution strategy
  Do not remove this header; it preserves implementation lineage.
  -->
  ```

  Then continue to Step 11.2.
- anything else (`n` / `no` / empty / any other text): continue to Step 11.2 without writing the file. Do not re-prompt.

**Rules:**

- **Do not ask this before plan mode has produced the plan.** The question is for the assembled plan, not "do you want me to write a plan in advance."
- **Do not dump the full plan into the chat when saving.** The plan markdown belongs in the file the user can open, search, share, and revisit — same pattern as `BUILD-BRIEF.md` and `BUILD-BRIEF-VERIFICATION.md` (CLI Tenet #1 — files for detail, CLI for decisions).
- **Default is `no`** — explicit `y` is required. Most quick implementations don't need a committed plan; saving by default would clutter the repo.
- If the user later opens the PR (Step 11.5), include `IMPLEMENTATION-PLAN.md` in the PR body's Exploration section if it was saved (see Step 11.5 template).

**Why this matters:** `BUILD-BRIEF.md` is the Ritual requirements artifact (what + why). `IMPLEMENTATION-PLAN.md` is the agent's concrete execution strategy (how). For non-trivial implementations, saving both gives reviewers a useful bridge from requirement to code — and gives `/ritual lineage` queries a richer trail to surface on future builds touching the same files.

<!-- lite:skip-start reason="optional plan-fidelity audit is not part of lite" -->
##### 11.1.6 — Optional: audit the plan against the brief (Audit 3 / plan-fidelity)

After plan mode produces the plan and **before any code edits**, you can audit the plan against the build brief's frozen **scope contract** (its in-scope requirements, discovery-gate requirements, and anti-goals). This is **Audit 3 / R6** — the downstream bookend to the Step 9.6 recs audit. It's non-circular by construction: the contract derives from discovery/recs, never the plan, so a flagged divergence is a real drift, not a tautology.

**Gate behavior by build mode** (from Step 0.1's `auditMode`):

- **`normal` (default):** offer it; default is to skip (most plans are faithful).
- **`audited`:** recommend it (default yes).
- **`strict`:** run it automatically (no prompt), and treat an `anti_goal_violation` as blocking.

**Rendering contract — verbatim (normal / audited modes):**

```text
Plan ready — audit it against the brief before coding?

Ritual can check this plan against BUILD-BRIEF.md's scope contract — flagging
anything the plan drops (a brief requirement no step covers), sneaks in
(out-of-scope work), or that crosses a non-goal — before you write code.

Reply `audit-plan` to run it, or `proceed` to start implementing.
```

[USER PAUSE] Branch on response:

- **`audit-plan`** (or auto, in `strict` mode): call
  `mcp__ritual__audit_plan(exploration_id, plan_content)` where `plan_content`
  is the implementation plan plan mode just produced (the same text you'd save to
  `IMPLEMENTATION-PLAN.md`). The server normalizes it to plan operations and runs
  R6 against the brief's scope contract. It's async — the tool polls to
  completion and returns a thin payload:
  - `audit_status: "ok"` (no divergences) → tell the user the plan is faithful to
    the brief and continue to Step 11.2.
  - `audit_status: "needs_attention"` → render each divergence (`divergence_kind`
    + the `plan_op` and/or `brief_reference` it concerns + `rationale`). Group by
    kind: **missing_brief_decision** ("the brief asked for X; no plan step covers
    it" — computed deterministically from coverage), **out_of_scope_addition**
    ("step N does X, which maps to nothing in the brief"), **premature_implementation**
    ("step N implements X, which the brief deferred to a LATER phase/PR — not this
    one"), **scope_creep** ("step N covers X but does substantially more"). Then
    pause: *"Revise the plan to address these (back to plan mode), or proceed and
    accept the divergences? Reply `revise` or `proceed`."*
  - `audit_status: "blocked"` (an `anti_goal_violation`) → surface it prominently:
    *"⚠ The plan advances something the brief explicitly forbids: {evidence}. This
    crosses a non-goal you set during discovery."* In `strict` mode this blocks —
    require `revise` or an explicit `override` with a one-line justification. In
    other modes, strongly recommend `revise`.
  - On `revise`: the audit response carries a ready-to-paste **`revision_directive`**
    (assembled from the structured `revisions[]`, blockers first — each is a
    `request_plan_revision` repair keyed to a specific divergence). Feed that
    directive **verbatim** back into plan mode as the revision agenda (back to
    Step 11.1, keeping the scope contract from 11.1's step 2 in force), let plan
    mode produce a revised plan, then **re-run `audit_plan` on the revised plan**.
    This is the runtime repair loop: `audit_plan` → `revise` → `audit_plan`.
    - **Cap it at 2 revision rounds.** If divergences remain after the 2nd
      revision, stop looping and surface the residual divergences to the user with
      a decision: *"These divergences persist after 2 revisions — accept them
      (they'll be logged), or stop here? Reply `accept` or `pause`."* Don't churn.
  - On `proceed` / `override` / `accept`: continue to Step 11.2. Treat each
    accepted divergence as a **`confirm_intentional_divergence`** — record it as a
    Step 12 `sync_implementation` decision (`area` = the requirement/anti-goal,
    `choice` = "intentionally diverged: {why}", `source_recommendation_id` = the
    `brief_reference.id`) so the override is captured in lineage rather than lost.
    A persistent *anti-goal violation* the user keeps overriding is a signal the
    BRIEF (or its anti-goals) is wrong — surface that, don't just bury it.
- **`proceed`** (or anything else): skip the audit and continue to Step 11.2. Do
  not re-prompt.

**Rules:**

- **Requires a READY BuildBrief with a scope contract.** Briefs synthesized before
  the scope-contract feature lack one; if `audit_plan` returns a 400 about a
  missing contract, regenerate the brief (`generate_build_brief force:true`) or
  skip the audit — don't block the build on it.
- **Advisory, not auto-repair.** R6 surfaces divergences; the fix is always a
  human-in-the-loop plan revision or an explicit accept. Never silently rewrite
  the plan.
- **Don't dump the raw normalized plan ops** into the chat — surface the
  divergences (the signal), not the methodology.

<!-- lite:skip-end -->
##### 11.2 — Implement

1. Use the standard coding-loop tools (Edit/Write/Bash/etc.) to execute the accepted plan.
2. Run tests, lint, build per the repo's conventions.
3. Track each architectural decision as you go — the input to Step 12's `sync_implementation` call. Per decision, write down: `area`, `choice`, `alternatives_considered`, `rationale`, `source_recommendation_id` (the RB-N or recommendation id the decision implements). This is what makes lineage queryable later — don't skip it.

##### 11.3 — Commit (CLI Tenet #14 — Ritual attribution)

Commit on the feature branch from Step 11.0. One-or-many commits is fine; conventional-commit prefixes preferred (`feat:`, `fix:`, `test:`, etc.). Include a Ritual footer on the FINAL commit of the implementation so the trace from code → exploration is visible in `git log`:

```
feat(<area>): <one-line headline>

<short body — what changed, why, key trade-off>

Ritual-Exploration: <exploration_id>
Ritual-Exploration-Url: https://app.ritualapp.cloud/e/<exploration_id>
Ritual-RBs-Satisfied: RB-1, RB-2, RB-7
```

Intermediate commits can skip the footer. The final commit IS the linkage anchor.

##### 11.4 — Post-implementation summary (CLI Tenet #1 — files for detail, CLI for decisions)

**Don't dump a per-file changelog into the chat.** The full diff lives in `git diff <branch>..HEAD` and the eventual PR body. The CLI summary should be **≤ 8 lines** and surface only what's load-bearing for the user's next decision:

```
✓ Implementation done (your agent) — {exploration name}
  Branch: {branch}, {N} commits, {M} files changed
  Tests: {tests_added} added, all passing
  RBs satisfied: {comma-joined list of RB-N from the brief, ALL or a count}
  Open deferrals logged for Step 12: {count}

Next: push + open PR? (y / show me what changed / abort)
```

If the user picks "show me what changed", THEN run `git diff --stat HEAD~N..HEAD` or open per-file diffs interactively — on request, not by default.

##### 11.5 — Push + PR (single recommended action)

If the user says "y" / "push" / "open PR":

1. `git push -u origin <branch>` (single command, no `--force` ever in this flow).
2. Build the PR body from the template below (CLI Tenet #14).
3. `gh pr create --base <default-branch> --title <…> --body <…>`.
4. Surface the PR URL to the user.

**Write the PR body for a maintainer who has never heard of Ritual.** Lead with what changed, *where to look* (in review order), *why*, and *how to verify* — so a reviewer can move fast and trust the change. Ritual lineage goes at the bottom, not the top. Fill every section from real artifacts (brief decisions, the diff, the test files); never leave a `<placeholder>` in the posted body.

**PR body template:**

```markdown
## What this PR does

<2-3 plain sentences: the change + the problem it solves, derived from the build brief's Goal>

## Where to look (review order)

1. `<path>` — <the load-bearing change; start here>
2. `<path>` — <how it integrates>
3. `<path>` — <schema/data changes, if any>
   <ordered load-bearing → plumbing, so review time goes where it matters>

## Why / key decisions

- <decision + the trade-off / alternative rejected — the 1-3 calls a reviewer might second-guess, taken from the brief's decisions>

## How to verify

- Automated: <test files + how to run them>
- Manual: <steps a reviewer runs locally to see it work>

## Scope & follow-ups

- In scope: <what this PR delivers>
- Out of scope / deferred: <intentional punts, one line each — so reviewers don't flag them as gaps>

## Risk / blast radius

- <backward-compat, migration ordering, perf — what could break in prod>

## Ritual lineage

- Exploration: [<exploration name>](<EXPLORATION_URL>) · Build brief: `BUILD-BRIEF.md` (committed for reviewer reference) · Requirements satisfied: <N/M>
- Implementation plan: see `IMPLEMENTATION-PLAN.md` *(only if Step 11.1.5 wrote it)*

Ritual-Exploration: <exploration_id>

🪷 Generated via [Ritual](https://ritual.work) — closing the loop with `sync_implementation` after merge.
```

> **`<EXPLORATION_URL>` MUST be environment-correct — never hardcode `app.ritualapp.cloud`.** Use the server-resolved exploration URL the MCP returns (built from the server's `WEB_URL`). Hardcoding production breaks the link for **dev** builds (the exploration lives in the dev DB) and for **self-hosted / single-tenant enterprise** deployments (the exploration lives on the customer's own Ritual instance, not Ritual's SaaS). If the MCP response does not carry a URL, derive the base from your Ritual auth issuer rather than assuming production. Same rule for the `Ritual-Exploration-Url` commit trailer.

If the user is implementing manually: hand off the brief + the branch-strategy note ("create a feature branch off `main` — don't commit to trunk"), tell them you'll be ready to run `sync_implementation` when they're done.

<!-- lite:keep-end -->
#### Step 12 — Close the loop with `sync_implementation`

##### 12.0 — What this step does (in product terms)

Before asking for permission, frame the call in language the user can act on. `sync_implementation` is not just an API call — it's the moment the workspace's knowledge graph absorbs what you just shipped. Full rail (this is a top-level decision gate that ends the build flow):

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ✓ Build brief  ● Implementation (Your agent)

Log implementation

I'm about to log this implementation into the workspace's knowledge graph. After this:

  · The exploration's state flips to ✓ done (or ⚠ implemented-ahead if
    any recs weren't approved when shipped).
  · The implementation gets linked back to the recommendations it
    implements — so future `/ritual build` calls touching
    `{first 2 of filesChanged}` will see this implementation as priorContext.
  · The {M} follow-ups you intentionally punted get logged with
    their reasons — peers can see them in `/ritual lineage` on these
    files later.

Reply `log` to confirm, `hold off`, or `adjust` to edit the list first.
```

This framing replaces "I need to call sync_implementation, OK?" — which is jargon. The user should know what they're approving in product terms (CLI Tenet #4 — cite the specific signal). Note the vocabulary rule in `cli-output-contract.md` — do not surface "decisions" / "{N} decisions" as a user-facing label here; frame the moment as logging the **implementation** itself.

##### 12.1 — Make the call

Call `mcp__ritual__sync_implementation` with:
- `workspace_id`, `exploration_id`
- `repo`, `branch`, `pr_url`, `pr_number`, `pr_status`
- `commits[]` — each with `sha`, `message`, `timestamp`, `files_changed`
- `decisions[]` — each with `area`, `choice`, `alternatives_considered[]`, `rationale`, optionally `source_recommendation_id` (anchor each decision to the rec it implements when possible — this is what enables future "shipped X to satisfy rec Y" queries)
- `deferrals[]` — for things you intentionally punted (`rb_id`, `description`, `reason`, `severity`, `related_files[]`, `related_modules[]`)
- `gate_verdict`, `adherence_rate` — your own self-reported quality signals

The A1.5 snapshot column auto-captures each linked recommendation's status at the moment of sync — so if you implemented before the rec review's `proceed` (while the rec was still un-reviewed), the timeline is preserved automatically.

When sync_implementation succeeds, the response includes:

- `decisions: [{ decisionId, area, choice, recommendationStatusAtImplementation }, ...]` — IDs of every architectural decision logged + the rec-status snapshot (A1.5)
- `deferrals: [{ deferralId, rbId, severity }, ...]` — IDs of every deferral
- `decisionsCount`, `deferralsCount` — totals for the summary line
- `webUrl` — clickable link to the exploration's implementation record in the web UI

**Surface ALL of this to the user**, not just "ok logged." This is the visible signal that the loop closed. Full rail (this is the completion state for the whole `/ritual build` flow):

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ✓ Build brief  ✓ Implementation (Your agent)

✓ Logged implementation for {exploration name}

  · Implemented: {first 2 area:choice pairs from decisions[],
    e.g. "auth: OAuth not SAML; data-model: tenant-scoped indexes"}
  · {deferralsCount} deferral{s} registered: {first 1, e.g. "[major]
    Rate-limit per-tenant — out of scope for v1"}
  · View: {webUrl}

Future `/ritual build` calls touching `{first 2 of filesChanged}` will
now see this implementation in their priorContext block.

Next: nothing required — the loop is closed. Run `/ritual lineage` on
any touched file to trace this back later.
```

The `Implemented:` line surfaces a representative slice of WHAT got implemented (concrete area:choice pairs from the underlying `decisions[]` payload) rather than a labeled count. Per the vocabulary rule in `cli-output-contract.md`: the word "decisions" is not surfaced as a user-facing label; the artifacts ARE the signal.

If any anchor's `recommendationStatusAtImplementation` is NOT `approved` (i.e. implemented before the rec review's `proceed`), add a callout — still frame in implementation/recommendation terms. Append this block BELOW the completion message (no separate rail; the rail is already rendered at the top):

```text
⚠ {M} of the recommendations were implemented while still in {status}
state — the exploration now shows `implemented_ahead`. An admin should
review + accept the recs to close the gap.
```

The closing sentence is the most important one: it tells the user **what just happened in the system** in product-level terms. Without it, sync_implementation feels like a write-only black hole. With it, the user understands they just contributed to the workspace's memory.

**If `sync_implementation` fails:** do not drop the structured implementation data. Write the intended payload to `.ritual/pending-sync/<exploration-id>.json` and tell the user exactly what was not logged.

User-visible (full rail — sync failure is a top-level state):

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ✓ Build brief  ● Implementation (Your agent)

Sync failed (recoverable)

`sync_implementation` failed: {error summary}

Saved the intended sync payload to `.ritual/pending-sync/<exploration-id>.json`.
Nothing about your implementation was lost — the failure is on the
logging side, not the code side.

Next: run `/ritual resume` later to see + retry pending syncs, or
re-run `sync_implementation` now if the cause was transient.
```

Create `.ritual/pending-sync/` if needed. **Ensure the directory is gitignored** — the saved payload contains `decisions[].rationale` text the user typed and commit-level data that shouldn't end up in shared repo history. On the first failed sync, also write `.ritual/pending-sync/.gitignore` with `*` so the directory itself is committed but its contents aren't (gives teammates the breadcrumb that pending syncs exist without leaking contents):

```bash
mkdir -p .ritual/pending-sync
[ -f .ritual/pending-sync/.gitignore ] || echo '*' > .ritual/pending-sync/.gitignore
[ -f .ritual/pending-sync/.gitignore ] && ! grep -q '^!\.gitignore$' .ritual/pending-sync/.gitignore && echo '!.gitignore' >> .ritual/pending-sync/.gitignore
```

That two-line `.gitignore` (`*` then `!.gitignore`) follows the standard pattern: ignore everything in this directory EXCEPT the gitignore file itself. Most teams already use this idiom for `.cache/`, `node_modules/`, etc.

##### 12.2 — Staleness check before retry

When retrying a pending sync from `.ritual/pending-sync/<id>.json`, the user may have committed more code since the failure. The saved payload's `commits[]` is a frozen snapshot — re-uploading it after additional commits land would mis-attribute the new work as "not part of this exploration."

Before re-invoking `sync_implementation` on a saved payload:

1. Read the payload's `commits[]` (each has a `sha`).
2. Run `git log --pretty=format:%H` against the payload's `branch`.
3. Compare: if there are commit SHAs in `git log` that AREN'T in the payload's `commits[]`, the payload is stale.

If stale, surface to the user with the full rail (top-level decision gate):

```text
Ritual build
✓ Job  ✓ Scope  ✓ Discovery  ✓ Recommendations  ✓ Build brief  ● Implementation (Your agent)

Pending sync is stale

This pending sync was saved {N} day(s) ago. Since then you've added
{M} more commit(s) to `{branch}` that aren't in the saved payload.
Retrying as-is would log a partial picture — the work done since the
failure would NOT be attributed to this exploration.

Options:

  1. Retry as-is — log what was saved; you can sync the new commits later.
  2. Regenerate — re-run from scratch with the current state. This is
     usually right when there's been substantive work since the failure.
  3. Show me — print the {M} new commits so I can decide.

Reply `1`, `2`, or `3`. Reply `pause` to stop here.
```

**[USER PAUSE — required, do not auto-answer]** Wait for response. Option 2 is usually right when there's been substantive work; option 1 is fine for small follow-up commits the user wants attributed to the next sync.

If the saved payload's `commits[]` matches current git state, proceed silently to the retry.

<!-- lite:keep-start -->
#### Step 13 — Suggest the next job to be done

The loop just closed (Step 12). Rather than stop cold and make the user
re-bootstrap context for whatever they do next, offer the **next best job to be
done** — a NEW discovery exploration in THIS workspace, so the knowledge graph,
deferrals, and prior explorations you just built keep compounding. This is
forward motion, never required work.

##### 13.1 — Generate the suggestion set

Call `mcp__ritual__suggest_next_job` with `{ exploration_id }` (the
just-finished exploration). It returns 1 primary + up to 2 alternatives. Each is
a NEW exploration that runs its own discovery — it is **never** "go implement the
recommendations you already have" (that's the coding agent's job — `/ritual
resume` on this same exploration). Each suggestion carries:

- `jtbd` + `label` — the job, already picked
- `reasoning` — the concrete signal it cites (a deferral, an unaddressed recommendation, or the natural lifecycle continuation)
- `descriptionSeed` — a first-person "what to explore" framing to pre-fill the next exploration's problem box
- `recommendedPersona`, `sourceRecommendationId`, `id`

Also returned: `recommendationsAddressed` (false ⇒ this exploration still has
clear-to-implement work that ships via `resume`, not a next job).

- **If `suggestions` is empty** (or the call errors) → say nothing about next jobs; drop straight to 13.3. Never block the closed-loop completion on this.

##### 13.2 — Present the picker

**[USER PAUSE]** Render the standard list-picker (primary first, marked ★):

```text
Next job to be done

{exploration name} is shipped and logged. To keep building on what this
workspace now knows, here's the next discovery worth running:

★ 1. {primary label}
     {primary reasoning}

  2. {alt1 label}
     {alt1 reasoning}

  3. {alt2 label}
     {alt2 reasoning}

Reply `1`, `2`, or `3` to start it — the job's already picked, so you'll go
straight to framing what to explore. Reply `skip` to stop here.
```

Only render lines for the suggestions actually returned (there may be just a
primary, or a primary + 1). If `recommendationsAddressed` is `false`, add ONE
line below the picker — lean on the coding agent, don't turn Ritual into a
backlog manager:

```text
({N} item{s} from this exploration are clear to implement — say `resume` to continue shipping them here.)
```

**[USER PAUSE — required, do not auto-answer]** Wait for the user's reply.

##### 13.2.1 — On pick (`1` / `2` / `3`)

The picked suggestion is a NEW exploration in the SAME workspace with the job
already chosen — so **advance, don't re-bootstrap**:

1. Skip the work-item / job pick entirely (Steps 0–4) — `jtbd` is already set by the suggestion.
2. Go to **Step 5 (problem frame)** using the suggestion's `descriptionSeed` as the DRAFT "what are you trying to explore?" — present it as an editable starting point, not a blank box. Let the user refine it.
3. At **Step 6 (`create_exploration`)**, pass `from_next_job_suggestion_id` = the picked suggestion's `id`. The server links the new exploration to its parent + source recommendation, defaults the `jtbd` from the suggestion, and marks the suggestion started (it stops showing as an open next job, and the originating recommendation now reads as handed off).
   - If `create_exploration` returns **409** (this next job was already started), don't create a duplicate — tell the user it's already in progress and offer to open that exploration instead.
4. Continue the normal flow from **Step 7 (discovery)**.

##### 13.2.2 — On `skip`

Acknowledge and drop to 13.3. The suggestion set is persisted — a later `ritual
graph status` or re-run of `/ritual build` in this workspace can surface it
again; nothing is lost.

##### 13.3 — Follow-up pointer

If they want to check the state at any time, point them at:

> `ritual graph status` (in their CLI) — shows the workspace's current KG counts + recent implementations.

Or: re-run `/ritual build` in this workspace later — the existing-work check will surface this exploration with its new `done` state badge, and any future build whose `sources` overlap will pull in the decisions + deferrals you just logged as priorContext.

<!-- lite:keep-end -->
### Failure modes & recovery

**Discovery generation hangs (>5 min polling without `ready: true`)**: ask the user — wait longer, or retry (`suggest_discovery_questions` again, new task)? Discovery questions are required (the user must pick at least 6 to run), so there is no skip-and-proceed option; if generation can't produce questions, surface the failure rather than running with none.

**Agentic run fails or stalls**: surface the error, offer retry or stop.

**Discovery state ready=true with zero matters**: rare but possible if the LLM produced a malformed state. Retry by calling `suggest_discovery_questions` again.

**LLM-cost / quota errors (HTTP 429)**: tell the user explicitly. Do NOT auto-retry — quota issues need a human decision (different model tier, wait, top up).

### Tools used

This subcommand exclusively uses Ritual MCP tools, in the order they appear:

1. `mcp__ritual__list_workspaces` (Step 1)
2. `mcp__ritual__create_workspace` (Step 1, only if no workspace exists)
3. `mcp__ritual__list_explorations` (Step 1.5 — resume vs start, with state badges)
4. `mcp__ritual__suggest_high_leverage_problems` (Step 1.5 step 6b — option 3, "help me find the highest-leverage thing")
5. `mcp__ritual__check_exploration_overlap` (Step 1.5 step 8 — pre-creation overlap detection before "start fresh")
5a. `mcp__ritual__archive_exploration` (Step 1.5 step 6a — soft-delete a duplicate/misfire when user picks `delete N` from the resume menu)
6. ~~`mcp__ritual__list_templates`~~ — **REMOVED 2026-05-21 (CLI 0.9.0+).** Step 2 is now server-side template resolution; the tool is no longer registered on the MCP surface. Do not call it. See Step 2 § "Rewritten 2026-05-21" for the rationale.
7. `mcp__ritual__generate_considerations` (Step 4)
8. `mcp__ritual__refine_considerations` (Step 4.2, iteration only)
9. `mcp__ritual__generate_problem_statement` (Step 5)
10. `mcp__ritual__refine_problem_statement` (Step 5.2, iteration only)
11. `mcp__ritual__create_exploration` (Step 6)
12. `mcp__ritual__fork_sibling_explorations` (Step 6.5 — optional only when the user explicitly asks to save separate sibling tracks)
13. `mcp__ritual__suggest_discovery_questions` (Step 7.1)
14. `mcp__ritual__get_discovery_state` (Step 7.2)
15. `mcp__ritual__accept_discovery_questions` (Step 7.4)
16. `mcp__ritual__set_anti_goals` (Step 7.5, optional)
17. `mcp__ritual__start_agentic_run` (Step 8 — engineering runs through recommendations; product/design may use `stop_after='answers'`)
18. `mcp__ritual__get_agentic_run` (Step 8 / Step 8.5 polling)
19. `mcp__ritual__cancel_agentic_run` (Step 8, only on user abort)
20. `mcp__ritual__resume_agentic_run` (Step 8.5, only when product/design answer-review mode was used)
20a. `mcp__ritual__get_answer_state` (Step 8.5 per-question read)
20b. `mcp__ritual__iterate_answer` (Step 8.5 — user picked "iterate")
20c. `mcp__ritual__submit_answer` (Step 8.5 — user picked "submit")
21. `mcp__ritual__get_recommendations` (Step 9)
22. `mcp__ritual__accept_recommendations` (Step 9, admin branch only — fires requirement gen fire-and-forget)
23. `mcp__ritual__get_requirement_set_status` (Step 9.5 polling)
24. `mcp__ritual__generate_build_brief` (Step 10a)
24a. `mcp__ritual__get_build_brief_status` (Step 10b — timeout-recovery polling, OR proactive cache-hit check before 10a)
24d. `mcp__ritual__sync_brief_review` (Step 10b.5 — sync `BUILD-BRIEF-VERIFICATION.md` to KG; AND Step 10.5 — sync `UX-REVIEW.md` to KG)
24b. `mcp__ritual__add_knowledge_source` (Step 6.2 — register staged knowledge sources after `create_exploration` returns `exploration_id`; staging happens at Step 3.5)
24c. `mcp__ritual__list_knowledge_sources` (used inline by Step 3.5 to show already-attached refs on resume; also called by `/ritual context-pulse` CP2 for Reference Grounding count)
24e. `mcp__ritual__audit_recommendations` (Step 9.6 — start an audit chain on the (anti-goals, typed recs+reqs, R4) triple; cli 0.10.0+)
24f. `mcp__ritual__apply_repair` (Step 9.6 — apply or waive a structured repair instruction returned by an audit iteration; cli 0.10.0+)
24g. `mcp__ritual__get_audit_chain` (Step 9.6 — fetch the full chain trail for review/lineage; cli 0.10.0+)
25. `mcp__ritual__sync_implementation` (Step 12)
26. `mcp__ritual__suggest_next_job` (Step 13.1 — propose the next discovery job after the loop closes; `create_exploration` at Step 13.2.1 takes `from_next_job_suggestion_id` to record the handoff)

36 of the 48 Ritual MCP tools (cli 0.10.0+: the 3 audit tools — `audit_recommendations`, `apply_repair`, `get_audit_chain` — joined the linear flow at Step 9.6 (audit-suite.md § Audit 1); cli 0.22.0+: `suggest_next_job` joined at Step 13 to close-then-continue the loop). The other 12 (`ping`, `get_exploration`, `list_agentic_runs`, `add_collaborator`, `check_anti_goals`, `query_knowledge_graph`, `get_workspace_overview`, `get_knowledge_source`, `remove_knowledge_source`, `get_recommendation_attestation`, `score_context_pulse`, `get_next_job`) are situational, not part of the linear build flow (`get_next_job` re-reads a persisted next-job set; the flow itself only needs `suggest_next_job`).

**Note on `check_anti_goals` vs `audit_recommendations`:** these are distinct tools. `check_anti_goals` is the older, single-shot validation tool (read-tier; one LLM call, no chain rows) used ad-hoc to validate a proposal against an exploration's current anti-goal set. `audit_recommendations` (cli 0.10.0+, write-tier) starts a stateful `AuditChain` that runs R4 (constraint-perturbation) against a brief, produces structured `SurvivalReport` + `RepairInstruction` rows, and supports the apply/waive repair loop. Use `check_anti_goals` for one-shot proposal validation; use `audit_recommendations` for chain-tracked constraint-survival audits of a brief.

### After this subcommand

When `/ritual build` completes, the exploration is in COMPLETE state with accepted recommendations AND a build brief has been generated AND (if the agent implemented in-chat) `sync_implementation` has been called. The full close-the-loop cycle now lives inside this skill — there's no separate downstream `/ritual-builder-spec` step required.

Variants:
- One person runs the whole flow: Steps 1 → 13, no handoff. Step 9 is a uniform non-blocking review (recs are auto-accepted; `proceed` records the review and continues).
- Implementation lands before the rec review/`proceed`: the `sync_implementation` snapshot freezes that timeline and the exploration shows `⚠ implemented_ahead` until reconciled (see Step 12).
- Resume mid-flow: the existing-work check surfaces explorations with state badges and jumps directly to the right phase. (Or, for the "I just want to pick up" intent, see `/ritual resume` below.)

---

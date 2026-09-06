---
name: grill-me
description: Stress-test an existing plan through focused questions and concrete scenarios, recording domain terms and consequential decisions. Use for grill me, 詰めて, 問い詰めて, or an explicit design interview.
---

# grill-me

Find the decisions that could make the plan fail or change its outcome. Keep the interview focused on those decisions, and record the domain knowledge needed to carry them forward.

## Interview

Read the plan and the relevant code or documentation before asking about facts available there. Start from the user's unresolved concern rather than restarting an already completed design conversation.

Ask one consequential question at a time, with a recommendation and its tradeoff. Resolve dependencies before downstream choices. Use concrete scenarios to test behavior, boundaries, failure recovery, and compatibility.

Put product and costly-to-reverse decisions to the user. For routine choices within the accepted scope, propose or adopt the established pattern instead of turning every implementation detail into an interview question. Existing answers remain valid unless new evidence contradicts them.

Continue independent research and capture agreed points while awaiting an answer. Stop interviewing once the material decisions needed for the requested work are resolved; exhaustive discussion of every imaginable branch is not the goal.

An interview request alone does not authorize implementing the plan. If implementation is already requested and the relevant decisions are settled, continue within that scope without asking for the same approval again. Unanswered questions remain unresolved.

## Domain knowledge

Read existing `CONTEXT.md` and relevant ADRs when they affect the discussion. If `CONTEXT-MAP.md` exists, use it to locate the relevant context.

Challenge overloaded terms and contradictions that change the behavior being designed. Preserve the distinction between what the code currently does and what the user wants it to do.

Record project-specific terms whose ambiguity matters in `CONTEXT.md`, using [CONTEXT-FORMAT.md](CONTEXT-FORMAT.md). Keep it a glossary, not implementation notes or a task log. Reuse an existing glossary; create one only when useful terms need a durable home. Capture related terms together when that is clearer than editing after each utterance.

Record an ADR only for a real tradeoff that is hard to reverse and would surprise a future reader without context. Use [ADR-FORMAT.md](ADR-FORMAT.md), preserving existing locations and numbering. A short plan can carry an ordinary decision without a separate ADR.

Write documents in the repository's language; default to Japanese where none is established. Finish with the decisions that matter and any unresolved branch, rather than a transcript of the interview.

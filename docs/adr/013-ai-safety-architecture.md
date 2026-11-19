# AI safety architecture

**Title:** Layered AI safety: rules, classification, grounded retrieval, confidence, and human escalation  
**Status:** accepted  
**Date:** 2026-11-19  
**Owner:** TBD

## Context

The mushroom brief includes an AI assistant, smart FAQ, and photo-based technical support (Plant Doctor). Farmers and the cohort (including women and youth) need guidance that is **accurate**, **safe**, and **escalated to humans** when knowledge is insufficient. Budget is **KES 350,000** for design, development, and hosting; uncontrolled LLM use risks cost, harm, and loss of trust. Production AI remains deferred under [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md); the demo uses canned responses per [003-simulate-functionality.md](003-simulate-functionality.md).

## Decision

When AI is implemented beyond the demo, PalBpearl will combine:

1. **Hard-coded safety rules** — non-negotiable guardrails (for example prohibited advice classes, mandatory disclaimers).
2. **Issue classification** — route queries and photo support into known issue types before generating guidance.
3. **Grounded retrieval** — answers drawn **only** from **approved documents** (manuals, FAQs, agronomist-reviewed content), not open web sources.
4. **Confidence threshold** — automated replies only when confidence meets an agreed minimum; otherwise withhold or narrow the response.
5. **Human escalation** — agronomists or staff take over when information is insufficient, confidence is low, or safety rules trigger.

Demo screens may **simulate** this pipeline with canned text; production must implement the above before real AI goes live.

## Alternatives considered

- **Keyword-only escalation** — Simple but brittle; misses context and unsafe paraphrases.
- **Open-ended LLM** — Flexible but hard to ground, costly, and risky for farmer-facing agricultural advice.

## Consequences

Accepted 2026-11-19 ahead of Phase 1 scaffolding; governs candidate evaluation and AI safety design respectively.

### Positive

- Aligns AI with field expertise (Rogerson Meme, Ronn Kenoly) and staff workflows.
- Supports trust for women and youth farmers in the target cohort.

### Negative

- **More design work** before AI implementation (content approval, retrieval corpus, thresholds).
- **AI moves later** in the [../vision/roadmap.md](../vision/roadmap.md) priority stack (Additional tier); Essential MVP and core operations come first.
- Architecture must be **evaluated against the KES 350,000 budget** (query limits, model choice, hosting).

### Follow-ups

- Resolve open questions: AI confidence threshold, per-user query limits, content ownership.
- Candidate models in [012-candidate-technologies-from-brief.md](012-candidate-technologies-from-brief.md) remain candidates until a provider ADR accepts one.

## Related

- [003-simulate-functionality.md](003-simulate-functionality.md)
- [005-defer-backend-db-ai.md](005-defer-backend-db-ai.md)
- [012-candidate-technologies-from-brief.md](012-candidate-technologies-from-brief.md)
- [../open-questions.md](../open-questions.md)
- [../vision/scope-and-non-goals.md](../vision/scope-and-non-goals.md)
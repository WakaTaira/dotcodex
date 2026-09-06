# ADR Format

Use the repository's existing decision-record convention. Otherwise use `docs/adr/NNNN-slug.md`, with the next available number; create the directory only when a decision warrants a record.

```markdown
# <Decision>

Date: YYYY-MM-DD

<Context and chosen approach. Explain why it fits the constraints and why the plausible alternatives were rejected.>

<Consequences or reversal costs that a future reader needs to know.>
```

A paragraph can be sufficient. Add status, superseding links, or separate options and consequences sections when they help readers assess or revisit the decision.

Record a decision here only when it involves a real tradeoff, is costly to reverse, and is likely to surprise a future reader. Routine library use or naming choices usually belong in the code or current plan instead.

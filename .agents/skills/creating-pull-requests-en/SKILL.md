---
name: creating-pull-requests-en
description: Write, create, or update PR titles and descriptions for repositories whose review language is English. Use when preparing the PR text, including revisions to an existing PR. For Japanese review communities, use creating-pull-requests-ja.
---

# Creating and updating pull requests

A PR description explains the problem, the resulting behavior, and the decisions a reviewer needs to assess the change. It also preserves enough context for a future reader to understand why the change exists. Attribution and adaptation history are in [PROVENANCE.md](PROVENANCE.md).

## Establish the review context

Use the repository's applicable contribution guide and PR template. Their required fields, title convention, and review language take priority over the defaults here. Reuse context already established in the session; consult recently merged PRs when the local convention is unclear. Check template items only when the corresponding work is actually complete.

Identify the target repository, existing PR if any, and intended base and head. Read the actual diff against that base, together with relevant discussion and verification evidence. A failed PR lookup can mean an authentication or network error, not just that no PR exists. Distinguish those cases; do not hide the error or substitute `main`. For a new PR, establish the target branch from the request and repository context. If the target remains ambiguous, prepare what the available evidence supports and resolve that ambiguity before posting.

For an unfamiliar external contribution, look for prior issues or PRs when they may change the proposal's scope or rationale. Explain how the current proposal relates to those decisions. Describing the PR does not authorize new implementation work, such as adding a flag or an opt-out.

## Choose the explanation

Scale the description to the review risk and the decisions that need explanation, not the number of changed lines. A local fix may need only a short problem-and-result paragraph plus relevant validation. A one-line compatibility change can require migration guidance; a large generated diff may need very little prose.

- **Title:** name the action and affected behavior or component, using the repository's prefix convention. Prefer recognizable domain terms over artificial wording rules.
- **Opening:** explain the concrete problem or goal and the resulting behavior. A trigger and before/after example help when they make the effect easier to assess.
- **Design and impact:** explain consequential choices, compatibility effects, and tradeoffs. Include a deferred alternative or a limitation when it affects the review decision. For a temporary upstream workaround, link the upstream issue or PR and give the concrete removal condition.
- **Validation:** state what the available evidence actually establishes, including material gaps. Use measured numbers only with their source and conditions. Reuse checks that still apply to the described revision; rerun them only if changes or missing evidence justify it.
- **Reading guidance:** point to an entry file, use a diagram, show output, or add screenshots when that saves explanation or makes behavior assessable. A file table is useful only when reading order or relationships are otherwise difficult to follow.

Keep the observable change summary even when the diff also shows it. Omit mechanical file-by-file narration and work-session history. Lead with concrete behavior and reasons; avoid filler and repetitive framing. Section names and prose style follow the repository. Without a template, use only the headings that help the reader find the explanation and evidence.

Supporting logs or benchmarks can go in `<details>`; keep the rationale and important limitations visible without expansion. Link for depth while retaining the essential context in the description itself.

## Revise an existing PR

Describe the branch's current state against its intended base. Rewrite outdated scope rather than appending a changelog. Preserve relevant issue links, unresolved review decisions, and supporting evidence. When a change invalidates earlier verification, identify when it ran instead of presenting it as evidence for the current diff.

Use issue-closing keywords only when the change is intended to resolve that issue. Otherwise use a reference link. Follow the user's established attribution practice and repository requirements, preserving required credit and adding only truthful attribution.

## Apply the requested action

An existing request to create or update the PR is sufficient authorization for that action; do not request the same permission again. A request for wording alone calls for a proposed title and body. Resolve missing authorization or a materially ambiguous target only when needed, after preparing a reviewable result with the available information.

Create new PRs as drafts unless the user specifies otherwise. Updating a title or body preserves an existing PR's draft or ready state. Keep the update within the requested fields and scope.

Use a structured tool argument or a temporary UTF-8 file to preserve the body exactly. For the CLI, select the command matching the requested action after setting the variables from the verified target and prepared text:

```bash
gh pr create --repo "$pr_repo" --base "$pr_base" --head "$pr_head" --draft --title "$pr_title" --body-file "$pr_body_file"
```

The expected result is the URL of a new draft PR for the specified base and head. Omit `--draft` when the user requests a ready PR.

```bash
gh pr edit "$pr_number" --repo "$pr_repo" --title "$pr_title" --body-file "$pr_body_file"
```

The expected result is an updated title and body on the specified PR with its draft or ready state preserved. Omit a field option when that field is outside the request.

Report the PR URL and the action's actual outcome. If a write returns an ambiguous result, inspect the target before retrying so a successful creation is not duplicated.

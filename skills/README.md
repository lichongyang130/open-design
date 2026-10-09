# Skills

This directory contains **functional skills**: capabilities the agent invokes to do work on user input, such as briefs, audits, utilities, and asset packagers. Each folder has a `SKILL.md` and may include `assets/` or `references/`.

Rendering shapes for prototypes, decks, documents, images, video, and audio belong in [`design-templates/`](../design-templates/), not here. The classification rule and migration history live in [`specs/current/skills-and-design-templates.md`](../specs/current/skills-and-design-templates.md).

## Adding a skill

Read [`docs/skills-protocol.md`](../docs/skills-protocol.md) for frontmatter, discovery, precedence, and mode semantics. Copy the closest functional skill, keep the folder self-contained, and use an explicit `od.mode` appropriate for work performed on user input.

For a rendering template, follow [`docs/skills-contributing.md`](../docs/skills-contributing.md) and [`design-templates/AGENTS.md`](../design-templates/AGENTS.md) instead.

## License

Skills in this directory are Apache-2.0 unless their own `LICENSE` says otherwise. [`web-clone/`](web-clone/) is adapted from [Jane-xiaoer/claude-skill-web-clone](https://github.com/Jane-xiaoer/claude-skill-web-clone). The MIT-licensed `guizang-ppt` rendering template lives under [`design-templates/guizang-ppt/`](../design-templates/guizang-ppt/).

## Office problem-solving skills

- `spreadsheet-problem-solver/` is the single user-facing entry for real spreadsheet tasks. Its bundled scripts and tests handle conservative data cleaning, safe formula diagnostics, and key-based multi-table reconciliation without exposing separate helper-skill cards.

These skills are task-oriented: preserve the source file, make destructive changes only when explicitly requested, and report what was validated versus what still needs review.

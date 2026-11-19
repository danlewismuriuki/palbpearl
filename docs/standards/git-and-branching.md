# Git and branching

Status: Draft — awaiting review  
Owner: TBD

## Commit messages

Use **Conventional Commits** style: a short type prefix, optional scope, and a concise description. Common types:

- `docs:` — documentation only (for example, `docs: add project overview`)
- `chore:` — maintenance, tooling, or repo hygiene (for example, `chore: initialise skeleton`)
- `feat:` — new behaviour (for example, `feat: add farmer registration form`)
- `fix:` — bug fixes (for example, `fix: correct image upload validation`)
- `test:` — tests only (for example, `test: cover adapter error paths`)

Keep the subject line imperative and specific to one logical change.

## Branches

- Use **short-lived feature branches** named `type/short-description` (for example, `docs/standards-skeleton`, `feat/crop-upload-ui`).
- Prefer **one logical change per commit** so history stays easy to read and revert.
- Keep **documentation commits separate from code commits** when both change in the same effort, so docs-only reviews stay clean in early phases.

## Pull requests

- Open a **pull request** for merge to the default branch; do not bypass review for shared work.
- In early phases, **documentation is reviewed before code** is expected to follow the same standards.

## Secrets and environment

- **Never commit secrets** (API keys, passwords, private certificates, or production tokens).
- Document **which environment variables exist and what they are for** in approved documentation — not their values.
- Do not paste credentials into issues, pull requests, or markdown files.
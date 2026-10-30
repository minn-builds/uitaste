---

name: ship
description: Prepare a release (changeset, version, build, checks, release notes). Never publishes.
argument-hint: "<patch|minor|major>"
disable-model-invocation: true
---

Release type: $ARGUMENTS

1. Working tree must be clean; if not, stop.
2. Spawn `verifier` (full run). Stop on any failure.
3. `pnpm build`, then smoke test the packed CLI: `pnpm --filter uitaste pack`, install the tarball in a temp Vite app, run `uitaste init --preset editorial --yes` and `uitaste lint`.
4. Create a changeset for the changed packages with the given bump type; run `pnpm changeset version`.
5. Write release notes in `.uitaste/release-notes.md`: 3–6 user-facing bullets, plus a before/after image from `bench/out/` if one changed.
6. Commit `chore(release): vX.Y.Z`.
7. Tell me the exact commands to run myself: `git push --follow-tags` and `pnpm changeset publish`. Do NOT run them.

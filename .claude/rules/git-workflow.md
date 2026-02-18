# Git Workflow Rules

These rules protect the production site. The `main` branch auto-deploys to live via GitHub Actions — every push is immediately public. Follow these rules on every task, every time.

---

## Rule 1: Never Commit or Push to `main`

**`main` is the showroom floor. Branches are the repair bay.**

In a mechanic shop, you never rebuild an engine on the showroom floor in front of customers — you do the work in the repair bay, verify it's right, then roll the finished car out. Same principle here: all work happens on a feature branch; only finished, tested code gets merged into `main`.

- **Before any commit or push**, check the current branch with `git branch --show-current`
- If the current branch is `main`, **stop immediately**
- Explain to the user why committing to `main` is unsafe (auto-deploy = live site impact)
- Help the user create the correct branch first, then proceed

---

## Rule 2: Branch Naming Convention

Branch names must use one of these prefixes, followed by a short lowercase hyphenated description:

| Prefix | When to use |
|---|---|
| `feature/` | Adding new functionality |
| `fix/` | Fixing a bug or broken behavior |
| `chore/` | Maintenance, config, dependencies |
| `docs/` | Documentation only |
| `test/` | Adding or updating tests |
| `refactor/` | Restructuring code without changing behavior |

**Format:** `prefix/short-description-in-lowercase-hyphens`

**Good examples:**
- `feature/photographer-profile-page`
- `fix/booking-form-validation`
- `chore/update-dependencies`

**Bad examples (reject these):**
- `main` — never work here
- `my-branch` — no prefix
- `Feature/NewStuff` — uppercase not allowed
- `fix_login` — use hyphens not underscores

When starting a new task, always propose the correct branch name before any other action.

---

## Rule 3: Conventional Commit Format

Every commit message must follow this format:

```
type(scope): short description under 72 characters
```

**Allowed types** (must match the branch prefix):

| Type | Use for |
|---|---|
| `feat` | New feature (pairs with `feature/` branch) |
| `fix` | Bug fix (pairs with `fix/` branch) |
| `chore` | Maintenance tasks |
| `docs` | Documentation changes |
| `test` | Test additions or updates |
| `refactor` | Code restructuring |

**Scope** is optional but recommended — use the part of the app affected (e.g., `auth`, `gallery`, `booking`, `api`).

**Good examples:**
- `feat(gallery): add photo upload progress indicator`
- `fix(auth): redirect to login after session expires`
- `chore(deps): update express to 4.19.2`

**Reject vague messages like:**
- `"most recent"` — what changed?
- `"commits"` — not a description
- `"edit .env"` — what about it, and .env should never be committed
- `"fix stuff"` — be specific

If a proposed commit message is vague, ask the user what specifically changed and rewrite it to be descriptive.

---

## Rule 4: Manual Testing Checkpoint Before Any Push

**Before running `git push` or opening a PR, pause and ask the user to manually verify:**

```
Checkpoint — before we push, please:
1. Start the app locally (frontend + backend)
2. Test the feature or fix you just built
3. Click around related areas to check for regressions
4. Confirm "looks good" before I push

Ready to push? (yes / no)
```

Do not push until the user explicitly confirms. This pause exists because once pushed, GitHub Actions may trigger a deploy to the live site.

---

## Rule 5: Full Safe Workflow Checklist

Follow this order on every task:

1. **Check branch** — `git branch --show-current`; if on `main`, stop and create a branch
2. **Create branch** — use the correct `prefix/description` format from Rule 2
3. **Make small, focused commits** — one logical change per commit, using the format from Rule 3
4. **Manual testing checkpoint** — follow Rule 4 before pushing anything
5. **Push branch** — `git push -u origin branch-name`
6. **Open PR** — target `main`; write a clear PR title and description summarizing what changed and why
7. **Merge only after review** — do not merge without the user confirming the PR looks correct

**Never skip steps.** The goal is that `main` always reflects code the user has seen, tested, and approved.

# Dev Workflow Checklist

## 1. Understand
- [ ] Read the ticket / issue
- [ ] Reproduce the bug or clarify the feature
- [ ] Check for existing related PRs or issues

## 2. Investigate
- [ ] Find the relevant code
- [ ] Check git history for context (`git log`, `git blame`)
- [ ] Identify root cause

## 3. Plan
- [ ] Outline your approach
- [ ] Consider edge cases and side effects
- [ ] Break into smaller tasks if needed

## 4. Branch
- [ ] Pull latest main/develop
- [ ] Create a new branch (`fix/...` or `feat/...`)

## 5. Implement
- [ ] Write focused, small commits
- [ ] Follow existing code style
- [ ] Avoid unrelated changes

## 6. Test
- [ ] Write or update tests
- [ ] Run the full test suite
- [ ] Manually test happy path + edge cases

## 7. Self-Review
- [ ] Re-read your own diff
- [ ] Remove debug logs and dead code
- [ ] Clean up commit history if needed

## 8. Pull Request
- [ ] Write a clear PR description (what, why, how to test)
- [ ] Link the ticket
- [ ] Add screenshots for UI changes
- [ ] Assign reviewers

## 9. Review & Iterate
- [ ] Respond to all comments
- [ ] Push updates as needed

## 10. Merge
- [ ] All checks pass
- [ ] Required approvals received
- [ ] Merge and delete branch

## 11. Deploy & Verify
- [ ] Confirm deployment
- [ ] Check logs / error tracking
- [ ] Close the ticket

---

## Working With the Database Locally

Think of your databases like cars:
- **Local database** = a practice car in your garage — break it, wipe it, reset it, no consequences
- **Production database** (Render) = the car a customer is driving right now — only safe, tested changes

**The golden rule: `backend/.env` must always point at your local database, never the live Render database.**

### Starting the app (one command)

```bash
npm run dev
```

This starts the local database, backend server, and frontend dev server simultaneously.
You'll see `BACKEND` and `FRONTEND` labels in the terminal so you can tell them apart.

### Day-to-day database commands (run from project root)

| Command | What it does |
|---|---|
| `npm run db:seed` | Populates local DB with test users and photos |
| `npm run db:migrate` | Applies any new schema changes to your local DB |
| `npm run db:reset` | **Nuclear option** — wipes local DB, re-runs all migrations, then seeds |

### When you change the database schema

1. Edit `backend/prisma/schema.prisma`
2. Run `npm run db:migrate` — Prisma creates a migration file and applies it locally
3. Commit the migration file along with your schema change
4. When your PR merges to `main`, GitHub Actions deploys and runs `prisma migrate deploy` automatically — your changes are applied to the live Render database

### Resetting your local data

If your local database gets into a broken state (happens to everyone), run:

```bash
npm run db:reset
```

This wipes the local database entirely and re-runs every migration from scratch, then seeds fresh test data.
The test accounts after seeding are:
- `user@example.com` / `password123`
- `photographer@example.com` / `password123`

### Generating a secure JWT secret

The placeholder `JWT_SECRET` in `.env` is not safe for production. Generate a real one:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Paste the output into:
- `backend/.env` for your local environment
- The Render dashboard → Environment → `JWT_SECRET` for production
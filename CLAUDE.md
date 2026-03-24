# Claude Code Instructions

## Deployment Workflow

**Always work on a feature branch and open a PR into `staging` — never push directly to `staging` or `main`.**

1. Create a feature branch from `staging` (e.g. `feature/description`)
2. Make changes on the feature branch
3. Open a PR from the feature branch into `staging`
4. Staging deploys automatically for review — share with client or review yourself
5. Once approved, merge `staging` into `main` for production

### Branch structure
- `main` — production (live site)
- `staging` — staging/preview environment (review before going live)
- `feature/*` — short-lived branches for individual changes, always PR'd into `staging`

### Example flow
```bash
git checkout -b feature/my-change origin/staging
# ... make changes ...
git push origin feature/my-change
gh pr create --base staging --title "My change" --body "..."
# ... review on staging, get client approval ...
# ... merge staging into main when ready to go live ...
```

Never push directly to `staging` or `main`.

## Keeping Staging in Sync with Main

After every `staging` → `main` merge, fast-forward staging to match main:

```bash
git push origin origin/main:refs/heads/staging
```

This prevents the "1 commit behind" drift on GitHub. Always run this after a production deploy.

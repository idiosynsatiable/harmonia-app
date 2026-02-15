# Git History Secret Purge

If secrets have been committed to git history (like `.env.production`), simply deleting them in a new commit is not enough. You must purge them from history.

## Prerequisites
Install `git-filter-repo`:
```bash
# On macOS
brew install git-filter-repo

# On Linux
sudo apt-get install git-filter-repo
```

## Purge Steps

### 1. Purge specific files
Run this from the root of your local repository:
```bash
git filter-repo --path .env.production --invert-paths
```

### 2. Force push to remote
**Warning:** This rewrites history. Coordinate with your team.
```bash
git push origin --force --all
git push origin --force --tags
```

### 3. Verify
Check your GitHub repository history to ensure `.env.production` is no longer accessible in any past commits.

## Alternative: BFG Repo-Cleaner
If `git-filter-repo` is unavailable:
```bash
bfg --delete-files .env.production
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push origin --force
```

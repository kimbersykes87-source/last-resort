# Reviewing Changes Locally Before Pushing

## Quick Commands

### 1. See What Files Changed

```bash
git status
```

Shows:
- Modified files
- New files (untracked)
- Deleted files
- Files staged for commit

### 2. See What Changed in Files

**View all changes:**
```bash
git diff
```

**View changes in a specific file:**
```bash
git diff app.js
git diff index.html
```

**View staged changes (after `git add`):**
```bash
git diff --staged
```

### 3. Test Locally

**Start development server:**
```bash
npm run dev
```

Then:
- Open `http://localhost:8080` in browser
- Test all functionality
- Check browser console for errors
- Verify changes work as expected

### 4. Review Changes Step by Step

**See changes with line numbers:**
```bash
git diff -U5
```

**See changes in a more readable format:**
```bash
git diff --color-words
```

**See summary of changes:**
```bash
git diff --stat
```

## Recommended Workflow

### Step 1: Make Your Changes
- Edit files as needed
- Save all files

### Step 2: Review What Changed
```bash
# See what files changed
git status

# See the actual changes
git diff
```

### Step 3: Test Locally
```bash
# Start dev server
npm run dev

# Test in browser at http://localhost:8080
# - Test all features
# - Check console for errors
# - Verify everything works
```

### Step 4: Stage Changes Selectively
```bash
# Stage specific files
git add app.js
git add index.html

# Or stage all changes
git add .

# Review what's staged
git diff --staged
```

### Step 5: Commit
```bash
git commit -m "Description of changes"
```

### Step 6: Review Before Push
```bash
# See what will be pushed
git log origin/main..HEAD

# See the diff of what will be pushed
git diff origin/main..HEAD
```

### Step 7: Push
```bash
git push
```

## Advanced Review Options

### Compare with Remote
```bash
# See what's different from remote
git diff origin/main

# See what commits are local only
git log origin/main..HEAD
```

### Review Specific File Changes
```bash
# See changes with context (5 lines before/after)
git diff -U5 app.js

# See only additions/deletions summary
git diff --stat app.js
```

### Undo Changes (if needed)
```bash
# Discard changes in a file (before staging)
git checkout -- app.js

# Unstage a file (after git add)
git reset HEAD app.js

# Discard all uncommitted changes
git reset --hard HEAD
```

## Using Git GUI Tools

If you prefer a visual interface:

**Windows:**
- **GitHub Desktop** - Free, user-friendly
- **SourceTree** - Free, powerful
- **VS Code Git Extension** - Built into VS Code

**All Platforms:**
- **VS Code** - Built-in Git support
- **GitKraken** - Beautiful Git GUI

## VS Code Git Features

If using VS Code:

1. **Source Control Panel** (Ctrl+Shift+G)
   - See all changed files
   - Click file to see diff
   - Stage/unstage files
   - Commit with message

2. **Diff View**
   - Click any file in Source Control
   - See side-by-side comparison
   - Green = additions, Red = deletions

3. **Timeline View**
   - Right-click file → "Open Timeline"
   - See file history and changes

## Best Practices

1. **Review before staging**
   ```bash
   git diff  # Review changes
   git add . # Then stage
   ```

2. **Review after staging**
   ```bash
   git diff --staged  # Review what will be committed
   ```

3. **Test before committing**
   - Always test locally with `npm run dev`
   - Fix issues before committing

4. **Small, focused commits**
   - Commit related changes together
   - Write clear commit messages

5. **Review before pushing**
   ```bash
   git log origin/main..HEAD  # See commits to push
   git diff origin/main..HEAD  # See all changes
   ```

## Example Workflow

```bash
# 1. Make changes to app.js
# 2. Review changes
git diff app.js

# 3. Test locally
npm run dev
# Test in browser...

# 4. If everything looks good, stage
git add app.js

# 5. Review staged changes
git diff --staged

# 6. Commit
git commit -m "Update API error handling"

# 7. Review what will be pushed
git log origin/main..HEAD

# 8. Push
git push
```

## Quick Reference

| Command | What it does |
|---------|-------------|
| `git status` | See what files changed |
| `git diff` | See all changes (unstaged) |
| `git diff --staged` | See staged changes |
| `git diff app.js` | See changes in specific file |
| `git diff origin/main` | Compare with remote |
| `git log origin/main..HEAD` | See local commits not pushed |
| `git diff origin/main..HEAD` | See all changes to be pushed |

## Tips

- **Always test locally** before committing
- **Review diffs** to catch mistakes
- **Use clear commit messages**
- **Commit often** with small, logical changes
- **Review before push** to avoid pushing mistakes


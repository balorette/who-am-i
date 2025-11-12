# GitHub Repository Setup Guide

This guide walks through configuring GitHub repository settings for secure CI/CD deployments.

## Prerequisites

- Repository owner/admin access to `balorette/who-am-i`
- AWS IAM Role ARN from AWS setup guide
- S3 bucket name
- CloudFront distribution ID
- AWS region

---

## Step 1: Configure Repository Secrets and Variables

Secrets and variables store configuration for GitHub Actions workflows.

### 1.1 Navigate to Repository Settings

1. Go to your repository: https://github.com/balorette/who-am-i
2. Click **Settings** tab
3. In left sidebar, expand **Secrets and variables**
4. Click **Actions**

### 1.2 Add Repository Secrets

Click **New repository secret** for each:

**Secret Name:** `AWS_ROLE_ARN`
**Value:** Your IAM role ARN (from AWS setup)
```
arn:aws:iam::123456789012:role/GitHubActionsDeployRole
```

Click **Add secret**

### 1.3 Add Repository Variables

Click **Variables** tab, then **New repository variable** for each:

**Variable Name:** `AWS_REGION`
**Value:** Your AWS region
```
us-east-2
```

**Variable Name:** `S3_BUCKET_NAME`
**Value:** Your S3 bucket name
```
who-am-i-static-site
```

**Variable Name:** `CLOUDFRONT_DISTRIBUTION_ID`
**Value:** Your CloudFront distribution ID
```
E1ABCDEFGHIJK
```

Click **Add variable** for each

### 1.4 Verify Configuration

You should see:

**Secrets:**
- `AWS_ROLE_ARN` (hidden value)

**Variables:**
- `AWS_REGION` = `us-east-2`
- `S3_BUCKET_NAME` = `who-am-i-static-site`
- `CLOUDFRONT_DISTRIBUTION_ID` = `E1ABCDEFGHIJK`

✅ **Checkpoint:** Repository secrets and variables configured

---

## Step 2: Configure Branch Protection Rules

Protect the `main` branch from direct pushes and require PR reviews.

### 2.1 Navigate to Branch Protection

1. In repository **Settings**
2. Click **Branches** in left sidebar
3. Under **Branch protection rules**, click **Add rule** (or **Add branch protection rule**)

### 2.2 Configure Branch Name Pattern

**Branch name pattern:** `main`

This applies the rules to your main branch.

### 2.3 Enable Required Settings

Check the following boxes:

#### ☑ Require a pull request before merging

- **Require approvals:** 1
- ☑ **Dismiss stale pull request approvals when new commits are pushed**
- ☑ **Require review from Code Owners** (if using CODEOWNERS file)

#### ☑ Require status checks to pass before merging

- ☑ **Require branches to be up to date before merging**
- In the search box, type `build` and select it (this is the build job from your workflow)
  - **Note:** You may need to trigger the workflow once before this status check appears

#### ☑ Require conversation resolution before merging

- Ensures all PR comments are resolved

#### ☑ Include administrators

- Enforces rules even for repository admins (best practice)
- You'll need to go through the PR process too

#### ☑ Restrict who can push to matching branches

- **Restrict pushes that create matching branches:** ☑
- Leave the "Who can push?" section empty (no one can push directly)
- All changes must go through pull requests

### 2.4 Save Branch Protection Rule

Scroll down and click **Create** (or **Save changes**)

✅ **Checkpoint:** Branch protection rules configured for main

---

## Step 3: Configure Repository Settings

Additional security and workflow settings.

### 3.1 General Settings

1. In **Settings**, click **General**
2. Scroll to **Pull Requests** section
3. Configure:
   - ☑ **Allow squash merging** (keeps history clean)
   - ☑ **Always suggest updating pull request branches**
   - ☑ **Automatically delete head branches** (cleans up after merge)

### 3.2 Actions Settings

1. In **Settings**, expand **Actions** in left sidebar
2. Click **General**
3. Under **Actions permissions:**
   - Select **Allow all actions and reusable workflows**
4. Under **Workflow permissions:**
   - Select **Read repository contents and packages permissions**
   - ☑ **Allow GitHub Actions to create and approve pull requests** (uncheck this for security)

Click **Save**

### 3.3 Enable Required Workflows

1. Under **Actions**, click **Workflow**
2. Ensure the deploy workflow is enabled

✅ **Checkpoint:** Repository settings configured

---

## Step 4: Verify CODEOWNERS File

Ensure the CODEOWNERS file is properly configured.

### 4.1 Check File Exists

Verify `.github/CODEOWNERS` exists in your repository with:

```
* @balorette
/.github/ @balorette
/docs/ @balorette
```

### 4.2 Test Code Ownership

1. Create a test PR
2. Verify you're automatically assigned as a reviewer

✅ **Checkpoint:** CODEOWNERS working correctly

---

## Step 5: Test the CI/CD Pipeline

Verify everything works end-to-end.

### 5.1 Create a Test Branch

```bash
git checkout -b test-cicd-pipeline
```

### 5.2 Make a Small Change

```bash
echo "<!-- CI/CD test -->" >> README.md
git add README.md
git commit -m "test: verify CI/CD pipeline"
git push -u origin test-cicd-pipeline
```

### 5.3 Create Pull Request

1. Go to your repository on GitHub
2. Click **Compare & pull request**
3. Create the PR

### 5.4 Verify Build Job Runs

1. Go to **Actions** tab
2. You should see the workflow running
3. **Build** job should execute:
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Run linter
   - Build site
   - Upload artifact

**Expected:** Build job passes ✅

### 5.5 Verify Deploy Job Does Not Run

The **Deploy** job should be skipped because this is a PR (not a merge to main).

**Expected:** Deploy job shows as skipped or doesn't appear

### 5.6 Verify PR Status Check

1. Go back to your PR
2. At the bottom, you should see:
   - ✅ **Build** — passed
   - Status checks must pass before merging

### 5.7 Merge the PR

1. Approve the PR (if required)
2. Click **Merge pull request**
3. Click **Confirm merge**

### 5.8 Verify Deployment

1. Go to **Actions** tab
2. Find the workflow run triggered by the merge
3. Both jobs should run:
   - ✅ **Build** — passed
   - ✅ **Deploy** — passed

4. Check the deploy job logs for:
   - "Configured AWS credentials"
   - "Syncing files to S3"
   - "Creating CloudFront invalidation"

### 5.9 Verify Site Updates

1. Wait 1-2 minutes for CloudFront invalidation
2. Visit your site through CloudFront
3. Hard refresh (Ctrl+Shift+R)
4. Verify the change is live

✅ **Checkpoint:** CI/CD pipeline working end-to-end

---

## Security Best Practices

### Secrets Management

- **Never commit secrets to git** (use GitHub secrets)
- **Rotate AWS IAM role periodically** (change trust policy conditions)
- **Audit secret access** (check who has access in Settings)
- **Use least-privilege permissions** (don't give more access than needed)

### Branch Protection

- **Enforce for administrators** (no exceptions)
- **Require status checks** (don't merge broken code)
- **Require PR reviews** (two pairs of eyes on every change)
- **Resolve conversations** (don't leave questions unanswered)

### Workflow Security

- **Pin action versions** (use `@v4` instead of `@main`)
- **Restrict permissions** (use `permissions:` block)
- **Validate inputs** (don't trust user-provided data)
- **Audit workflow runs** (check Actions tab regularly)

### Access Control

- **Limit repository access** (only necessary collaborators)
- **Use CODEOWNERS** (require expert reviews)
- **Review outside contributors** (be cautious with forks)
- **Enable 2FA** (protect your GitHub account)

---

## Troubleshooting

### Build job fails with "npm ERR!"

**Cause:** Dependency installation or build error

**Solutions:**
1. Check if the build works locally: `npm run build`
2. Verify `package-lock.json` is committed
3. Check Node.js version matches (workflow uses v20)
4. Review build logs in Actions tab for specific error

### Deploy job doesn't run on merge

**Cause:** Condition not met or job dependency failed

**Solutions:**
1. Verify you merged to `main` branch (not another branch)
2. Check build job passed (deploy depends on build)
3. Review workflow file condition: `if: github.ref == 'refs/heads/main' && github.event_name == 'push'`

### "Error: Credentials could not be loaded"

**Cause:** OIDC authentication failed

**Solutions:**
1. Verify `AWS_ROLE_ARN` secret is set correctly
2. Check IAM role trust policy allows your repo
3. Ensure `id-token: write` permission in workflow
4. Verify OIDC provider exists in AWS IAM

### "Access Denied" when syncing to S3

**Cause:** IAM role lacks S3 permissions

**Solutions:**
1. Check IAM role has `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` permissions
2. Verify resource ARN matches your bucket exactly
3. Check bucket name in GitHub variables is correct

### Status check "build" not appearing in branch protection

**Cause:** Workflow hasn't run yet or job name mismatch

**Solutions:**
1. Trigger the workflow at least once
2. Wait a few minutes for GitHub to register the status check
3. Verify job name in workflow is exactly `build`
4. Check workflow file is on the main branch

### Changes deployed but not visible on site

**Cause:** CloudFront cache or invalidation issue

**Solutions:**
1. Check invalidation was created in CloudFront console
2. Wait 1-2 minutes for invalidation to complete
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Try incognito/private browsing mode
5. Verify files uploaded to S3 correctly

---

## Maintenance

### Regular Tasks

- **Review workflow runs** (weekly)
- **Check for action updates** (monthly)
- **Audit repository access** (quarterly)
- **Rotate AWS credentials** (if using access keys - not needed with OIDC)
- **Review CloudFront costs** (monthly)

### Updating the Workflow

1. Create a new branch
2. Edit `.github/workflows/deploy.yml`
3. Create PR and test
4. Review changes carefully
5. Merge only after verification

### Rolling Back a Deployment

If a deployment breaks the site:

**Option 1: Revert the commit**
```bash
git revert HEAD
git push origin main
```
This triggers a new deployment with the previous code.

**Option 2: Use S3 versioning** (if enabled)
1. Go to S3 console
2. Find the object (e.g., `index.html`)
3. Click **Versions**
4. Select previous version
5. Click **Actions** → **Make latest version**

**Option 3: Redeploy from previous commit**
```bash
git checkout <previous-commit-hash>
git checkout -b rollback
git push origin rollback
# Create PR to merge rollback branch to main
```

---

## Next Steps

- Monitor first few deployments closely
- Set up CloudWatch alerts for S3/CloudFront errors (optional)
- Consider adding automated tests to workflow
- Document any project-specific deployment steps

---

## References

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

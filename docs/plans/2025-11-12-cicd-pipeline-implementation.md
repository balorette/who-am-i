# CI/CD Pipeline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement secure GitHub Actions CI/CD pipeline with AWS deployment and comprehensive documentation.

**Architecture:** Two-job GitHub Actions workflow (build + deploy) using OIDC authentication to AWS. S3 bucket secured with CloudFront OAC, branch protection on main, comprehensive step-by-step documentation for AWS and GitHub setup.

**Tech Stack:** GitHub Actions, AWS S3, AWS CloudFront, AWS IAM OIDC, Next.js static export

---

## Task 1: Create GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create workflow file with build job**

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to AWS S3

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

# Restrict permissions to minimum required
permissions:
  contents: read
  id-token: write  # Required for OIDC authentication

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Build Next.js site
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out/
          retention-days: 1

  deploy:
    name: Deploy to S3
    runs-on: ubuntu-latest
    needs: build
    # Only deploy on push to main branch
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Download build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out/

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Sync files to S3
        run: |
          aws s3 sync out/ s3://${{ vars.S3_BUCKET_NAME }}/ \
            --delete \
            --cache-control "public, max-age=31536000, immutable" \
            --exclude "*.html" \
            --exclude "sitemap.xml" \
            --exclude "robots.txt"

          # HTML files and other dynamic content with shorter cache
          aws s3 sync out/ s3://${{ vars.S3_BUCKET_NAME }}/ \
            --exclude "*" \
            --include "*.html" \
            --include "sitemap.xml" \
            --include "robots.txt" \
            --cache-control "public, max-age=0, must-revalidate"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ vars.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

**Step 2: Commit workflow file**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions CI/CD workflow with OIDC"
```

---

## Task 2: Create CODEOWNERS File

**Files:**
- Create: `.github/CODEOWNERS`

**Step 1: Create CODEOWNERS file**

Create `.github/CODEOWNERS`:

```
# Default owner for everything in the repo
* @balorette

# Documentation requires review
/docs/ @balorette

# CI/CD changes require review
/.github/ @balorette
```

**Step 2: Commit CODEOWNERS file**

```bash
git add .github/CODEOWNERS
git commit -m "feat: add CODEOWNERS file for PR reviews"
```

---

## Task 3: Create AWS Setup Documentation

**Files:**
- Create: `docs/deployment/AWS_SETUP.md`

**Step 1: Create AWS setup documentation**

Create `docs/deployment/AWS_SETUP.md`:

```markdown
# AWS Infrastructure Setup Guide

This guide walks through setting up AWS infrastructure for secure static site hosting with S3 and CloudFront.

## Architecture Overview

```
GitHub Actions (OIDC)
        ↓ (assumes IAM role)
    IAM Role (GitHubActionsDeployRole)
        ↓ (writes to)
    S3 Bucket (static site files)
        ↓ (served via)
    CloudFront Distribution (OAC authentication)
        ↓ (serves to)
    End Users (HTTPS only)
```

**Security Model:**
- S3 bucket blocks ALL public access
- CloudFront uses Origin Access Control (OAC) to authenticate to S3
- IAM role scoped to specific repository and main branch only
- No long-lived credentials anywhere

---

## Prerequisites

- AWS Account with admin access
- Your S3 bucket name (e.g., `who-am-i-static-site`)
- Your CloudFront distribution ID (e.g., `E1ABCDEFGHIJK`)
- Your GitHub repository (e.g., `balorette/who-am-i`)
- AWS CLI installed (optional, for verification)

---

## Step 1: Create IAM OIDC Identity Provider

This allows GitHub Actions to authenticate to AWS without storing credentials.

### 1.1 Navigate to IAM Console

1. Go to AWS Console: https://console.aws.amazon.com/iam/
2. Click **Identity providers** in left sidebar
3. Click **Add provider**

### 1.2 Configure OIDC Provider

**Provider type:** OpenID Connect

**Provider URL:** `https://token.actions.githubusercontent.com`

**Audience:** `sts.amazonaws.com`

Click **Get thumbprint** (AWS auto-detects GitHub's certificate)

Click **Add provider**

### 1.3 Verify Provider Creation

You should see the provider listed:
- **Provider:** `token.actions.githubusercontent.com`
- **Audiences:** `sts.amazonaws.com`

✅ **Checkpoint:** OIDC provider created successfully

---

## Step 2: Create IAM Role for GitHub Actions

This role will be assumed by GitHub Actions to deploy to S3.

### 2.1 Navigate to IAM Roles

1. In IAM Console, click **Roles** in left sidebar
2. Click **Create role**

### 2.2 Configure Trust Relationship

**Trusted entity type:** Web identity

**Identity provider:** Select `token.actions.githubusercontent.com`

**Audience:** Select `sts.amazonaws.com`

Click **Next**

### 2.3 Skip Permissions (We'll Add Later)

Click **Next** (skip attaching policies for now)

### 2.4 Name the Role

**Role name:** `GitHubActionsDeployRole`

**Description:** `Role for GitHub Actions to deploy static site to S3/CloudFront`

Click **Create role**

### 2.5 Edit Trust Policy

1. Click on the newly created role `GitHubActionsDeployRole`
2. Click **Trust relationships** tab
3. Click **Edit trust policy**
4. Replace the trust policy with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:balorette/who-am-i:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

**IMPORTANT:** Replace `YOUR_ACCOUNT_ID` with your AWS account ID (12 digits).

**Security Note:** The `StringLike` condition restricts this role to ONLY be assumed by the `main` branch of `balorette/who-am-i` repository. This prevents fork attacks.

Click **Update policy**

### 2.6 Add Permissions Policy

1. Click **Permissions** tab
2. Click **Add permissions** → **Create inline policy**
3. Click **JSON** tab
4. Paste the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3DeploymentAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
    }
  ]
}
```

**IMPORTANT:** Replace:
- `YOUR_BUCKET_NAME` with your S3 bucket name
- `YOUR_ACCOUNT_ID` with your AWS account ID
- `YOUR_DISTRIBUTION_ID` with your CloudFront distribution ID

**Policy name:** `GitHubActionsDeployPolicy`

Click **Create policy**

### 2.7 Copy Role ARN

1. On the role summary page, copy the **ARN** (looks like: `arn:aws:iam::123456789012:role/GitHubActionsDeployRole`)
2. Save this - you'll need it for GitHub secrets

✅ **Checkpoint:** IAM role created with trust policy and permissions

---

## Step 3: Secure S3 Bucket

Configure your existing S3 bucket to block public access and only allow CloudFront.

### 3.1 Navigate to S3 Console

1. Go to: https://s3.console.aws.amazon.com/s3/
2. Click on your bucket name

### 3.2 Block All Public Access

1. Click **Permissions** tab
2. Under **Block public access (bucket settings)**, click **Edit**
3. **Check ALL boxes:**
   - ☑ Block all public access
   - ☑ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☑ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☑ Block public access to buckets and objects granted through new public bucket or access point policies
   - ☑ Block public and cross-account access to buckets and objects through any public bucket or access point policies
4. Click **Save changes**
5. Type `confirm` and click **Confirm**

✅ **Checkpoint:** S3 bucket blocks all public access

### 3.3 Configure Bucket Encryption (Optional but Recommended)

1. Click **Properties** tab
2. Under **Default encryption**, click **Edit**
3. Select **Server-side encryption with Amazon S3 managed keys (SSE-S3)**
4. Click **Save changes**

### 3.4 Enable Bucket Versioning (Optional but Recommended)

1. Click **Properties** tab
2. Under **Bucket Versioning**, click **Edit**
3. Select **Enable**
4. Click **Save changes**

**Note:** Versioning allows you to rollback to previous versions if needed.

---

## Step 4: Configure CloudFront Origin Access Control (OAC)

Replace legacy Origin Access Identity with modern Origin Access Control.

### 4.1 Navigate to CloudFront Console

1. Go to: https://console.aws.amazon.com/cloudfront/
2. Click on your distribution ID

### 4.2 Create Origin Access Control

1. Click **Origin access** in left sidebar (or find under Settings)
2. Click **Create control setting** (or **Create new OAC**)
3. Configure:
   - **Name:** `who-am-i-s3-oac`
   - **Description:** `OAC for who-am-i static site`
   - **Signing behavior:** Sign requests (recommended)
   - **Origin type:** S3
4. Click **Create**

### 4.3 Update CloudFront Distribution Origin

1. Go back to your distribution
2. Click **Origins** tab
3. Select your S3 origin, click **Edit**
4. Under **Origin access:**
   - Select **Origin access control settings (recommended)**
   - **Origin access control:** Select the OAC you just created (`who-am-i-s3-oac`)
5. Click **Save changes**

**Note:** You'll see a banner saying "The S3 bucket policy needs to be updated". We'll do that next.

### 4.4 Copy the Bucket Policy Statement

CloudFront provides the exact policy statement you need. Copy it from the banner or:

1. Click the **info icon** or **Copy policy** button
2. The policy should look like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

### 4.5 Update S3 Bucket Policy

1. Go back to S3 console: https://s3.console.aws.amazon.com/s3/
2. Click on your bucket
3. Click **Permissions** tab
4. Under **Bucket policy**, click **Edit**
5. Paste the policy statement copied from CloudFront
6. Click **Save changes**

✅ **Checkpoint:** CloudFront OAC configured and S3 bucket policy updated

---

## Step 5: Verify Security Configuration

### 5.1 Test Direct S3 Access (Should Fail)

Try to access your S3 bucket directly:

```
https://YOUR_BUCKET_NAME.s3.YOUR_REGION.amazonaws.com/index.html
```

**Expected Result:** 403 Forbidden or Access Denied

### 5.2 Test CloudFront Access (Should Work)

Access your site through CloudFront:

```
https://YOUR_CLOUDFRONT_DOMAIN/
```

**Expected Result:** Your site loads successfully

### 5.3 Verify OIDC Trust Policy

Using AWS CLI (optional):

```bash
aws iam get-role --role-name GitHubActionsDeployRole --query 'Role.AssumeRolePolicyDocument'
```

Verify the `sub` condition restricts to your repo and main branch.

✅ **Checkpoint:** Security configuration verified

---

## Cost Estimates

**Monthly costs for a personal site with moderate traffic:**

- **S3 Storage:** $0.023/GB (~$0.05/month for 2GB)
- **S3 Requests:** Minimal (PUT requests from CI/CD ~$0.01/month)
- **CloudFront:** 1TB free tier per month (first year), then $0.085/GB
- **CloudFront Invalidations:** First 1,000 paths free/month (~$0.00 with wildcard `/*`)
- **Data Transfer:** Minimal for personal site

**Estimated Total:** ~$1-5/month after free tier expires

---

## Security Checklist

Before going live, verify:

- [ ] S3 bucket has "Block all public access" enabled
- [ ] S3 bucket policy only allows CloudFront service principal
- [ ] S3 bucket policy includes `AWS:SourceArn` condition with your distribution
- [ ] CloudFront distribution uses OAC (not deprecated OAI)
- [ ] IAM OIDC provider created for `token.actions.githubusercontent.com`
- [ ] IAM role trust policy scoped to specific repo and main branch
- [ ] IAM role permissions limited to specific bucket and distribution (no wildcards)
- [ ] Direct S3 URLs return 403 Forbidden
- [ ] CloudFront URLs serve content successfully
- [ ] Bucket encryption enabled (optional but recommended)
- [ ] Bucket versioning enabled (optional but recommended)

---

## Troubleshooting

### "Access Denied" when GitHub Actions tries to deploy

**Cause:** Trust policy or permissions issue

**Solutions:**
1. Verify IAM role ARN matches what's in GitHub secrets
2. Check trust policy `sub` condition matches your repo exactly
3. Ensure `id-token: write` permission in workflow file
4. Verify permissions policy includes your exact bucket name

### CloudFront serves 403 errors

**Cause:** S3 bucket policy not updated for OAC

**Solutions:**
1. Check S3 bucket policy includes CloudFront service principal
2. Verify `AWS:SourceArn` condition matches your distribution ARN
3. Ensure OAC is attached to the CloudFront origin

### Deployment succeeds but changes not visible

**Cause:** CloudFront cache not invalidated

**Solutions:**
1. Check invalidation was created: `aws cloudfront list-invalidations --distribution-id YOUR_ID`
2. Wait a few minutes for invalidation to complete
3. Hard refresh browser (Ctrl+Shift+R)
4. Check cache-control headers on uploaded files

### "No such bucket" error

**Cause:** S3 bucket name mismatch

**Solutions:**
1. Verify bucket name in GitHub variables matches actual bucket
2. Check bucket exists in correct AWS region
3. Ensure no typos in bucket name

---

## References

- [AWS IAM OIDC Identity Providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [CloudFront Origin Access Control](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [S3 Bucket Policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-policies.html)
```

**Step 2: Commit AWS documentation**

```bash
git add docs/deployment/AWS_SETUP.md
git commit -m "docs: add comprehensive AWS setup guide with security hardening"
```

---

## Task 4: Create GitHub Setup Documentation

**Files:**
- Create: `docs/deployment/GITHUB_SETUP.md`

**Step 1: Create GitHub setup documentation**

Create `docs/deployment/GITHUB_SETUP.md`:

```markdown
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
```

**Step 2: Commit GitHub documentation**

```bash
git add docs/deployment/GITHUB_SETUP.md
git commit -m "docs: add comprehensive GitHub setup guide with branch protection"
```

---

## Task 5: Create Main CI/CD Pipeline Documentation

**Files:**
- Create: `docs/deployment/CICD_PIPELINE.md`

**Step 1: Create main pipeline documentation**

Create `docs/deployment/CICD_PIPELINE.md`:

```markdown
# CI/CD Pipeline Documentation

## Overview

This document describes the automated CI/CD pipeline for deploying the Next.js static site to AWS S3/CloudFront using GitHub Actions.

## Architecture

```
Developer creates PR
  ↓
GitHub Actions: Build Job
  • Checkout code
  • Install dependencies (with cache)
  • Run linter
  • Build Next.js site
  • Upload build artifact
  ↓
PR Status Check (✅ or ❌)
  ↓
[If merged to main]
  ↓
GitHub Actions: Deploy Job
  • Download build artifact
  • Authenticate to AWS via OIDC
  • Sync files to S3 (with cache headers)
  • Invalidate CloudFront cache
  ↓
Site updated (live in ~2 minutes)
```

## How It Works

### Trigger Events

The pipeline runs on two events:

1. **Pull Request to `main`** → Build only (no deployment)
2. **Push to `main`** (merge) → Build + Deploy

### Build Job (Always Runs)

**Purpose:** Validate the code builds successfully

**Steps:**
1. Checks out repository code
2. Sets up Node.js v20 with npm cache
3. Installs dependencies (`npm ci`)
4. Runs linter (`npm run lint`)
5. Builds Next.js site (`npm run build`)
6. Uploads `out/` directory as artifact (retained for 1 day)

**Runtime:** ~2-4 minutes

**Permissions:** Read-only to repository

### Deploy Job (Only on Main Branch)

**Purpose:** Deploy validated build to production

**Conditions:**
- Only runs if build job succeeds
- Only runs on `main` branch
- Only runs on `push` event (not PRs)

**Steps:**
1. Downloads build artifact from build job
2. Configures AWS credentials via OIDC (no stored secrets)
3. Syncs files to S3 with optimized cache headers:
   - Static assets (JS, CSS, images): 1 year cache
   - HTML, sitemap, robots.txt: No cache (always fresh)
4. Deletes removed files from S3 (`--delete` flag)
5. Creates CloudFront invalidation for `/*` (all paths)

**Runtime:** ~1-2 minutes

**Permissions:** Assume AWS IAM role via OIDC

## Security Model

### Authentication: OIDC (No Stored Credentials)

- GitHub Actions requests temporary credentials from AWS
- AWS validates request against OIDC trust policy
- Credentials valid for 1 hour, auto-expire
- No long-lived credentials stored anywhere

### Authorization: Least-Privilege IAM Role

The IAM role can ONLY:
- Write to specific S3 bucket
- Invalidate specific CloudFront distribution
- Nothing else

### Branch Protection

- Direct pushes to `main` blocked
- All changes via pull requests
- Build must pass before merge
- PR review required (from CODEOWNERS)

### Workflow Permissions

```yaml
permissions:
  contents: read      # Read repository only
  id-token: write     # Generate OIDC token for AWS
```

No write permissions to repository or other resources.

## Cache Strategy

### S3 Cache-Control Headers

**Static Assets** (immutable):
- JS bundles, CSS files, images, fonts
- `cache-control: public, max-age=31536000, immutable`
- Cached for 1 year (safe due to content-hash filenames)

**Dynamic Content** (always fresh):
- HTML pages, sitemap, robots.txt
- `cache-control: public, max-age=0, must-revalidate`
- Always revalidated with origin

### CloudFront Invalidation

- Invalidates all paths (`/*`) on every deployment
- Ensures immediate visibility of changes
- Cost: Free for first 1,000 paths/month (single wildcard = 1 path)

## Monitoring

### GitHub Actions UI

**Location:** Repository → Actions tab

**What to Monitor:**
- Build success/failure rate
- Deploy success/failure rate
- Build duration trends
- Deploy duration trends

### Pull Request Status Checks

**On every PR:**
- ✅ Build passed → Safe to merge
- ❌ Build failed → Don't merge (fix issues first)

### Notifications

**You receive notifications for:**
- Workflow failures (via GitHub notifications)
- PR status check failures
- Email notifications (if configured)

## Troubleshooting

### Build Fails on PR

**Common Causes:**
1. Linting errors
2. TypeScript errors
3. Build errors (missing dependencies, syntax errors)
4. Out-of-date dependencies

**Solutions:**
1. Run `npm run lint` locally to see linting errors
2. Run `npm run build` locally to reproduce build errors
3. Check Actions logs for detailed error messages
4. Fix errors and push new commit to PR branch

### Deploy Fails After Merge

**Common Causes:**
1. AWS authentication failure (OIDC)
2. S3 permission denied
3. CloudFront invalidation failure
4. Network timeout

**Solutions:**
1. Check IAM role ARN in GitHub secrets
2. Verify IAM role permissions include S3 and CloudFront
3. Check S3 bucket name in GitHub variables
4. Review deploy job logs in Actions tab
5. See AWS_SETUP.md and GITHUB_SETUP.md for detailed troubleshooting

### Changes Not Visible After Deploy

**Cause:** CloudFront cache or browser cache

**Solutions:**
1. Wait 1-2 minutes for CloudFront invalidation
2. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
3. Try incognito/private browsing
4. Check S3 bucket to verify files uploaded
5. Check CloudFront invalidations in AWS console

### Slow Deployments

**Common Causes:**
1. Large build output
2. Many files to sync
3. CloudFront invalidation delay

**Optimizations:**
1. Enable npm cache (already configured)
2. Optimize build output size
3. Consider regional CloudFront functions for faster updates

## Rolling Back

If a deployment breaks the site, you can roll back:

### Option 1: Revert Commit (Fastest)

```bash
git revert HEAD
git push origin main
```

This creates a new commit that undoes the breaking changes and triggers a new deployment.

### Option 2: Redeploy Previous Version

```bash
git log --oneline  # Find previous working commit
git checkout <commit-hash>
git checkout -b rollback
git push origin rollback
# Create PR to merge rollback branch to main
```

### Option 3: Manual Rollback (S3 Versioning)

If S3 versioning is enabled:
1. Go to S3 console
2. Find affected files
3. Restore previous versions
4. Invalidate CloudFront cache manually

**Note:** This doesn't fix the git history; the broken code is still on main.

## Workflow File Location

`.github/workflows/deploy.yml`

## Required Configuration

### GitHub Secrets
- `AWS_ROLE_ARN` - IAM role for GitHub Actions to assume

### GitHub Variables
- `AWS_REGION` - AWS region (e.g., `us-east-2`)
- `S3_BUCKET_NAME` - S3 bucket name
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

See `GITHUB_SETUP.md` for configuration instructions.

## Cost Analysis

### GitHub Actions

**Free tier:** 2,000 minutes/month for public repos, 500 for private

**Estimated usage:**
- Build: ~3 minutes
- Deploy: ~2 minutes
- Total per deployment: ~5 minutes

**Deployments/month:** ~30 (daily) = ~150 minutes/month

**Cost:** $0 (well within free tier)

### AWS

**S3:**
- Storage: ~$0.05/month (2GB)
- PUT requests: ~$0.01/month (CI/CD uploads)

**CloudFront:**
- First year: 1TB free
- After: $0.085/GB
- Invalidations: First 1,000 paths free/month

**Total:** ~$1-5/month after first year

## Maintenance

### Weekly Tasks
- Review workflow runs for failures
- Check build/deploy duration trends

### Monthly Tasks
- Review GitHub Actions usage
- Check AWS costs
- Update action versions if available

### Quarterly Tasks
- Review and update documentation
- Audit repository access
- Review IAM role permissions

## Next Steps

Consider adding:
- Automated tests (unit, integration, e2e)
- Lighthouse CI for performance monitoring
- Staging environment for preview deployments
- Slack/Discord notifications
- CloudWatch alarms for AWS resources

## References

- [Setup Guides](./): AWS_SETUP.md, GITHUB_SETUP.md
- [Design Document](../plans/2025-11-12-cicd-pipeline-design.md)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS CLI S3 Sync](https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
```

**Step 2: Commit pipeline documentation**

```bash
git add docs/deployment/CICD_PIPELINE.md
git commit -m "docs: add CI/CD pipeline overview and troubleshooting guide"
```

---

## Task 6: Create README for Deployment Docs

**Files:**
- Create: `docs/deployment/README.md`

**Step 1: Create deployment README**

Create `docs/deployment/README.md`:

```markdown
# Deployment Documentation

This directory contains comprehensive documentation for the CI/CD pipeline and AWS infrastructure.

## Quick Start

**New setup? Follow this order:**

1. **[AWS_SETUP.md](./AWS_SETUP.md)** - Set up AWS infrastructure first
   - Create IAM OIDC provider
   - Create IAM role for GitHub Actions
   - Secure S3 bucket
   - Configure CloudFront OAC

2. **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - Configure GitHub repository
   - Add secrets and variables
   - Set up branch protection
   - Test the pipeline

3. **[CICD_PIPELINE.md](./CICD_PIPELINE.md)** - Understand how it works
   - Architecture overview
   - Monitoring and troubleshooting
   - Rolling back deployments

## Documents

### [AWS_SETUP.md](./AWS_SETUP.md)
Step-by-step guide for setting up AWS infrastructure:
- IAM OIDC identity provider
- IAM role with least-privilege permissions
- S3 bucket security hardening
- CloudFront Origin Access Control (OAC)
- Security verification
- Cost estimates

**When to read:** Before first deployment, when setting up new AWS account, when troubleshooting AWS auth issues.

### [GITHUB_SETUP.md](./GITHUB_SETUP.md)
Step-by-step guide for configuring GitHub repository:
- Repository secrets and variables
- Branch protection rules
- CODEOWNERS configuration
- Testing the pipeline
- Security best practices

**When to read:** After AWS setup, when adding collaborators, when changing branch protection rules.

### [CICD_PIPELINE.md](./CICD_PIPELINE.md)
Overview of the automated deployment pipeline:
- How the pipeline works
- Build and deploy jobs
- Security model
- Monitoring and notifications
- Troubleshooting common issues
- Rolling back deployments

**When to read:** When deployments fail, when adding features to workflow, for general understanding of CI/CD process.

## Architecture Overview

```
GitHub Repository (main branch)
  ↓
GitHub Actions (OIDC authentication)
  ↓
AWS IAM Role (least-privilege)
  ↓
S3 Bucket (private, OAC only)
  ↓
CloudFront Distribution (HTTPS, global CDN)
  ↓
End Users
```

## Security Highlights

- **No stored credentials** - OIDC provides temporary tokens
- **Least-privilege IAM** - Role scoped to specific resources only
- **Private S3 bucket** - Only accessible via CloudFront
- **Branch protection** - All changes via reviewed PRs
- **Status checks** - Build must pass before merge

## Common Tasks

### Deploy a Change

1. Create branch: `git checkout -b feature-branch`
2. Make changes
3. Commit: `git commit -m "description"`
4. Push: `git push origin feature-branch`
5. Create PR on GitHub
6. Wait for build to pass ✅
7. Get review approval
8. Merge PR
9. Automatic deployment to production 🚀

### Troubleshoot Failed Deployment

1. Go to Actions tab in GitHub
2. Click on failed workflow run
3. Click on failed job (Build or Deploy)
4. Expand failed step to see error message
5. See troubleshooting sections in:
   - `CICD_PIPELINE.md` - Pipeline-specific issues
   - `AWS_SETUP.md` - AWS configuration issues
   - `GITHUB_SETUP.md` - GitHub configuration issues

### Roll Back Broken Deployment

```bash
git revert HEAD
git push origin main
```

This creates a new commit that undoes the breaking change and triggers a new deployment.

## Support

- **Design Document:** [../plans/2025-11-12-cicd-pipeline-design.md](../plans/2025-11-12-cicd-pipeline-design.md)
- **Project Instructions:** [../../CLAUDE.md](../../CLAUDE.md)
- **GitHub Actions Logs:** Repository → Actions tab
- **AWS Console:** [CloudFront](https://console.aws.amazon.com/cloudfront/), [S3](https://s3.console.aws.amazon.com/s3/), [IAM](https://console.aws.amazon.com/iam/)

## Maintenance

- Review workflow runs weekly
- Update action versions monthly
- Audit access controls quarterly
- Monitor AWS costs monthly

---

**Last Updated:** 2025-11-12
```

**Step 2: Commit deployment README**

```bash
git add docs/deployment/README.md
git commit -m "docs: add deployment documentation index"
```

---

## Task 7: Update Main Project README

**Files:**
- Modify: `README.md`

**Step 1: Add deployment section to README**

Add to `README.md` after the existing content:

```markdown

## Deployment

This site is automatically deployed to AWS S3/CloudFront using GitHub Actions.

**Deployment Process:**
- Create a PR to `main` → Build validation runs
- Merge PR → Automatic deployment to production

**Documentation:**
- [CI/CD Pipeline Overview](./docs/deployment/CICD_PIPELINE.md)
- [AWS Setup Guide](./docs/deployment/AWS_SETUP.md)
- [GitHub Setup Guide](./docs/deployment/GITHUB_SETUP.md)

**Security:**
- OIDC authentication (no stored credentials)
- Private S3 bucket with CloudFront OAC
- Branch protection on main
- Least-privilege IAM role
```

**Step 2: Commit README update**

```bash
git add README.md
git commit -m "docs: add deployment section to README"
```

---

## Task 8: Verify All Files and Push

**Step 1: Verify all files created**

```bash
ls -la .github/workflows/deploy.yml
ls -la .github/CODEOWNERS
ls -la docs/deployment/
ls -la docs/plans/2025-11-12-cicd-pipeline-*
```

**Expected output:**
- `.github/workflows/deploy.yml` exists
- `.github/CODEOWNERS` exists
- `docs/deployment/AWS_SETUP.md` exists
- `docs/deployment/GITHUB_SETUP.md` exists
- `docs/deployment/CICD_PIPELINE.md` exists
- `docs/deployment/README.md` exists
- `docs/plans/2025-11-12-cicd-pipeline-design.md` exists
- `docs/plans/2025-11-12-cicd-pipeline-implementation.md` exists

**Step 2: Check git status**

```bash
git status
```

**Expected:** All changes committed, working tree clean

**Step 3: Push all commits to remote**

```bash
git push origin main
```

**Expected:** All commits pushed successfully

✅ **Checkpoint:** Implementation complete, all files pushed to repository

---

## Post-Implementation Tasks

After implementation is complete, the user must:

1. **Follow AWS_SETUP.md** to configure AWS infrastructure
2. **Follow GITHUB_SETUP.md** to configure GitHub repository
3. **Test the pipeline** by creating a test PR
4. **Verify deployment** works end-to-end
5. **Monitor first few deployments** closely

---

## Success Criteria

- [ ] GitHub Actions workflow file created and pushed
- [ ] CODEOWNERS file created
- [ ] AWS setup documentation complete with step-by-step instructions
- [ ] GitHub setup documentation complete with step-by-step instructions
- [ ] Main CI/CD pipeline documentation created
- [ ] Deployment README created as index
- [ ] Main README updated with deployment section
- [ ] All files committed to git
- [ ] All commits pushed to remote repository

---

## Notes

**Testing the workflow:**
- The workflow will NOT run automatically until GitHub secrets/variables are configured
- The workflow file itself can be committed before AWS/GitHub setup is complete
- First test should be on a feature branch (not main) to verify build job

**Security considerations:**
- Never commit AWS credentials to git
- Always use OIDC authentication (no long-lived credentials)
- Review IAM policies carefully before applying
- Test branch protection rules don't lock you out

**Documentation maintenance:**
- Update documentation when workflow changes
- Keep AWS account IDs and resource names as placeholders
- Add troubleshooting sections as issues arise

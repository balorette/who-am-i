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

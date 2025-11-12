# CI/CD Pipeline Design

**Date:** 2025-11-12
**Status:** Validated
**Author:** Bryan Lorette with Claude Code

## Overview

This document outlines the design for a secure CI/CD pipeline that automatically builds and deploys the Next.js static site to AWS S3/CloudFront using GitHub Actions with OIDC authentication.

## Design Decisions

- **Deployment Trigger:** Build on PR for validation, deploy only on merge to main
- **AWS Authentication:** OIDC (no long-lived credentials)
- **Cache Invalidation:** Invalidate all paths (`/*`) on deployment
- **Notifications:** GitHub status checks and notifications (built-in)
- **Environment:** Single production environment
- **Security:** CloudFront OAC, locked-down S3, branch protection, least-privilege IAM

---

## High-Level Architecture

### System Components

1. **GitHub Actions Pipeline** - Runs on two triggers:
   - **PR to main:** Builds the Next.js site, validates it compiles, runs linting
   - **Merge to main:** Builds + deploys to S3 + invalidates CloudFront cache

2. **AWS Infrastructure** (existing, needs security hardening):
   - **S3 Bucket:** Stores static site files from `out/` directory
   - **CloudFront Distribution:** CDN that serves content globally
   - **IAM Role:** GitHub Actions assumes this role via OIDC (no stored credentials)

3. **Security Boundaries:**
   - S3 bucket policy: ONLY CloudFront can read files (blocks direct S3 access)
   - CloudFront Origin Access Control (OAC): Authenticates CloudFront to S3
   - GitHub branch protection: Only admins/codeowners can approve PRs to main
   - OIDC federation: GitHub Actions gets temporary credentials, no secrets in repo

### Data Flow

```
Developer creates PR
  → GitHub Actions builds
  → PR status check passes/fails

PR approved & merged
  → GitHub Actions builds
  → Uploads to S3
  → Invalidates CloudFront
  → Users see new content
```

### Security Principles

- **Least privilege IAM:** GitHub can only write to specific S3 bucket + invalidate specific CloudFront distribution
- **No public S3 access:** Everything goes through CloudFront
- **No long-lived credentials:** OIDC provides temporary tokens
- **Branch protection:** Prevents unauthorized deployments

---

## GitHub Actions Workflow Structure

### Workflow File Location

`.github/workflows/deploy.yml`

### Two-Job Strategy

#### 1. Build Job (runs on all PRs + main branch pushes)

- Checks out code
- Sets up Node.js (version 20)
- Installs dependencies with caching
- Runs linting (`npm run lint`)
- Builds the site (`npm run build`)
- Uploads `out/` directory as artifact (for deploy job)
- Runs on: `ubuntu-latest` runner

#### 2. Deploy Job (runs ONLY on main branch, after build succeeds)

- Downloads build artifact from build job
- Configures AWS credentials via OIDC (assumes IAM role)
- Syncs `out/` directory to S3 bucket using AWS CLI
- Deletes removed files from S3 (keeps bucket clean)
- Invalidates CloudFront cache for `/*` (all paths)
- Condition: `github.ref == 'refs/heads/main' && github.event_name == 'push'`

### Required GitHub Secrets/Variables

- `AWS_REGION` (variable, e.g., `us-east-2`)
- `AWS_ROLE_ARN` (secret, e.g., `arn:aws:iam::123456789012:role/GitHubActionsDeployRole`)
- `S3_BUCKET_NAME` (variable, your bucket name)
- `CLOUDFRONT_DISTRIBUTION_ID` (variable, your distribution ID)

### Build Optimizations

- Dependency caching to speed up builds
- Fail fast on lint errors
- Artifact retention: 1 day (just needs to survive deploy)

---

## AWS IAM OIDC Configuration

### IAM OIDC Identity Provider Setup (one-time)

Create an OIDC identity provider in AWS IAM that trusts GitHub:

- **Provider URL:** `https://token.actions.githubusercontent.com`
- **Audience:** `sts.amazonaws.com`
- **Thumbprint:** Auto-detected by AWS (verifies GitHub's certificate)

This allows GitHub Actions to request temporary credentials without storing secrets.

### IAM Role for GitHub Actions

**Role Name:** `GitHubActionsDeployRole`

#### Trust Policy (who can assume this role)

- Trusts the GitHub OIDC provider
- Restricted to specific repository: `repo:balorette/who-am-i:ref:refs/heads/main`
- Only allows main branch deployments (prevents fork attacks)
- Condition checks ensure only your repo on main branch can assume role

#### Permissions Policy (what the role can do)

- `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on specific S3 bucket only
- `cloudfront:CreateInvalidation` on specific CloudFront distribution only
- NO wildcard permissions
- NO access to other AWS services
- Follows least-privilege principle

### Security Benefits

- Credentials are temporary (1 hour max)
- Auto-rotated per workflow run
- Cannot be extracted or leaked
- Scoped to only your repo's main branch
- Limited to exact resources needed

---

## S3 Bucket Security Configuration

### S3 Bucket Security Hardening

#### 1. Block All Public Access (enabled)

- Block public ACLs
- Ignore public ACLs
- Block public bucket policies
- Restrict public buckets
- **Result:** NO direct internet access to S3

#### 2. Bucket Policy (CloudFront-only access)

- Allows CloudFront Origin Access Control (OAC) to read objects
- Uses `s3:GetObject` permission
- Condition: `AWS:SourceArn` matches your CloudFront distribution ARN
- Denies all other access (even direct S3 URLs return 403)

#### 3. Bucket Settings

- **Versioning:** Optional (recommended for rollback capability)
- **Encryption:** AES-256 (SSE-S3) or KMS
- **Server access logging:** Optional (helps audit access)
- **Object ownership:** Bucket owner enforced (disables ACLs)

### CloudFront Origin Access Control (OAC)

- Create OAC in CloudFront console
- Attach to your distribution's S3 origin
- CloudFront automatically signs requests to S3
- S3 bucket policy verifies signature before serving content
- OAC is AWS-recommended over deprecated OAI (Origin Access Identity)

### Security Result

Users can ONLY access your site through CloudFront HTTPS. Direct S3 URLs return 403 Forbidden.

---

## GitHub Repository Security & Branch Protection

### Branch Protection Rules for `main` Branch

Configure in: GitHub Settings → Branches → Branch protection rules

#### 1. Require Pull Request Reviews Before Merging

- Require approvals: 1 (or more if collaborating)
- Dismiss stale reviews when new commits are pushed
- Require review from code owners (if using CODEOWNERS file)
- Restrict who can approve: Repository admins only (optional but recommended)

#### 2. Require Status Checks to Pass

- Require branches to be up to date before merging
- Required status check: `build` (the GitHub Actions build job)
- Prevents merging if build fails

#### 3. Require Conversation Resolution

- All PR comments must be resolved before merge
- Ensures discussions are completed

#### 4. Include Administrators

- Enforce rules for admins too (best practice)
- Prevents accidental bypass

#### 5. Restrict Pushes

- Only allow pull requests (no direct pushes to main)
- Even repository owner must go through PR process

### Optional CODEOWNERS File

Create `.github/CODEOWNERS`:

```
* @balorette
```

This ensures you're automatically requested as reviewer on all PRs.

### Repository Secrets Security

- Secrets (AWS_ROLE_ARN) are only accessible to workflows in the repository
- Not exposed in PR logs from forks (GitHub automatically protects this)
- Can be rotated without code changes

---

## Documentation Deliverables

### Documentation Files to Create

1. **`docs/deployment/CICD_PIPELINE.md`** - Main pipeline documentation
   - Overview and architecture diagram (text-based)
   - How the pipeline works (PR vs merge behavior)
   - GitHub Actions workflow explanation
   - Troubleshooting common issues
   - How to monitor deployments
   - How to roll back if needed

2. **`docs/deployment/AWS_SETUP.md`** - AWS infrastructure setup
   - High-level architecture diagram
   - IAM OIDC provider setup (step-by-step)
   - IAM role creation with exact policies
   - S3 bucket security hardening checklist
   - CloudFront OAC configuration
   - Security best practices and validation steps
   - Cost estimates

3. **`docs/deployment/GITHUB_SETUP.md`** - GitHub configuration
   - Branch protection rules setup
   - Required secrets and variables configuration
   - CODEOWNERS file setup
   - How to configure repository settings
   - Access control best practices

4. **`.github/workflows/deploy.yml`** - The actual workflow
   - Fully commented workflow file
   - Ready to use with your configuration
   - Environment variables clearly marked

### Documentation Style

- Step-by-step instructions with AWS console descriptions
- Copy-paste ready JSON policies
- Validation commands to verify each step
- Security checkpoints throughout
- Troubleshooting sections for common errors

### Additional Artifacts

- Example IAM trust policy JSON
- Example IAM permissions policy JSON
- Example S3 bucket policy JSON
- Architecture diagram (text/Mermaid)

---

## Security Checklist

Before going live, verify:

- [ ] S3 bucket has "Block all public access" enabled
- [ ] S3 bucket policy only allows CloudFront OAC
- [ ] CloudFront distribution uses OAC (not deprecated OAI)
- [ ] IAM role trust policy scoped to specific repo and main branch
- [ ] IAM role permissions limited to specific bucket and distribution
- [ ] GitHub branch protection enabled on main
- [ ] Required status checks configured
- [ ] GitHub secrets configured correctly
- [ ] OIDC provider created in AWS IAM
- [ ] Test deployment works end-to-end
- [ ] CloudFront cache invalidation successful
- [ ] Direct S3 URLs return 403 (not accessible)

---

## Next Steps

1. Set up AWS IAM OIDC provider
2. Create IAM role with trust and permissions policies
3. Harden S3 bucket security
4. Configure CloudFront OAC
5. Set up GitHub branch protection
6. Create GitHub secrets/variables
7. Implement GitHub Actions workflow
8. Write comprehensive documentation
9. Test pipeline with a PR
10. Verify security configurations

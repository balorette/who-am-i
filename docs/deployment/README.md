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

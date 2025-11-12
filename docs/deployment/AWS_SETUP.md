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

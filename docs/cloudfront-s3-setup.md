# CloudFront + S3 Hosting Setup

## Issue: 403 Errors on Page Routes

**Problem:** CloudFront returns 403 errors when accessing routes like `/about/`, `/projects/`, etc.

**Root Cause:** CloudFront doesn't automatically serve `index.html` for directory paths. When accessing `/about/`, it looks for `/about/` object in S3, which doesn't exist (only `/about/index.html` exists).

---

## Solution: CloudFront Function

### CloudFront Function Code

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Check if URI is missing a file extension
    if (!uri.includes('.')) {
        // If URI ends with /, append index.html
        if (uri.endsWith('/')) {
            request.uri = uri + 'index.html';
        } else {
            // If no trailing slash, add /index.html
            request.uri = uri + '/index.html';
        }
    }

    return request;
}
```

### How to Apply

1. **CloudFront Console** → Your Distribution
2. **Behaviors** tab → Edit default behavior
3. **Function associations** → **Viewer request**
4. **Create function:**
   - Name: `index-html-rewrite`
   - Runtime: CloudFront Functions
   - Paste code above
5. **Publish** the function
6. **Associate** with distribution behavior
7. **Save changes**
8. Wait 5-10 minutes for propagation

### Test After Deployment

```bash
# All these should return 200 OK
curl -I https://aftermarketcode.com/
curl -I https://aftermarketcode.com/about/
curl -I https://aftermarketcode.com/projects/
curl -I https://aftermarketcode.com/blog/
```

---

## Required S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

**Apply via:**
1. **S3 Console** → Bucket → **Permissions** → **Bucket Policy**
2. **Block Public Access** → Uncheck "Block public access to buckets and objects granted through new public bucket or access point policies"

---

## CloudFront Distribution Settings

### Origin Configuration
- **Origin domain:** `your-bucket-name.s3.us-east-2.amazonaws.com`
- **Origin access:** Public (with bucket policy above)
- **OR** Use CloudFront Origin Access Control (OAC) for better security

### Behavior Settings
- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Allowed HTTP methods:** GET, HEAD, OPTIONS
- **Cache policy:** CachingOptimized (or custom)
- **Function associations:** Viewer request → `index-html-rewrite`

### General Settings
- **Default root object:** `index.html`
- **Custom error responses:**
  - 403 → `/404.html` (response code: 404)
  - 404 → `/404.html` (response code: 404)

---

## Deployment Workflow

### Build and Deploy

```bash
# 1. Build static site
npm run build

# 2. Sync to S3 (delete old files first)
aws s3 sync out/ s3://your-bucket-name/ --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR-DISTRIBUTION-ID \
  --paths "/*"
```

### Verify Deployment

```bash
# Check S3 structure
aws s3 ls s3://your-bucket-name/ --recursive | head -20

# Expected structure:
# index.html
# about/index.html
# projects/index.html
# projects/agentic-contextualizer/index.html
# blog/index.html
# images/og-image-1200x630.png
# _next/static/...
```

---

## Troubleshooting

### Still Getting 403 Errors?

1. **Check CloudFront Function is associated**
   - CloudFront Console → Distribution → Behaviors → Default → Function associations
   - Viewer request should show your function

2. **Clear CloudFront cache**
   - Create invalidation for `/*`
   - Wait 5-10 minutes

3. **Verify S3 files exist**
   ```bash
   aws s3 ls s3://your-bucket-name/about/index.html
   ```
   Should return file size and timestamp

4. **Check S3 bucket policy**
   - Must allow public `s3:GetObject`
   - Block Public Access must be configured correctly

5. **Test S3 direct access**
   ```bash
   curl https://your-bucket-name.s3.us-east-2.amazonaws.com/about/index.html
   ```
   Should return HTML content (if bucket is public)

### 404 Errors After Fixing 403?

- Good! 404 means CloudFront can reach S3, file just doesn't exist
- Check file path in S3 matches URL structure
- Verify `trailingSlash: true` in `next.config.ts`

---

## Security Best Practices

### Use Origin Access Control (OAC)

Instead of public bucket policy:

1. **CloudFront Console** → Distribution → Origins → Edit
2. **Origin access:** Origin access control settings
3. **Create OAC** if needed
4. **Copy the bucket policy** CloudFront generates
5. Apply policy to S3 bucket (replaces public policy)

**Benefits:**
- S3 bucket stays private
- Only CloudFront can access files
- Better security posture

### HTTPS Only

- **Viewer protocol policy:** Redirect HTTP to HTTPS
- **Origin protocol policy:** HTTPS only (if using CloudFront OAC)
- Use AWS Certificate Manager (ACM) for custom domain SSL

---

## Monitoring

### CloudFront Metrics to Watch

- **4xx Error Rate** - Should be low (<5%)
- **Cache Hit Rate** - Should be high (>80%)
- **Origin Response Time** - Should be <100ms

### Enable CloudFront Logging (Optional)

1. **CloudFront Console** → Distribution → General → Settings
2. **Standard logging:** On
3. **S3 bucket for logs:** Create separate logging bucket
4. **Analyze logs** for 403 patterns

---

## Cost Optimization

### CloudFront Cache Settings

- **Default TTL:** 86400 (24 hours) for HTML
- **Max TTL:** 31536000 (1 year) for static assets
- Use cache policy to cache by query string if needed

### S3 Lifecycle Rules

- Move old logs to Glacier after 90 days
- Delete old deployment artifacts after 30 days

---

## Next.js Configuration

**File:** `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  output: 'export',           // Static export
  images: {
    unoptimized: true,         // Required for static export
  },
  trailingSlash: true,         // Required for S3 hosting
  reactStrictMode: true,
};
```

**Important:** `trailingSlash: true` ensures routes generate as `/path/index.html`, which is what S3/CloudFront expects.

---

## Additional Resources

- [CloudFront Functions Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

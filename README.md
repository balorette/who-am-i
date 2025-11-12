# Bryan Lorette - Personal Site

Modern personal portfolio site showcasing projects, experiments, and insights from infrastructure to cloud-native and AI technologies.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Content**: Markdown with gray-matter
- **Hosting**: AWS S3 + CloudFront (Static Export)

## 🛠️ Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

Static files generated in `out/` directory.

## 📝 Content Management

All content lives in markdown files under `content/`:

- `content/projects/` - Project portfolios
- `content/experiments/` - Active explorations
- `content/findings/` - Quick TILs
- `content/thoughts/` - Long-form essays

Simply add a new `.md` file with proper frontmatter to create new content!

## 🌐 Deployment

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

## 🎨 Features

- Minimal dark VSCode/terminal theme
- SEO optimized with sitemaps
- Markdown with syntax highlighting
- Mobile responsive
- Google Analytics ready

## 🤝 Built With

Collaboratively built with [Claude Code](https://claude.com/claude-code).

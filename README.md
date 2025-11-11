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

Upload the `out/` directory to AWS S3, configure CloudFront, and you're live!

## 🎨 Features

- Minimal dark VSCode/terminal theme
- SEO optimized with sitemaps
- Markdown with syntax highlighting
- Mobile responsive
- Google Analytics ready

## 🤝 Built With

Collaboratively built with [Claude Code](https://claude.com/claude-code).

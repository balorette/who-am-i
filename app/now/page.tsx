import { Metadata } from 'next';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';

export const metadata: Metadata = genMetadata({
  title: 'Now',
  description: "What I'm currently focused on, learning, and exploring.",
  path: '/now',
});

export default function NowPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">What I&apos;m Doing Now</h1>
        <p className="text-text-secondary">
          Last updated: <time>{lastUpdated}</time>
        </p>
        <p className="text-sm text-text-secondary mt-2">
          Inspired by{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline"
          >
            nownownow.com
          </a>
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-primary">Current Focus</h2>
          <ul className="space-y-3 text-text-secondary list-none pl-0">
            <li className="flex items-start gap-3"><span className="text-accent-primary mt-1.5 text-xs">&#9654;</span> Exploring agentic AI systems with OpenAI, Anthropic, Custom Agents and more</li>
            <li className="flex items-start gap-3"><span className="text-accent-primary mt-1.5 text-xs">&#9654;</span> Building personal site with Next.js and modern static site techniques</li>
            <li className="flex items-start gap-3"><span className="text-accent-primary mt-1.5 text-xs">&#9654;</span> All things Cloud, Cloud Native, and Development</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-secondary">Learning</h2>
          <ul className="space-y-3 text-text-secondary list-none pl-0">
            <li className="flex items-start gap-3"><span className="text-accent-secondary mt-1.5 text-xs">&#9654;</span> AI/ML in multiple Languages and frameworks</li>
            <li className="flex items-start gap-3"><span className="text-accent-secondary mt-1.5 text-xs">&#9654;</span> AI agent orchestration and workflow design</li>
            <li className="flex items-start gap-3"><span className="text-accent-secondary mt-1.5 text-xs">&#9654;</span> Infrastructure as Code at Scale</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-success">Building</h2>
          <ul className="space-y-3 text-text-secondary list-none pl-0">
            <li className="flex items-start gap-3"><span className="text-accent-success mt-1.5 text-xs">&#9654;</span> Personal portfolio site (this site!)</li>
            <li className="flex items-start gap-3"><span className="text-accent-success mt-1.5 text-xs">&#9654;</span> Experimental AI-powered automation tools</li>
            <li className="flex items-start gap-3"><span className="text-accent-success mt-1.5 text-xs">&#9654;</span> Documentation and learning resources</li>
          </ul>
        </Card>
      </div>

      <div className="mt-12 p-6 bg-background-secondary border border-border rounded-lg">
        <p className="text-sm text-text-secondary">
          This is a &ldquo;now page&rdquo; — a snapshot of what I&apos;m currently prioritizing. If you have your own
          site, consider making one too!
        </p>
      </div>
    </div>
  );
}

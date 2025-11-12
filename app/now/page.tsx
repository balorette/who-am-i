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
          <h2 className="text-2xl font-bold mb-4 text-accent-primary"><i className="fa-duotone fa-solid fa-trophy"></i> Current Focus</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• Exploring agentic AI systems with OpenAI, Anthropic, Custom Agents and more</li>
            <li>• Building personal site with Next.js and modern static site techniques</li>
            <li>• All things Cloud, Cloud Native, and Development</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-secondary">Learning</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• AI/ML in multiple Languages and frameworks</li>
            <li>• AI agent orchestration and workflow design</li>
            <li>• Infrastructure as Code at Scale</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4 text-accent-success">Building</h2>
          <ul className="space-y-2 text-text-secondary">
            <li>• Personal portfolio site (this site!)</li>
            <li>• Experimental AI-powered automation tools</li>
            <li>• Documentation and learning resources</li>
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

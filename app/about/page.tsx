import { Metadata } from 'next';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { generateMetadata as genMetadata } from '@/lib/seo';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

export const metadata: Metadata = genMetadata({
  title: 'About',
  description: 'Professional journey from infrastructure to cloud-native and AI technologies.',
  path: '/about',
});

export default function AboutPage() {
  const certifications = [
    { name: 'AWS AI/ML', year: 'Udemy' },
    { name: 'Agentic Courses', year: 'Udemy' },
    { name: 'GoLang', year: 'Udemy' }
  ];

  const technologies = [
    'AWS', 'Azure', 'AI', 'Next.js', 'TypeScript', 'React',
    'Node.js', 'Python', 'Go', 'Linux', 'Docker', 'Kubernetes', 'Crossplane',
    'Terraform', 'CloudFormation', 'CI/CD', 'AI/ML', 'Security', 'SDLC',
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
        <p className="text-xl text-text-secondary">
          Engineer and Architect, all things cloud-native, platform, and AI.
        </p>
      </div>

      {/* Journey */}
      <section className="mb-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4">My Journey</h2>
          <div className="space-y-4 text-text-secondary">
            <p>
              From hardware to agents, I am a builder of systems. I grew up building computers and troubleshooting networks before 
              "the cloud" had a name. My career has been a vertical climb up the stack: from physical networking and server rooms 
              to Kubernetes and Internal Developer Platforms. I have built and architected enterprise-grade cloud platforms. 
            </p>
            <p>
              Today, as a Tech Lead in AI, I use that foundational knowledge to demystify the 'magic' of the industry. 
              I look at AI through the lens of architecture, governance, and root-cause reality. 
              I write for the builders who care about how things actually work under the hood.
            </p>
          </div>
        </Card>
      </section>

      {/* Skills & Technologies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 section-heading">Technologies & Skills</h2>
        <Card>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        </Card>
      </section>

      {/* Certifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 section-heading">Recommended Courses</h2>
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.name} hover={false}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <span className="text-text-secondary">{cert.year}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Connect */}
      <section>
        <Card>
          <h2 className="text-2xl font-bold mb-4">Let&apos;s Connect</h2>
          <p className="text-text-secondary mb-6">
            I&apos;m always interested in connecting with fellow technologists, learning from others,
            and sharing knowledge.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/balorette"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background-tertiary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <FaGithub className="text-xl" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/blorette/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-background-tertiary border border-border rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
            >
              <FaLinkedin className="text-xl" /> LinkedIn
            </a>
          </div>
        </Card>
      </section>
    </div>
  );
}

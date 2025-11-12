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
    { name: 'Agentic Course', year: 'Udemy' },
    { name: 'GoLang', year: 'Udemy' }
  ];

  const technologies = [
    'AWS', 'Azure', 'Next.js', 'TypeScript', 'React',
    'Node.js', 'Python', 'Go', 'Linux', 'Docker', 'Kubernetes', 'Crossplane',
    'Terraform', 'CloudFormation', 'CI/CD', 'AI/ML', 'Security', 'SDLC',
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Me</h1>
        <p className="text-xl text-text-secondary">
          Infrastructure specialist evolving into cloud-native and AI technologies
        </p>
      </div>

      {/* Journey */}
      <section className="mb-12">
        <Card>
          <h2 className="text-2xl font-bold mb-4">My Journey</h2>
          <div className="space-y-4 text-text-secondary">
            <p>
              I started my career deep in traditional infrastructure — working with enterprise
              systems, datacenters, Bare Metal Servers, Cisco networking, and Red Hat Linux. This
              foundation gave me a solid understanding of how systems work at a fundamental level. 
              I started building my own applications and sank my teeth into development.
            </p>
            <p>
              As cloud technologies emerged, I evolved my skillset into cloud-native apps and architectures,
              earning certifications in AWS and Azure. I&apos;ve embraced infrastructure as code,
              containerization, and modern DevOps practices. I&apos;ve built everything from full stack all in one applications
              to complex microservices architectures deployed on Kubernetes.
            </p>
            <p>
              Today, I&apos;m exploring the cutting edge of AI and agentic systems, applying my
              background to build and experiment with emerging technologies. I
              believe the best way to learn is by building, documenting, and sharing.
            </p>
          </div>
        </Card>
      </section>

      {/* Skills & Technologies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Technologies & Skills</h2>
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
        <h2 className="text-2xl font-bold mb-6">Recommended Courses</h2>
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

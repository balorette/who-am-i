import Link from 'next/link';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Bryan Lorette
            </h3>
            <p className="text-sm text-text-secondary">
              Cloud-native specialist evolving into emerging and AI technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/experiments"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Experiments
                </Link>
              </li>
              <li>
                <Link
                  href="/now"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Now
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/balorette"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-150"
                aria-label="GitHub"
              >
                <FaGithub className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/blorette/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-primary hover:scale-110 transition-all duration-150"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-text-secondary text-center">
            © {currentYear} Bryan Lorette. Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Next.js
            </a>{' '}
            and{' '}
            <a
              href="https://claude.com/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              Claude Code
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Metadata } from 'next';

const siteConfig = {
  name: 'Bryan Lorette',
  title: 'Bryan Lorette - Infrastructure to AI',
  description: 'Personal site showcasing projects, experiments, and insights from infrastructure to cloud-native and AI technologies.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/balorette',
    linkedin: 'https://www.linkedin.com/in/blorette/',
  },
};

export function generateMetadata({
  title,
  description,
  image,
  path = '',
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: 'website',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export function generatePersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bryan Lorette',
    url: siteConfig.url,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
    ],
    jobTitle: 'Infrastructure & Cloud Specialist',
    description: 'Infrastructure specialist evolving into cloud-native and AI technologies',
  };
}

export function generateWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function generateBlogPostingJsonLd({
  title,
  description,
  datePublished,
  slug,
}: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: 'Bryan Lorette',
    },
    url: `${siteConfig.url}/${slug}`,
  };
}

export { siteConfig };

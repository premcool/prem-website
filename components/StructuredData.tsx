import Script from 'next/script';
import { getAllPosts } from '@/lib/posts';

export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';
  const posts = getAllPosts();
  
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prem Saktheesh',
    jobTitle: 'Strategic Program Director & Technology Portfolio Leader',
    description: 'AI & Cloud Transformation Leader with 26+ years of enterprise experience. Leading $35M P&L portfolios, managing 300+ member global teams, and delivering $100M+ in cloud migration and GenAI initiatives.',
    email: 'prem@prems.in',
    url: baseUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bangalore',
      addressCountry: 'IN',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Infosys Limited',
    },
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/premsaktheesh',
      // 'https://linkedin.com/in/premsaktheesh',
      // 'https://github.com/premcool',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Prem Saktheesh',
    url: baseUrl,
    description: 'Strategic Program Director & Technology Portfolio Leader specializing in AI & Cloud Transformation. 26+ years of enterprise experience leading $35M P&L portfolios and 300+ member global teams.',
    publisher: {
      '@type': 'Person',
      name: 'Prem Saktheesh',
    },
  };

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Prem Saktheesh Blog',
    url: `${baseUrl}/blog`,
    description: 'Insights on AI, cloud transformation, enterprise architecture, and technology leadership',
    author: {
      '@type': 'Person',
      name: 'Prem Saktheesh',
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <Script
        id="person-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="blog-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}

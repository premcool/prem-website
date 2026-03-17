export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prems.in';

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
    sameAs: [],
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

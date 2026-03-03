import Link from 'next/link';
import Section from '@/components/Section';

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <Section className="mb-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Strategic Program Director & Technology Portfolio Leader
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-4">
            AI & Cloud Transformation | 26+ Years of Enterprise Excellence
          </p>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Leading $35M P&L portfolios, managing 300+ member global teams, and delivering $100M+ in cloud migration and GenAI initiatives.
          </p>
        </div>
      </Section>

      {/* Key Achievements */}
      <Section className="mb-20">
        <h2 className="text-3xl font-bold text-white mb-8">Key Achievements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Portfolio Leadership</h3>
            <p className="text-slate-300">
              Successfully managed and delivered $35M+ technology portfolios, driving strategic initiatives across multiple business units and geographies.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Global Team Management</h3>
            <p className="text-slate-300">
              Led and scaled 300+ person distributed teams across multiple time zones, fostering collaboration and delivering exceptional results.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Modernization Programs</h3>
            <p className="text-slate-300">
              Architected and executed $100M+ digital transformation programs, modernizing legacy systems and enabling cloud-native capabilities.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Enterprise Scale</h3>
            <p className="text-slate-300">
              Delivered mission-critical solutions for Tier-1 financial institutions, ensuring high availability, security, and regulatory compliance.
            </p>
          </div>
        </div>
      </Section>

      {/* Enterprise Programs */}
      <Section className="mb-20">
        <h2 className="text-3xl font-bold text-white mb-8">Enterprise Programs</h2>
        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Cloud Migration & Modernization</h3>
            <p className="text-slate-300 mb-3">
              Leading comprehensive cloud migration initiatives, moving critical workloads to cloud platforms while maintaining zero-downtime operations and achieving significant cost optimization.
            </p>
            <p className="text-sm text-slate-400">Program Value: $100M+ | Global Team: 300+ Members</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Generative AI & Machine Learning</h3>
            <p className="text-slate-300 mb-3">
              Building enterprise-grade GenAI and ML platforms enabling data scientists and developers to deploy models at scale, leveraging technologies like Databricks, LangChain, and Python.
            </p>
            <p className="text-sm text-slate-400">Portfolio: $35M P&L | Focus: AI/ML Innovation</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Digital Transformation</h3>
            <p className="text-slate-300 mb-3">
              Architecting next-generation digital platforms and modernizing legacy systems, enabling organizations to compete effectively in the digital age.
            </p>
            <p className="text-sm text-slate-400">Multi-year Programs | Enterprise Scale</p>
          </div>
        </div>
      </Section>

      {/* Technical Expertise */}
      <Section className="mb-20">
        <h2 className="text-3xl font-bold text-white mb-8">Technical Expertise</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">AI & Data Platforms</h3>
            <p className="text-slate-300 text-sm">
              Python, Databricks, LangChain, Power BI, SAP BI, and advanced analytics platforms for enterprise AI solutions.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Cloud & DevOps</h3>
            <p className="text-slate-300 text-sm">
              GitLab CI/CD, Docker, containerization, and cloud-native architectures for scalable enterprise solutions.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Enterprise Technologies</h3>
            <p className="text-slate-300 text-sm">
              PL/SQL, JavaScript, Blockchain, and enterprise integration technologies for mission-critical systems.
            </p>
          </div>
        </div>
      </Section>

      {/* Call to Action */}
      <Section>
        <div className="text-center bg-slate-800/50 border border-slate-700 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Explore My Work</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover my projects, insights, and thoughts on AI, cloud transformation, and enterprise leadership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              className="inline-block px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

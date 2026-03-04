import Link from 'next/link';
import Section from '@/components/Section';

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="py-8 md:py-12">
      {/* Hero Section */}
      <Section className="mb-16 md:mb-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4 leading-tight">
              Strategic Program Director & Technology Portfolio Leader
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          </div>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-3 font-light">
            AI & Cloud Transformation | 26+ Years of Enterprise Excellence
          </p>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Leading $35M P&L portfolios, managing 300+ member global teams, and delivering $100M+ in cloud migration and GenAI initiatives.
          </p>
          
          {/* Personal Introduction */}
          <div className="bg-slate-800/30 border-l-4 border-blue-500 rounded-r-lg p-6 mb-8 text-left max-w-2xl mx-auto">
            <p className="text-slate-300 leading-relaxed italic">
              &ldquo;I bridge the gap between visionary strategy and technical execution, transforming complex challenges into scalable solutions that drive business value. With a passion for innovation and a track record of delivering results at enterprise scale.&rdquo;
            </p>
          </div>
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-700/80 text-white font-medium rounded-lg hover:bg-slate-600 transition-all border border-slate-600 hover:border-slate-500"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </Section>

      {/* Key Achievements */}
      <Section className="mb-16 md:mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Key Achievements</h2>
          <p className="text-slate-400 text-sm md:text-base">Delivering measurable impact across enterprise technology initiatives</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Portfolio Leadership</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Successfully managed and delivered $35M+ technology portfolios, driving strategic initiatives across multiple business units and geographies.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Global Team Management</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Led and scaled 300+ person distributed teams across multiple time zones, fostering collaboration and delivering exceptional results.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Modernization Programs</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Architected and executed $100M+ digital transformation programs, modernizing legacy systems and enabling cloud-native capabilities.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise Scale</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Delivered mission-critical solutions for Tier-1 financial institutions, ensuring high availability, security, and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Enterprise Programs */}
      <Section className="mb-16 md:mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Enterprise Programs</h2>
          <p className="text-slate-400 text-sm md:text-base">Strategic initiatives driving digital transformation</p>
        </div>
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 border border-slate-700/50 rounded-lg p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-white">Cloud Migration & Modernization</h3>
              <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded">$100M+</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Leading comprehensive cloud migration initiatives, moving critical workloads to cloud platforms while maintaining zero-downtime operations and achieving significant cost optimization.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>Program Value: $100M+</span>
              <span>•</span>
              <span>Global Team: 300+ Members</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 border border-slate-700/50 rounded-lg p-6 hover:border-purple-500/30 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-white">Generative AI & Machine Learning</h3>
              <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded">$35M P&L</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Building enterprise-grade GenAI and ML platforms enabling data scientists and developers to deploy models at scale, leveraging technologies like Databricks, LangChain, and Python.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>Portfolio: $35M P&L</span>
              <span>•</span>
              <span>Focus: AI/ML Innovation</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-800/20 border border-slate-700/50 rounded-lg p-6 hover:border-green-500/30 transition-all">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-white">Digital Transformation</h3>
              <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded">Multi-year</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Architecting next-generation digital platforms and modernizing legacy systems, enabling organizations to compete effectively in the digital age.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              <span>Multi-year Programs</span>
              <span>•</span>
              <span>Enterprise Scale</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Technical Expertise */}
      <Section className="mb-16 md:mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">Technical Expertise</h2>
          <p className="text-slate-400 text-sm md:text-base">Technologies and platforms powering enterprise solutions</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 hover:border-blue-500/30 transition-colors">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              AI & Data Platforms
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Python, Databricks, LangChain, Power BI, SAP BI, and advanced analytics platforms for enterprise AI solutions.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 hover:border-purple-500/30 transition-colors">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              Cloud & DevOps
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              GitLab CI/CD, Docker, containerization, and cloud-native architectures for scalable enterprise solutions.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-5 hover:border-green-500/30 transition-colors">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Enterprise Technologies
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              PL/SQL, JavaScript, Blockchain, and enterprise integration technologies for mission-critical systems.
            </p>
          </div>
        </div>
      </Section>

    </div>
  );
}

import Section from '@/components/Section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
};

export default function About() {
  return (
    <div className="py-12">
      <Section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">About</h1>
        
        {/* Executive Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Executive Summary</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              Strategic Program Director & Technology Portfolio Leader with 26+ years of enterprise experience, specializing in AI & Cloud Transformation.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-4">
              My expertise spans strategic portfolio management, global team leadership, and the execution of complex modernization programs. I have successfully delivered $100M+ in cloud migration and GenAI initiatives, combining deep technical acumen with executive leadership skills to bridge the gap between business strategy and technology execution.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              With a focus on enterprise-scale transformations, I architect solutions leveraging cutting-edge technologies including Next.js and React, Databricks, LangChain, and cloud-native platforms, enabling organizations to compete effectively in the digital age.
            </p>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Key Achievements</h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Portfolio & Program Leadership</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                <li>Managed $35M+ technology portfolios across multiple business units</li>
                <li>Delivered $100M+ digital transformation programs on time and within budget</li>
                <li>Achieved 95%+ program success rate with zero critical incidents</li>
                <li>Reduced operational costs by 30-40% through strategic cloud migrations</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Team & Organizational Excellence</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                <li>Led and scaled 300+ person global teams across multiple time zones</li>
                <li>Built high-performing engineering organizations with 40% improvement in delivery velocity</li>
                <li>Established centers of excellence for AI/ML, cloud architecture, and DevOps</li>
                <li>Mentored 50+ senior leaders and technical architects</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Technology Innovation</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                <li>Architected enterprise AI/ML platforms supporting 100+ production models</li>
                <li>Designed cloud-native solutions processing 1B+ transactions daily</li>
                <li>Implemented intelligent automation reducing manual effort by 50,000+ hours annually</li>
                <li>Delivered zero-downtime migrations for mission-critical systems</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Business Impact</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1 ml-4">
                <li>Enabled 35% improvement in customer satisfaction through digital transformation</li>
                <li>Reduced time-to-market for new products by 60% through platform modernization</li>
                <li>Achieved 99.5% accuracy in automated processes through AI implementation</li>
                <li>Delivered $200M+ in business value through technology initiatives</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Skills */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Core Skills</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Leadership & Strategy</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Executive Leadership & Team Building</li>
                <li>• Strategic Portfolio Management</li>
                <li>• Program & Project Management</li>
                <li>• Stakeholder Management</li>
                <li>• Change Management & Transformation</li>
                <li>• Vendor & Partner Management</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Technology Stack</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Python, Databricks, LangChain</li>
                <li>• PL/SQL, JavaScript</li>
                <li>• GitLab CI/CD, Docker</li>
                <li>• Power BI, SAP BI</li>
                <li>• Blockchain Technologies</li>
                <li>• Cloud Platforms (AWS, Azure, GCP)</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Domain Knowledge</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Financial Services & Banking</li>
                <li>• Regulatory Compliance (SOX, GDPR)</li>
                <li>• Risk Management & Security</li>
                <li>• Digital Banking & Payments</li>
                <li>• Capital Markets & Trading Systems</li>
                <li>• Enterprise Software Development</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Methodologies & Practices</h3>
              <ul className="space-y-2 text-slate-300">
                <li>• Agile & Scrum Methodologies</li>
                <li>• SAFe (Scaled Agile Framework)</li>
                <li>• Design Thinking & User-Centered Design</li>
                <li>• Lean Startup & Product Management</li>
                <li>• Site Reliability Engineering (SRE)</li>
                <li>• ITIL & Service Management</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

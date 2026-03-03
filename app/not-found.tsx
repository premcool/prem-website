import Link from 'next/link';
import Section from '@/components/Section';

export default function NotFound() {
  return (
    <div className="py-12">
      <Section>
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">404</h1>
          <p className="text-xl text-slate-300 mb-8">Page not found</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </Section>
    </div>
  );
}

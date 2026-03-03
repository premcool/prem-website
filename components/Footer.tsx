import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} Prem Saktheesh. All rights reserved.</p>
            <p className="mt-1">
              <a href="mailto:prem@prems.in" className="hover:text-white transition-colors">
                prem@prems.in
              </a>
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="/"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

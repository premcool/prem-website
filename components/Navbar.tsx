import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-300 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

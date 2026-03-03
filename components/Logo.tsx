import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      {/* Logo Icon - Modern geometric design representing AI/Cloud transformation */}
      <div className="relative">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-110"
        >
          {/* Cloud shape */}
          <path
            d="M24 14C24.5304 14 25.0391 14.2107 15.4142 14.5858C25.7893 14.9609 26 15.4696 26 16C26 16.5304 25.7893 17.0391 25.4142 17.4142C25.0391 17.7893 24.5304 18 24 18H8C7.46957 18 6.96086 17.7893 6.58579 17.4142C6.21071 17.0391 6 16.5304 6 16C6 15.4696 6.21071 14.9609 6.58579 14.5858C6.96086 14.2107 7.46957 14 8 14H10C10 11.7909 11.7909 10 14 10C15.3807 10 16.6307 10.5571 17.5355 11.4645C18.4429 12.3693 19 13.6193 19 15H24Z"
            fill="url(#logoGradient)"
            className="transition-all group-hover:opacity-90"
          />
          {/* AI/Neural network nodes */}
          <circle cx="12" cy="16" r="1.5" fill="#60A5FA" className="animate-pulse" />
          <circle cx="16" cy="16" r="1.5" fill="#60A5FA" />
          <circle cx="20" cy="16" r="1.5" fill="#60A5FA" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          {/* Connection lines */}
          <path
            d="M12 16L16 16M16 16L20 16"
            stroke="#60A5FA"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Prem Saktheesh
        </span>
      )}
    </Link>
  );
}

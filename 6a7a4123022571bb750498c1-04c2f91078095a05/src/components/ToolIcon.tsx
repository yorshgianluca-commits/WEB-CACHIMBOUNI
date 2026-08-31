type ToolIconProps = {
  name: string;
  size?: number;
  className?: string;
};

export default function ToolIcon({ name, size = 28, className }: ToolIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "anki":
      return (
        <svg {...common}>
          <rect x="8" y="6" width="32" height="36" rx="5" fill="currentColor" opacity="0.18" />
          <rect x="12" y="10" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2.2" />
          <path d="M18 20h12M18 26h8M18 32h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="34" cy="14" r="5" fill="currentColor" />
        </svg>
      );
    case "pdf":
      return (
        <svg {...common}>
          <path d="M14 6h14l10 10v26a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="currentColor" opacity="0.16" />
          <path d="M28 6v10h10" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M14 6h14l10 10v26a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2.2" />
          <path d="M17 30c2.5-6 5-9 8-9s3.2 4 1.5 9c3.5 0 7 1.2 7 3.2 0 2.3-4.5 2.8-8.5 1.4C22 37 18.5 37 17 34.8 15.6 32.8 15.8 31.2 17 30Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "onenote":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" opacity="0.16" />
          <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="2.2" />
          <path d="M18 16v16M18 16h7c3.3 0 6 2.2 6 6s-2.7 6-6 6h-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "inkodo":
      return (
        <svg {...common}>
          <rect x="7" y="10" width="34" height="28" rx="5" fill="currentColor" opacity="0.14" />
          <rect x="7" y="10" width="34" height="28" rx="5" stroke="currentColor" strokeWidth="2.2" />
          <path d="M14 30c4-8 7-12 11-12 3 0 4 4 2 8 4 0 6-2 9 2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <path d="M30 14l6-3 2 6-6 3-2-6Z" fill="currentColor" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M28 10c1.4 3.8 4.3 6.4 8 7v5.2c-2.8-.1-5.3-1-7.4-2.5v10.8a9.4 9.4 0 1 1-9.4-9.4c.5 0 1 .1 1.5.2v5.3a4.3 4.3 0 1 0 3 4V10h4.3Z" fill="currentColor" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="5" y="12" width="38" height="24" rx="8" fill="currentColor" opacity="0.16" />
          <rect x="5" y="12" width="38" height="24" rx="8" stroke="currentColor" strokeWidth="2.2" />
          <path d="M21 18.5v11l11-5.5-11-5.5Z" fill="currentColor" />
        </svg>
      );
    case "sketch":
      return (
        <svg {...common}>
          <path d="M24 7 40 18 24 41 8 18 24 7Z" fill="currentColor" opacity="0.14" />
          <path d="M24 7 40 18 24 41 8 18 24 7Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M8 18h32M16.5 18 24 41 31.5 18" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.14" />
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.2" />
          <path d="M22 34c1-4 2.2-7.8 1-11 1.3-1.1 2.4-2.7 2.2-4.3-.3-2.2-2-3.1-4-2.5-2.4.7-3.4 3.3-2.5 5.7.4 1 .1 2.3-.7 3.1-1.6-2.9-1.3-6.7 1.1-8.8 2.9-2.5 7.5-1.8 9.2 1.5 1.7 3.3.2 7.5-2.8 9 1 .4 2 .2 2.7-.7 2-2.4 1.7-7.3-.5-9.9-3.1-3.6-9.4-3-12.1.9-2.3 3.3-1.5 8.5 1.9 10.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "chatgpt":
      return (
        <svg {...common}>
          <path d="M24 8c3.2 0 6 1.7 7.5 4.3 1.8-.7 3.9-.5 5.5.8 2.3 1.8 2.9 5 1.6 7.5 1.7 1.5 2.7 3.7 2.4 6-.4 3.5-3.2 6.1-6.7 6.5-.2 2-1.3 3.9-3 5.1-2.5 1.7-5.9 1.5-8.2-.3-1.8 1.1-4 1.4-6.1.7-3.2-1-5.2-4.1-4.8-7.4-1.8-1.5-2.8-3.7-2.5-6 .4-3.4 3.1-5.9 6.5-6.4.3-2 1.4-3.8 3.1-5C20.2 8.7 22.1 8 24 8Z" fill="currentColor" opacity="0.14" />
          <path d="M24 14.5c1.5 0 2.9.8 3.6 2.1l.4.8.9-.2a3.4 3.4 0 0 1 3.8 2.1 3.4 3.4 0 0 1-1.1 3.9l-.7.5.2.9a3.4 3.4 0 0 1-2.2 3.8l-.8.2-.4.8a3.4 3.4 0 0 1-5.9 0l-.4-.8-.9.2a3.4 3.4 0 0 1-3.8-2.1 3.4 3.4 0 0 1 1.1-3.9l.7-.5-.2-.9a3.4 3.4 0 0 1 2.2-3.8l.8-.2.4-.8A3.4 3.4 0 0 1 24 14.5Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "gemini":
      return (
        <svg {...common}>
          <path d="M24 6c1.8 8.2 9.8 16.2 18 18-8.2 1.8-16.2 9.8-18 18-1.8-8.2-9.8-16.2-18-18 8.2-1.8 16.2-9.8 18-18Z" fill="currentColor" opacity="0.16" />
          <path d="M24 6c1.8 8.2 9.8 16.2 18 18-8.2 1.8-16.2 9.8-18 18-1.8-8.2-9.8-16.2-18-18 8.2-1.8 16.2-9.8 18-18Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "deepseek":
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" fill="currentColor" opacity="0.14" />
          <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16 28c2.5-8 6-12 12-12 2 0 4 .7 5 2-3 1-5.5 3.5-7 8-1 3-1.5 5.5-1.5 8" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
          <circle cx="30" cy="18" r="2.2" fill="currentColor" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <rect x="8" y="10" width="32" height="30" rx="5" fill="currentColor" opacity="0.14" />
          <rect x="8" y="10" width="32" height="30" rx="5" stroke="currentColor" strokeWidth="2.2" />
          <path d="M8 18h32M16 7v8M32 7v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="14" y="24" width="6" height="6" rx="1.2" fill="currentColor" />
          <rect x="21" y="24" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.55" />
          <rect x="28" y="24" width="6" height="6" rx="1.2" fill="currentColor" opacity="0.35" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="2.2" />
          <path d="M18 24h12M24 18v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
}

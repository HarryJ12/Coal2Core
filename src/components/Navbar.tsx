'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const NAV_TABS = [
  { label: 'Home', href: '/' },
  { label: 'Our Philosophy', href: '/methodologies' },
  { label: 'Importance', href: '/importance' },
  { label: 'Addressing Fears', href: '/addressing-fears' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#0d0d0d] border-b border-[#1e1e1e] flex items-center px-6 h-16 shrink-0 z-50">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-3 text-white font-semibold text-3xl tracking-widest uppercase mr-10 whitespace-nowrap hover:text-[#22c55e] transition-colors duration-200"
      >
        <Image
          src="/reactorlogo.png"
          alt="Reactor logo"
          width={56}
          height={56}
          className="object-contain"
        />
        <span className="flex flex-col leading-tight">
          <span>Coal2Core</span>
        </span>
      </Link>

      {/* Tabs */}
      <div className="flex items-center gap-1 h-full">
        {NAV_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                'relative px-5 h-full flex items-center text-base tracking-wider uppercase font-medium transition-colors duration-200',
                isActive
                  ? 'text-[#22c55e]'
                  : 'text-neutral-400 hover:text-neutral-100',
              ].join(' ')}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22c55e]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

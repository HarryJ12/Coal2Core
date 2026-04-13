'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_TABS = [
  { label: 'Home', href: '/' },
  { label: 'Our Philosophy', href: '/methodologies' },
  { label: 'Importance', href: '/importance' },
  { label: 'Addressing Fears', href: '/addressing-fears' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="w-full bg-[#0d0d0d] border-b border-[#1e1e1e] shrink-0 z-50">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 sm:gap-3 text-white font-semibold text-lg sm:text-2xl tracking-[0.18em] uppercase whitespace-nowrap hover:text-[#22c55e] transition-colors duration-200"
        >
          <Image
            src="/reactorlogo.png"
            alt="Reactor logo"
            width={44}
            height={44}
            className="object-contain"
          />
          <span className="leading-tight">Coal2Core</span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="text-xl leading-none">{menuOpen ? '×' : '≡'}</span>
        </button>

        <div className="hidden md:flex items-center gap-1 h-full">
          {NAV_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={[
                  'relative px-4 lg:px-5 h-full flex items-center text-sm lg:text-base tracking-wider uppercase font-medium transition-colors duration-200',
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
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-[#111111] px-4 py-3 space-y-1">
          {NAV_TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={closeMenu}
                className={[
                  'block px-3 py-2 rounded text-sm tracking-wider uppercase transition-colors',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-700/60'
                    : 'text-zinc-300 hover:bg-zinc-800/80',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

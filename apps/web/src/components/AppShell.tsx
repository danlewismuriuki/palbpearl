'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

function NavIconHome({ active }: { active: boolean }) {
  const fill = active ? 'currentColor' : 'currentColor';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill={fill}
        d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z"
      />
    </svg>
  );
}

function NavIconFarm({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        fillOpacity={active ? 1 : 0.7}
        d="M4 20h16v-2H4v2zm2-8h4v6H6v-6zm6 0h4v6h-4v-6zM3 10l3-6h12l3 6v2H3v-2z"
      />
    </svg>
  );
}

function NavIconLearn({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        fillOpacity={active ? 1 : 0.7}
        d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.5L4 12v5l8 4.5 8-4.5v-5l-8 4.5z"
      />
    </svg>
  );
}

function NavIconHelp({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        fillOpacity={active ? 1 : 0.7}
        d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V9.5c0-1.66 3-1.54 3 0V13z"
      />
    </svg>
  );
}

function NavIconMarket({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path
        fill="currentColor"
        fillOpacity={active ? 1 : 0.7}
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7.17 14h9.66l2.5-7H4.67l2.5 7zM6 6h15l-1 4H7L6 6z"
      />
    </svg>
  );
}

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  match: (path: string) => boolean;
  Icon: (p: { active: boolean }) => ReactNode;
}> = [
  {
    href: '/home',
    label: 'Home',
    match: (path) => path === '/home',
    Icon: NavIconHome,
  },
  // TODO: Farm → /farm when route exists
  {
    href: '#',
    label: 'Farm',
    match: () => false,
    Icon: NavIconFarm,
  },
  // TODO: Learn → /learn
  {
    href: '#',
    label: 'Learn',
    match: () => false,
    Icon: NavIconLearn,
  },
  // TODO: Help → /help
  {
    href: '#',
    label: 'Help',
    match: () => false,
    Icon: NavIconHelp,
  },
  // TODO: Market → /market
  {
    href: '#',
    label: 'Market',
    match: () => false,
    Icon: NavIconMarket,
  },
];

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export default function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const update = () => {
      setIsOnline(typeof navigator !== 'undefined' && navigator.onLine);
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col border-divider bg-background shadow-md">
        <header className="sticky top-0 z-20 flex min-h-12 items-center justify-between gap-2 border-b border-divider bg-surface px-4 py-2">
          <h1 className="truncate text-h3 font-bold text-text-primary">{title}</h1>
          <span
            role="status"
            className={`inline-flex min-h-8 shrink-0 items-center rounded-full px-3 text-caption font-semibold ${
              isOnline
                ? 'bg-success/15 text-success'
                : 'bg-warning/15 text-warning'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 pb-24 pt-4">{children}</main>

        <nav
          className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-divider bg-surface"
          aria-label="Main"
        >
          <ul className="flex h-14 min-h-12 w-full items-stretch">
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname ?? '');
              const Icon = item.Icon;
              return (
                <li key={item.label} className="flex min-h-12 flex-1">
                  <Link
                    href={item.href}
                    className={`flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-caption font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                      active
                        ? 'text-brand-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    <Icon active={active} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
'use client';

import AppShell from '@/components/AppShell';
import { usePathname } from 'next/navigation';

const TITLES: Record<string, string> = {
  '/home': 'Home',
  '/darkroom': 'Darkroom',
  '/production': 'Production',
  '/support': 'Support',
};

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title = TITLES[pathname ?? ''] ?? 'PalBpearl';

  return <AppShell title={title}>{children}</AppShell>;
}
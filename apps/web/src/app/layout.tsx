import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PalBpearl',
  description: 'PalBpearl health check',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body
        className="min-h-screen overflow-x-hidden antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
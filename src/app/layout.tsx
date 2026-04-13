import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Coal to Core Initiative — SMR Suitability Map',
  description:
    'Interactive map scoring retired US coal plants for Small Modular Reactor conversion viability.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}

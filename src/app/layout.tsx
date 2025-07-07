
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import MainLayout from '@/components/layout/MainLayout';
import { Inter, Space_Grotesk, Amiri } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-space-grotesk',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

export const metadata: Metadata = {
  title: 'SoulRefine',
  description: 'Train your soul. Refine your character.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${amiri.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <NotificationProvider>
            <MainLayout>{children}</MainLayout>
          </NotificationProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

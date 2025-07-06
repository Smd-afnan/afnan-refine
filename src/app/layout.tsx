import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NotificationProvider } from '@/components/notifications/NotificationProvider';
import MainLayout from '@/components/layout/MainLayout';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
         <link href="https://fonts.googleapis.com/css2?family=Amiri&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NotificationProvider>
          <MainLayout>{children}</MainLayout>
        </NotificationProvider>
        <Toaster />
      </body>
    </html>
  );
}

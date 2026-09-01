import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ScrollbarActivity } from '@/components/scrollbar-activity';
import './globals.css';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider } from '@/context/theme-context';
import { UserProvider } from '@/context/user-context';
import { DataProvider } from '@/context/data-context';

if (typeof window === 'undefined' && typeof globalThis.localStorage?.getItem !== 'function') {
  Reflect.deleteProperty(globalThis, 'localStorage');
}

export const metadata: Metadata = {
  title: 'VulnForce',
  description: 'Herramienta profesional para informes de pentesting.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <UserProvider>
              <DataProvider>
                {children}
                <Toaster />
                <ScrollbarActivity />
              </DataProvider>
            </UserProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

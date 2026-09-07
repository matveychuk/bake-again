import type { Metadata } from 'next';
import { Manrope, Newsreader } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Bake Again — Tested gluten-free baking',
  description:
    'An exploratory homepage for a small collection of carefully tested gluten-free recipes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${newsreader.variable}`}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}

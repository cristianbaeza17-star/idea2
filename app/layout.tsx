import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supabase Idea Box',
  description: 'A secure application to log in and save your ideas for future reference, built with Supabase and Next.js.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-gray-900 text-white antialiased">{children}</body>
    </html>
  );
}

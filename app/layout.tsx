import './globals.css';

export const metadata = {
  title: 'Lidwoord-spel',
  description: 'Oefen Nederlandse lidwoorden (de/het).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="min-h-dvh antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}

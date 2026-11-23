import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Fantasy Basketball XYZ',
  description: 'Weekly fantasy basketball scored from real NBA stats.',
};

/** Root layout. Placeholder until the front-end shell milestone. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

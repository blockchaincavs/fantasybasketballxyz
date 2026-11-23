import type { ReactElement } from 'react';
import RootLayout, { metadata } from '@/app/layout';

it('wraps pages in html/body with English as the language', () => {
  const html = RootLayout({ children: 'x' }) as ReactElement<{ lang: string }>;
  expect(html.props.lang).toBe('en');
  expect(metadata.title).toBe('Fantasy Basketball XYZ');
});

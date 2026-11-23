import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

it('renders the home heading', () => {
  render(<HomePage />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fantasy Basketball XYZ');
});

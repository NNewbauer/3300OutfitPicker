import { render, screen } from '@testing-library/react';
import DominantColor from './DominantColor';

test('renders learn react link', () => {
  render(<DominantColor />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

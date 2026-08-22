import { render, screen } from '@testing-library/react';
import App from './App';
import codeStatus from './status_codes.json';

const allCodes = codeStatus.flatMap(category => category.codes);

test('la home pinta una tarjeta por cada código de estado', () => {
  render(<App />);
  allCodes.forEach(item => {
    expect(screen.getByRole('heading', { name: String(item.code) })).toBeInTheDocument();
  });
});

test('ninguna imagen se queda sin src ni sin texto alternativo', () => {
  render(<App />);
  const images = screen.getAllByRole('img');

  expect(images).toHaveLength(allCodes.length);
  images.forEach(img => {
    expect(img.getAttribute('src')).toBeTruthy();
    expect(img.getAttribute('alt')).toBeTruthy();
    expect(img.getAttribute('src')).toMatch(/^(\/ducks\/\d{3}\.jpg|data:image\/)/);
  });
});

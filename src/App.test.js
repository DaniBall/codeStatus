import { render, screen, fireEvent, within } from '@testing-library/react';
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

describe('buscador', () => {
  const escribir = valor =>
    fireEvent.change(screen.getByLabelText(/search status codes/i), { target: { value: valor } });

  test('al arrancar están todos', () => {
    render(<App />);
    expect(screen.getAllByRole('img')).toHaveLength(allCodes.length);
    expect(screen.getByRole('status')).toHaveTextContent(`${allCodes.length} status codes`);
  });

  test('filtrar deja sólo lo que encaja', () => {
    render(<App />);
    escribir('teapot');

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: '418' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '404' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(`1 of ${allCodes.length}`);
  });

  test('el índice se queda sólo con las familias que quedan', () => {
    render(<App />);
    escribir('nginx');

    const indice = screen.getByRole('navigation', { name: /families/i });
    expect(within(indice).getAllByRole('link').map(a => a.textContent)).toEqual(['In the wild']);
  });

  test('sin resultados avisa y deja limpiar', () => {
    render(<App />);
    escribir('zzzznope');

    expect(screen.queryAllByRole('img')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(screen.getAllByRole('img')).toHaveLength(allCodes.length);
  });
});

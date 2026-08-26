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

describe('volver arriba', () => {
  const scrollA = y => {
    window.scrollY = y;
    fireEvent.scroll(window);
  };

  afterEach(() => { window.scrollY = 0; });

  test('no aparece hasta haber bajado un buen tramo', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();

    scrollA(1200);
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });

  test('al pulsarlo sube del todo, y se esconde al volver arriba', () => {
    const subir = jest.fn();
    window.scrollTo = subir;

    render(<App />);
    scrollA(1200);
    fireEvent.click(screen.getByRole('button', { name: /back to top/i }));
    expect(subir).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));

    scrollA(0);
    expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument();
  });
});

describe('estado de los códigos', () => {
  test('un código retirado lo dice en su tarjeta', () => {
    render(<App />);
    const tarjeta = screen.getByRole('heading', { name: '102' }).closest('article');
    expect(within(tarjeta).getByText('Deprecated')).toBeInTheDocument();
  });

  test('se puede buscar por estado', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/search status codes/i), {
      target: { value: 'deprecated' },
    });

    const codigos = screen.getAllByRole('img').map(img => img.getAttribute('src'));
    expect(codigos).toHaveLength(3);
    expect(screen.getByRole('heading', { name: '102' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '305' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '510' })).toBeInTheDocument();
  });
});

describe('analítica', () => {
  test('sin configurar no carga ningún script externo ni lo promete en el pie', () => {
    render(<App />);

    const externos = [...document.querySelectorAll('script[src]')]
      .filter(s => /^https?:/.test(s.getAttribute('src')));
    expect(externos).toHaveLength(0);
    expect(screen.queryByText(/goatcounter/i)).not.toBeInTheDocument();
  });
});

import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import codeStatus from './status_codes.json';
import { TAG_MEANINGS } from './tags';

const allCodes = codeStatus.flatMap(category => category.codes);

// El router lee la URL de verdad, así que una prueba que navega deja a la
// siguiente empezando en la ficha en vez de en la portada.
beforeEach(() => window.history.pushState({}, '', '/'));

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
  const leyenda = () => screen.getByText(/what do the badges mean/i).closest('details');

  test('un código retirado lo dice en su tarjeta', () => {
    render(<App />);
    const tarjeta = screen.getByRole('heading', { name: '102' }).closest('article');
    expect(within(tarjeta).getByText('Deprecated')).toBeInTheDocument();
  });

  test('la portada explica las insignias sin depender del hover', () => {
    // En un móvil el title de la tarjeta no se puede sacar de ninguna manera.
    render(<App />);
    const leyenda = screen.getByText(/what do the badges mean/i).closest('details');

    Object.entries(TAG_MEANINGS).forEach(([tag, significado]) => {
      expect(within(leyenda).getByText(tag)).toBeInTheDocument();
      expect(within(leyenda).getByText(significado)).toBeInTheDocument();
    });
  });

  test('la ficha dice qué quiere decir cada insignia', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('heading', { name: '102' }).closest('a'));

    // La de la etiqueta y la del código: explican cosas distintas.
    expect(screen.getByText(TAG_MEANINGS['No body'])).toBeInTheDocument();
    expect(screen.getByText(TAG_MEANINGS.Deprecated)).toBeInTheDocument();
    expect(screen.getByText(/dropped in RFC 4918/i)).toBeInTheDocument();
  });

  test('pulsar una insignia de la leyenda filtra el catálogo', () => {
    render(<App />);
    fireEvent.click(within(leyenda()).getByRole('button', { name: 'Deprecated' }));

    expect(screen.getAllByRole('img')).toHaveLength(3);
    [102, 305, 510].forEach(code => {
      expect(screen.getByRole('heading', { name: String(code) })).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveTextContent('Showing 3 of 85');
  });

  test('el filtro se quita desde arriba o volviendo a pulsarlo', () => {
    render(<App />);
    const pulsar = () => fireEvent.click(within(leyenda()).getByRole('button', { name: 'Joke' }));

    pulsar();
    expect(screen.getAllByRole('img')).toHaveLength(1);

    pulsar(); // La misma insignia otra vez lo desactiva.
    expect(screen.getAllByRole('img')).toHaveLength(allCodes.length);

    pulsar();
    fireEvent.click(screen.getByRole('button', { name: /clear filter/i }));
    expect(screen.getAllByRole('img')).toHaveLength(allCodes.length);
    expect(screen.queryByRole('button', { name: /clear filter/i })).not.toBeInTheDocument();
  });

  test('la insignia activa se distingue de las demás', () => {
    render(<App />);
    fireEvent.click(within(leyenda()).getByRole('button', { name: 'Reserved' }));

    const botones = within(leyenda()).getAllByRole('button');
    const pulsadas = botones.filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(pulsadas.map(b => b.textContent)).toEqual(['Reserved']);
  });

  test('el filtro mira la etiqueta, no el texto', () => {
    // "Reserved" sale en la descripción del 402 y del 306, pero sólo el 306
    // lleva la insignia. Buscando por texto saldrían los dos.
    render(<App />);
    fireEvent.click(within(leyenda()).getByRole('button', { name: 'Reserved' }));

    expect(screen.getByRole('heading', { name: '306' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '402' })).not.toBeInTheDocument();
  });

  test('insignia y búsqueda se acumulan', () => {
    render(<App />);
    fireEvent.click(within(leyenda()).getByRole('button', { name: 'No body' }));
    fireEvent.change(screen.getByLabelText(/search status codes/i), {
      target: { value: '304' },
    });

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: '304' })).toBeInTheDocument();
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

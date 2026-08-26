import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import codeStatus from './status_codes.json';
import { TAGS } from './tags';
import en from './data/textos.en.json';

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

describe('idioma', () => {
  const conNavegador = idiomas => {
    Object.defineProperty(window.navigator, 'languages', {
      value: idiomas,
      configurable: true,
    });
  };

  afterEach(() => {
    window.localStorage.clear();
    conNavegador(['en-US']);
    document.documentElement.lang = 'en';
  });

  test('sale en el idioma del navegador sin tocar nada', () => {
    conNavegador(['es-ES']);
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('85 códigos de estado');
    expect(screen.getByLabelText(/buscar códigos de estado/i)).toBeInTheDocument();
    // El <html lang> también, que de ahí sale la pronunciación de un lector.
    expect(document.documentElement.lang).toBe('es');
  });

  test('un idioma que no tenemos cae en inglés', () => {
    conNavegador(['fr-FR']);
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent('85 status codes');
    expect(document.documentElement.lang).toBe('en');
  });

  test('el botón cambia de idioma y la elección manda sobre el navegador', () => {
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('85 status codes');

    fireEvent.click(screen.getByRole('button', { name: /ver en español/i }));

    expect(screen.getByRole('status')).toHaveTextContent('85 códigos de estado');
    expect(document.documentElement.lang).toBe('es');
    // Y se recuerda, para que no haya que elegirlo en cada visita.
    expect(window.localStorage.getItem('codestatus-lang')).toBe('es');
  });

  test('en español se traducen las secciones, las insignias y las fichas', () => {
    conNavegador(['es']);
    render(<App />);

    expect(screen.getByRole('heading', { name: 'En la práctica' })).toBeInTheDocument();
    const tarjeta = screen.getByRole('heading', { name: '102' }).closest('article');
    expect(within(tarjeta).getByText('Obsoleto')).toBeInTheDocument();
    expect(within(tarjeta).getByText('Sin cuerpo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('heading', { name: '102' }).closest('a'));
    expect(screen.getByText(/venía de webdav/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /todos los códigos/i })).toBeInTheDocument();
  });

  test('el nombre del código no se traduce: es lo que devuelve el protocolo', () => {
    conNavegador(['es']);
    render(<App />);

    const tarjeta = screen.getByRole('heading', { name: '404' }).closest('article');
    expect(within(tarjeta).getByText('Not Found')).toBeInTheDocument();
  });

  test('en español se busca en español, con tilde o sin ella', () => {
    conNavegador(['es']);
    render(<App />);
    const escribir = valor =>
      fireEvent.change(screen.getByLabelText(/buscar códigos de estado/i), {
        target: { value: valor },
      });

    escribir('tetera');
    expect(screen.getByRole('heading', { name: '418' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);

    // Sin tilde tiene que encontrar lo mismo que con ella.
    escribir('codigo');
    const sinTilde = screen.getAllByRole('img').length;
    escribir('código');
    expect(screen.getAllByRole('img')).toHaveLength(sinTilde);
    expect(sinTilde).toBeGreaterThan(0);
  });
});

describe('estado de los códigos', () => {
  const filtros = () => screen.getByRole('group', { name: /filter by badge/i });

  test('un código retirado lo dice en su tarjeta', () => {
    render(<App />);
    const tarjeta = screen.getByRole('heading', { name: '102' }).closest('article');
    expect(within(tarjeta).getByText('Deprecated')).toBeInTheDocument();
  });

  test('el índice lleva un filtro por cada insignia', () => {
    render(<App />);
    const botones = within(filtros()).getAllByRole('button');

    expect(botones.map(b => b.textContent)).toEqual(TAGS);
    // En la portada el significado sólo está aquí, y en hover: la explicación
    // entera vive en la ficha.
    botones.forEach(boton => {
      expect(boton).toHaveAttribute('title', en.insignias[boton.textContent].significado);
    });
  });

  test('la ficha dice qué quiere decir cada insignia', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('heading', { name: '102' }).closest('a'));

    // La de la etiqueta y la del código: explican cosas distintas.
    expect(screen.getByText(en.insignias['No body'].significado)).toBeInTheDocument();
    expect(screen.getByText(en.insignias.Deprecated.significado)).toBeInTheDocument();
    expect(screen.getByText(/dropped in RFC 4918/i)).toBeInTheDocument();
  });

  test('pulsar una insignia del índice filtra el catálogo', () => {
    render(<App />);
    fireEvent.click(within(filtros()).getByRole('button', { name: 'Deprecated' }));

    expect(screen.getAllByRole('img')).toHaveLength(3);
    [102, 305, 510].forEach(code => {
      expect(screen.getByRole('heading', { name: String(code) })).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveTextContent('Showing 3 of 85');
  });

  test('el filtro se quita desde arriba o volviendo a pulsarlo', () => {
    render(<App />);
    const pulsar = () => fireEvent.click(within(filtros()).getByRole('button', { name: 'Joke' }));

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
    fireEvent.click(within(filtros()).getByRole('button', { name: 'Reserved' }));

    const botones = within(filtros()).getAllByRole('button');
    const pulsadas = botones.filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(pulsadas.map(b => b.textContent)).toEqual(['Reserved']);
  });

  test('el filtro mira la etiqueta, no el texto', () => {
    // "Reserved" sale en la descripción del 402 y del 306, pero sólo el 306
    // lleva la insignia. Buscando por texto saldrían los dos.
    render(<App />);
    fireEvent.click(within(filtros()).getByRole('button', { name: 'Reserved' }));

    expect(screen.getByRole('heading', { name: '306' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '402' })).not.toBeInTheDocument();
  });

  test('insignia y búsqueda se acumulan', () => {
    render(<App />);
    fireEvent.click(within(filtros()).getByRole('button', { name: 'No body' }));
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

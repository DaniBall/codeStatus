import { render, screen, fireEvent, act } from '@testing-library/react';
import DuckImage from './DuckImage';

const teapot = { code: 418, name: "I'm a teapot" };

test('pide la imagen al generador y avisa mientras la crea', () => {
    render(<DuckImage statusCode={teapot} />);

    expect(screen.getByRole('img').getAttribute('src')).toMatch(/^https:\/\//);
    expect(screen.getByText(/generando pato/i)).toBeInTheDocument();
});

test('si el generador falla cae en el pato dibujado en local', () => {
    render(<DuckImage statusCode={teapot} />);
    const img = screen.getByRole('img');

    fireEvent.error(img);

    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(screen.queryByText(/generando pato/i)).not.toBeInTheDocument();
});

test('una foto fijada a mano en el JSON tiene prioridad sobre el generador', () => {
    const pinned = { code: 206, name: 'Partial Content', image: 'data:image/jpeg;base64,AAAA' };
    render(<DuckImage statusCode={pinned} />);

    expect(screen.getByRole('img').getAttribute('src')).toBe(pinned.image);
    expect(screen.queryByText(/generando pato/i)).not.toBeInTheDocument();
});

test('si el generador no contesta a tiempo también cae en el pato local', () => {
    jest.useFakeTimers();
    try {
        render(<DuckImage statusCode={teapot} timeoutMs={1000} />);
        const img = screen.getByRole('img');
        expect(img.getAttribute('src')).toMatch(/^https:\/\//);

        act(() => { jest.advanceTimersByTime(1001); });

        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    } finally {
        jest.useRealTimers();
    }
});

test('una imagen que ya falló antes de montar el componente se detecta igual', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLImageElement.prototype, 'complete');
    Object.defineProperty(window.HTMLImageElement.prototype, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(window.HTMLImageElement.prototype, 'naturalWidth', { configurable: true, get: () => 0 });
    try {
        render(<DuckImage statusCode={teapot} />);
        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    } finally {
        delete window.HTMLImageElement.prototype.naturalWidth;
        if (descriptor) Object.defineProperty(window.HTMLImageElement.prototype, 'complete', descriptor);
        else delete window.HTMLImageElement.prototype.complete;
    }
});

test('el pato de respaldo no devuelve la tarjeta a la url rota al cargarse', () => {
    render(<DuckImage statusCode={teapot} />);
    const img = screen.getByRole('img');

    fireEvent.error(img);
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);

    // El respaldo carga bien y dispara su propio onLoad: debe quedarse puesto.
    fireEvent.load(img);
    expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
});

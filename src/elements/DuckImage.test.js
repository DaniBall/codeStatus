import { render, screen, fireEvent, act } from '@testing-library/react';
import DuckImage from './DuckImage';
import { MAX_CONCURRENT, queueStats, resetQueue } from '../duckQueue';

const teapot = { code: 418, name: "I'm a teapot" };

beforeEach(() => resetQueue());

test('pide la imagen al generador y avisa mientras la crea', () => {
    render(<DuckImage statusCode={teapot} />);

    expect(screen.getByRole('img').getAttribute('src')).toMatch(/^https:\/\//);
    expect(screen.getByText(/generando pato/i)).toBeInTheDocument();
});

test('reintenta una vez y luego se queda con el pato local', () => {
    jest.useFakeTimers();
    try {
        render(<DuckImage statusCode={teapot} />);
        fireEvent.error(screen.getByRole('img'));

        act(() => { jest.advanceTimersByTime(5000); });
        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^https:\/\//);

        fireEvent.error(screen.getByRole('img'));
        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
        expect(screen.queryByText(/generando pato/i)).not.toBeInTheDocument();
    } finally {
        jest.useRealTimers();
    }
});

test('si el generador no contesta a tiempo también cae en el pato local', () => {
    jest.useFakeTimers();
    try {
        render(<DuckImage statusCode={teapot} timeoutMs={1000} />);
        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^https:\/\//);

        act(() => { jest.advanceTimersByTime(1001); });

        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    } finally {
        jest.useRealTimers();
    }
});

test('el pato de respaldo no devuelve la tarjeta a la url rota al cargarse', () => {
    jest.useFakeTimers();
    try {
        render(<DuckImage statusCode={teapot} timeoutMs={1000} />);
        act(() => { jest.advanceTimersByTime(1001); });
        const img = screen.getByRole('img');
        expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);

        // El respaldo carga bien y dispara su propio onLoad: debe quedarse puesto.
        fireEvent.load(img);
        expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    } finally {
        jest.useRealTimers();
    }
});

test('una foto fijada a mano en el JSON tiene prioridad sobre el generador', () => {
    const pinned = { code: 206, name: 'Partial Content', image: 'data:image/jpeg;base64,AAAA' };
    render(<DuckImage statusCode={pinned} />);

    expect(screen.getByRole('img').getAttribute('src')).toBe(pinned.image);
    expect(screen.queryByText(/generando pato/i)).not.toBeInTheDocument();
    expect(queueStats().running).toBe(0);
});

test('no genera más imágenes a la vez de las que permite la cola', () => {
    const codes = [400, 401, 402, 403, 404, 405, 408].map(code => ({ code, name: `Code ${code}` }));
    render(<>{codes.map(c => <DuckImage key={c.code} statusCode={c} />)}</>);

    const asking = screen.getAllByRole('img')
        .filter(img => img.getAttribute('src').startsWith('https://'));

    expect(asking).toHaveLength(MAX_CONCURRENT);
    expect(queueStats()).toEqual({ running: MAX_CONCURRENT, waiting: codes.length - MAX_CONCURRENT });
});

test('al cargar una imagen deja el turno libre para la siguiente', () => {
    const codes = [400, 401, 402, 403, 404].map(code => ({ code, name: `Code ${code}` }));
    render(<>{codes.map(c => <DuckImage key={c.code} statusCode={c} />)}</>);

    const first = screen.getAllByRole('img')
        .find(img => img.getAttribute('src').startsWith('https://'));
    fireEvent.load(first);

    expect(queueStats()).toEqual({ running: MAX_CONCURRENT, waiting: codes.length - MAX_CONCURRENT - 1 });
});

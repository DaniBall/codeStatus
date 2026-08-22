import { render, screen, fireEvent } from '@testing-library/react';
import DuckImage from './DuckImage';

const teapot = { code: 418, name: "I'm a teapot" };

test('carga la foto pregenerada del código', () => {
    render(<DuckImage statusCode={teapot} />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/ducks/418.jpg');
    expect(img.getAttribute('loading')).toBe('lazy');
});

test('si la foto no existe todavía, cae en el pato dibujado', () => {
    render(<DuckImage statusCode={teapot} />);
    const img = screen.getByRole('img');

    fireEvent.error(img);

    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(img.getAttribute('alt')).toMatch(/placeholder/i);
});

test('el pato de respaldo se queda puesto al cargarse', () => {
    render(<DuckImage statusCode={teapot} />);
    const img = screen.getByRole('img');

    fireEvent.error(img);
    fireEvent.load(img);

    expect(screen.getByRole('img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
});

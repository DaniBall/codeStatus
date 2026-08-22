import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('lleva el aviso de copyright con el año en curso', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
    expect(screen.getByText(/Daniel Bola Martínez/)).toBeInTheDocument();
});

test('enlaza al repositorio, y se abre fuera sin filtrar la página', () => {
    render(<Footer />);
    const enlace = screen.getByRole('link', { name: /source on github/i });

    expect(enlace).toHaveAttribute('href', 'https://github.com/DaniBall/codeStatus');
    expect(enlace).toHaveAttribute('target', '_blank');
    expect(enlace.getAttribute('rel')).toContain('noopener');
});

test('dice de dónde salen los datos y las fotos', () => {
    render(<Footer />);
    expect(screen.getByText(/IANA HTTP Status Code Registry/)).toBeInTheDocument();
    expect(screen.getByText(/AI-generated/)).toBeInTheDocument();
});

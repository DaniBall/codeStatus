/** Sube del todo, de golpe para quien haya pedido menos movimiento. */
export function subirArriba() {
    const suave = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })
}

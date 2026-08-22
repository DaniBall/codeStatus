/**
 * Imágenes de patos de cada código de estado.
 *
 * Las fotos se generan una sola vez con `npm run ducks` y se guardan en
 * `public/ducks/<código>.jpg`. La web se limita a cargar ese fichero, así que
 * aparecen al instante. Si todavía no existe (o falla), se dibuja un pato SVG
 * en local y la tarjeta nunca se queda con una imagen rota.
 */
import duckData from './data/duckScenes.json'

/** Carpeta, dentro de `public/`, donde viven las fotos pregeneradas. */
export const DUCKS_DIR = 'ducks'

/** Colores por familia de código, usados en la imagen de respaldo. */
const CATEGORY_COLORS = {
    1: { sky: '#9ad0f5', ground: '#5fa8d3' },
    2: { sky: '#a8e6a1', ground: '#4caf50' },
    3: { sky: '#ffd98e', ground: '#f0a202' },
    4: { sky: '#ffb3a7', ground: '#e5534b' },
    5: { sky: '#c9b6e4', ground: '#7b5ea7' },
}

/** Devuelve la escena descrita para un código, o `undefined` si no existe. */
export function getDuckScene(code) {
    return duckData.scenes[String(code)]
}

/** Ruta pública de la foto pregenerada de un código. */
export function duckImagePath(code) {
    return `${process.env.PUBLIC_URL || ''}/${DUCKS_DIR}/${code}.jpg`
}

/** Escapa el texto que se incrusta en el SVG de respaldo. */
function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

/**
 * Pato dibujado localmente en SVG, para cuando no hay foto pregenerada.
 * No depende de la red ni de ningún fichero.
 */
export function buildDuckFallback(code, name = '') {
    const family = Number(String(code).charAt(0))
    const { sky, ground } = CATEGORY_COLORS[family] || CATEGORY_COLORS[2]
    const label = escapeXml(String(name).slice(0, 40))

    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">',
        `<title>HTTP ${escapeXml(code)} ${label}</title>`,
        `<rect width="400" height="400" fill="${sky}"/>`,
        `<path d="M0 300 Q 50 285 100 300 T 200 300 T 300 300 T 400 300 L400 400 L0 400 Z" fill="${ground}" opacity="0.85"/>`,
        '<ellipse cx="190" cy="232" rx="106" ry="72" fill="#ffd23f"/>',
        '<path d="M96 210 Q 40 180 60 232 Q 74 258 108 252 Z" fill="#f7b801"/>',
        '<circle cx="262" cy="150" r="52" fill="#ffd23f"/>',
        '<path d="M307 146 L376 164 L307 184 Z" fill="#f4801f"/>',
        '<circle cx="276" cy="136" r="8" fill="#1b1b1b"/>',
        '<circle cx="279" cy="133" r="3" fill="#ffffff"/>',
        '<ellipse cx="176" cy="236" rx="54" ry="35" fill="#f7b801" opacity="0.9"/>',
        `<text x="200" y="372" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="62" font-weight="700" fill="#1b1b1b" opacity="0.75">${escapeXml(code)}</text>`,
        '</svg>',
    ].join('')

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Imagen de un código: manda la foto fijada a mano en el JSON; si no la hay,
 * la foto pregenerada; y si el código no tiene escena, el pato dibujado.
 */
export function resolveDuckImage(statusCode) {
    const { code, name = '', image } = statusCode || {}
    if (image) return { src: image, pregenerada: false }
    if (!getDuckScene(code)) return { src: buildDuckFallback(code, name), pregenerada: false }
    return { src: duckImagePath(code), pregenerada: true }
}

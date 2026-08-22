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

/**
 * Colores por familia de código. Son los mismos acentos que usa App.css para
 * la cabecera de la sección y la tarjeta, de modo que el pato de respaldo
 * encaja con el color de su familia en vez de desentonar.
 */
const CATEGORY_COLORS = {
    '1': { sky: '#cfe4f4', ground: '#1f6ea8' },
    '2': { sky: '#cfe9d8', ground: '#237a41' },
    '3': { sky: '#f4e3c4', ground: '#8a5a12' },
    '4': { sky: '#f6d8d3', ground: '#b03325' },
    '5': { sky: '#e0d6f2', ground: '#5b3f97' },
    wild: { sky: '#d6ebf0', ground: '#0a5f77' },
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
 *
 * La familia va aparte del código porque los códigos de "In the wild" son
 * números 4xx y 5xx pero pertenecen a su propia sección.
 */
export function buildDuckFallback(code, name = '', family = String(code).charAt(0)) {
    const { sky, ground } = CATEGORY_COLORS[family] || CATEGORY_COLORS['2']
    const label = escapeXml(String(name).slice(0, 40))

    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400" role="img">',
        `<title>HTTP ${escapeXml(code)} ${label}</title>`,
        `<rect width="400" height="400" fill="${sky}"/>`,
        `<path d="M0 315 Q 50 300 100 315 T 200 315 T 300 315 T 400 315 L400 400 L0 400 Z" fill="${ground}" opacity="0.85"/>`,
        '<ellipse cx="190" cy="232" rx="106" ry="72" fill="#ffd23f"/>',
        '<path d="M96 210 Q 40 180 60 232 Q 74 258 108 252 Z" fill="#f7b801"/>',
        '<circle cx="262" cy="150" r="52" fill="#ffd23f"/>',
        '<path d="M307 146 L376 164 L307 184 Z" fill="#f4801f"/>',
        '<circle cx="276" cy="136" r="8" fill="#1b1b1b"/>',
        '<circle cx="279" cy="133" r="3" fill="#ffffff"/>',
        '<ellipse cx="176" cy="236" rx="54" ry="35" fill="#f7b801" opacity="0.9"/>',
        '</svg>',
    ].join('')

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Imagen de un código: la foto pregenerada si el código tiene escena, y si no
 * el pato dibujado.
 */
export function resolveDuckImage(statusCode, family) {
    const { code, name = '' } = statusCode || {}
    if (!getDuckScene(code)) return { src: buildDuckFallback(code, name, family), pregenerada: false }
    return { src: duckImagePath(code), pregenerada: true }
}

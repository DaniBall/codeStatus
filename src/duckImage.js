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
 * Colores por familia y por modo. Son exactamente los pares --accent-soft y
 * --accent de App.css: el fondo del dibujo y el del hueco de la tarjeta son el
 * mismo color, así que no se ve costura entre la imagen y la tarjeta. Hay una
 * prueba que comprueba que no se separen.
 */
const CATEGORY_COLORS = {
    light: {
        '1': { bg: '#e4f0f9', mark: '#1f6ea8' },
        '2': { bg: '#e3f4e9', mark: '#237a41' },
        '3': { bg: '#faeed8', mark: '#8a5a12' },
        '4': { bg: '#fbe7e4', mark: '#b03325' },
        '5': { bg: '#eee8fa', mark: '#5b3f97' },
        wild: { bg: '#e3f2f6', mark: '#0a5f77' },
    },
    dark: {
        '1': { bg: '#16293a', mark: '#7cc0ec' },
        '2': { bg: '#14301f', mark: '#6fd396' },
        '3': { bg: '#33260f', mark: '#e5b264' },
        '4': { bg: '#3a1c19', mark: '#f79287' },
        '5': { bg: '#251d3d', mark: '#bfa6f2' },
        wild: { bg: '#102c33', mark: '#5fc9dd' },
    },
}

/** Naranja del pico. Es la única constante de marca entre todas las familias. */
const BEAK = '#f4801f'

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
 * Marca dibujada localmente en SVG, para cuando no hay foto pregenerada.
 * No depende de la red ni de ningún fichero.
 *
 * Es el mismo interrogante-pato del favicon y de la previsualización, pintado
 * con el color de su familia: un hueco sin foto se reconoce al instante como
 * parte de la web y no como una imagen rota.
 *
 * La familia va aparte del código porque los códigos de "In the wild" son
 * números 4xx y 5xx pero pertenecen a su propia sección.
 */
export function buildDuckFallback(code, name = '', family = String(code).charAt(0), scheme = 'light') {
    const familias = CATEGORY_COLORS[scheme] || CATEGORY_COLORS.light
    const { bg, mark } = familias[family] || familias['2']
    const label = escapeXml(String(name).slice(0, 40))

    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" role="img">',
        `<title>HTTP ${escapeXml(code)} ${label}</title>`,
        `<rect width="512" height="512" fill="${bg}"/>`,
        // Encogido dentro del cuadro: así se lee como marca de sitio y no como
        // un signo gigante recortado.
        '<g transform="translate(256 256) scale(0.86) translate(-256 -256)">',
        `<path d="M 152 164 a 104 104 0 1 1 104 104 v 10" fill="none" stroke="${mark}" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/>`,
        `<circle cx="256" cy="424" r="68" fill="${mark}"/>`,
        `<path d="M 316 400 L 428 424 L 316 448 Z" fill="${BEAK}"/>`,
        `<circle cx="276" cy="406" r="14" fill="${bg}"/>`,
        '<circle cx="281" cy="401" r="5" fill="#ffffff"/>',
        '</g>',
        '</svg>',
    ].join('')

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * Imagen de un código: la foto pregenerada si el código tiene escena, y si no
 * el pato dibujado.
 */
export function resolveDuckImage(statusCode, family, scheme) {
    const { code, name = '' } = statusCode || {}
    if (!getDuckScene(code)) return { src: buildDuckFallback(code, name, family, scheme), pregenerada: false }
    return { src: duckImagePath(code), pregenerada: true }
}

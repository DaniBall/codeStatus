/**
 * Generación de las imágenes de patos de cada código de estado.
 *
 * La web no guarda 63 fotos: construye, para cada código, el prompt de una
 * escena ultrarrealista y graciosa protagonizada por patos y deja que el
 * servicio de generación de imágenes la cree bajo demanda. Si ese servicio
 * no responde (o no hay red) se usa un pato SVG dibujado localmente, de
 * modo que ninguna tarjeta se queda nunca con una imagen rota.
 */
import duckScenes, { DUCK_STYLE } from './data/duckScenes'

/** Servicio de generación por defecto (sin clave de API). */
export const DEFAULT_ENDPOINT = 'https://image.pollinations.ai/prompt/'

/** Permite apuntar a otro generador sin tocar el código. */
export const DUCK_IMAGE_ENDPOINT =
    process.env.REACT_APP_DUCK_IMAGE_ENDPOINT || DEFAULT_ENDPOINT

/**
 * Parámetros extra para el generador, en formato query (por ejemplo
 * `model=flux&nologo=true`). Se dejan fuera por defecto porque cada servicio
 * tiene los suyos y uno desconocido puede hacer que rechace la petición.
 */
export const DUCK_IMAGE_PARAMS = process.env.REACT_APP_DUCK_IMAGE_PARAMS || ''

export const DEFAULT_SIZE = 768

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
    return duckScenes[String(code)]
}

/**
 * Construye el prompt completo con el que se genera la imagen del código.
 * Devuelve `null` si el código no tiene escena definida.
 */
export function buildDuckPrompt(code, name = '') {
    const scene = getDuckScene(code)
    if (!scene) return null
    const title = name ? `${code} ${name}` : String(code)
    return `HTTP ${title}. ${scene}. ${DUCK_STYLE}`
}

/**
 * Semilla estable a partir del código y de la variante pedida: la misma
 * tarjeta enseña siempre el mismo pato (y el navegador puede cachearlo)
 * hasta que se pide otra variante.
 */
export function duckSeed(code, variant = 0) {
    return (Number(code) * 7919 + Number(variant) * 104729) % 1000000
}

/**
 * URL de la imagen generada para un código de estado.
 * Devuelve `null` si el código no tiene escena definida.
 */
export function buildDuckImageUrl(code, name = '', options = {}) {
    const prompt = buildDuckPrompt(code, name)
    if (!prompt) return null

    const {
        variant = 0,
        width = DEFAULT_SIZE,
        height = DEFAULT_SIZE,
        endpoint = DUCK_IMAGE_ENDPOINT,
    } = options

    const base = endpoint.endsWith('/') ? endpoint : `${endpoint}/`
    const params = new URLSearchParams(DUCK_IMAGE_PARAMS)
    params.set('width', String(width))
    params.set('height', String(height))
    params.set('seed', String(duckSeed(code, variant)))

    return `${base}${encodeURIComponent(prompt)}?${params.toString()}`
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
 * Pato dibujado localmente en SVG. Se usa mientras la imagen se genera y
 * como respaldo si el generador falla: nunca depende de la red.
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
 * Fuente definitiva de la imagen de un código: la foto fijada a mano en el
 * JSON manda; si no la hay, se genera a partir de la escena del pato.
 */
export function resolveDuckImage(statusCode, options = {}) {
    const { code, name = '', image } = statusCode || {}
    if (image) return { src: image, generated: false }

    const src = buildDuckImageUrl(code, name, options)
    return src
        ? { src, generated: true }
        : { src: buildDuckFallback(code, name), generated: false }
}

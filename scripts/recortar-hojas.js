/**
 * Corta una hoja de 3x3 de patos de goma en sus nueve imágenes.
 *
 *   node scripts/recortar-hojas.js <número de hoja> <hoja.jpg> [carpeta de salida]
 *
 * Qué código va en cada celda lo dice docs/hojas-patos-goma.json. Cada imagen
 * sale a public/ducks/<código>.jpg, cuadrada, en JPEG y a 1024px.
 *
 * Un modelo de imagen no dibuja una cuadrícula al píxel: las franjas blancas
 * entre celdas salen torcidas o con anchos distintos. Partir la hoja en tres
 * tercios exactos cortaría patos. Así que se buscan las franjas de verdad: las
 * columnas y filas de la imagen que son casi blanco de punta a punta.
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const RAIZ = path.join(__dirname, '..')
const hojas = require(`${RAIZ}/docs/hojas-patos-goma.json`).hojas

const LADO = 1024
const BLANCO = 235        // por encima de esto en los tres canales cuenta como fondo
const LIMPIA = 0.97       // fracción de píxeles de fondo para dar una línea por franja

/** Índices [inicio, fin) de los tramos donde `es(i)` se cumple seguido. */
function tramos(n, es) {
    const out = []
    let desde = null
    for (let i = 0; i <= n; i++) {
        const si = i < n && es(i)
        if (si && desde === null) desde = i
        if (!si && desde !== null) { out.push([desde, i]); desde = null }
    }
    return out
}

/**
 * Dónde cortar en un eje: los centros de las dos franjas blancas interiores.
 * Si no las encuentra (fondo de celda blanco, hoja sin margen), cae en los
 * tercios, y lo avisa.
 */
function cortes(limpia, total) {
    const franjas = tramos(total, limpia)
        .map(([a, b]) => ({ centro: (a + b) / 2, ancho: b - a }))
        // Las de los bordes no separan celdas.
        .filter(f => f.centro > total * 0.15 && f.centro < total * 0.85)

    const cerca = objetivo => franjas
        .filter(f => Math.abs(f.centro - objetivo) < total * 0.12)
        .sort((x, y) => y.ancho - x.ancho)[0]

    const a = cerca(total / 3), b = cerca((2 * total) / 3)
    if (a && b) return { lineas: [0, a.centro, b.centro, total], exacto: true }
    return { lineas: [0, total / 3, (2 * total) / 3, total], exacto: false }
}

/**
 * La caja de lo que no es fondo dentro de un rectángulo. Una fila o columna
 * cuenta como contenido si más del 10 % de sus píxeles no son blanco: así un
 * poco de ruido de compresión en la franja no la confunde con imagen.
 */
function contenido(fondo, x0, x1, y0, y1) {
    const llena = (n, total) => n / total > 0.1
    const cols = [], filas = []
    for (let x = x0; x < x1; x++) {
        let n = 0
        for (let y = y0; y < y1; y += 2) if (!fondo(x, y)) n++
        if (llena(n, (y1 - y0) / 2)) cols.push(x)
    }
    for (let y = y0; y < y1; y++) {
        let n = 0
        for (let x = x0; x < x1; x += 2) if (!fondo(x, y)) n++
        if (llena(n, (x1 - x0) / 2)) filas.push(y)
    }
    // Celda casi vacía (la hoja 10 sólo usa cuatro): se devuelve entera.
    if (cols.length < 10 || filas.length < 10) return { x0, x1, y0, y1 }
    return { x0: cols[0], x1: cols[cols.length - 1] + 1, y0: filas[0], y1: filas[filas.length - 1] + 1 }
}

async function main() {
    const [numero, entrada, salida = `${RAIZ}/public/ducks`] = process.argv.slice(2)
    const hoja = hojas.find(h => h.hoja === Number(numero))
    if (!hoja || !entrada) {
        console.error('uso: node scripts/recortar-hojas.js <1-10> <hoja.jpg> [salida]')
        process.exit(1)
    }

    const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const { width: w, height: h, channels: c } = info
    const fondo = (x, y) => {
        const i = (y * w + x) * c
        return data[i] > BLANCO && data[i + 1] > BLANCO && data[i + 2] > BLANCO
    }
    const columnaLimpia = x => {
        let n = 0
        for (let y = 0; y < h; y += 2) if (fondo(x, y)) n++
        return n / Math.ceil(h / 2) >= LIMPIA
    }
    const filaLimpia = y => {
        let n = 0
        for (let x = 0; x < w; x += 2) if (fondo(x, y)) n++
        return n / Math.ceil(w / 2) >= LIMPIA
    }

    const cx = cortes(columnaLimpia, w)
    const cy = cortes(filaLimpia, h)
    console.log(`hoja ${hoja.hoja}: ${w}x${h}, cortes ${cx.exacto && cy.exacto ? 'por las franjas' : 'por tercios (no se vieron franjas claras)'}`)

    fs.mkdirSync(salida, { recursive: true })
    for (const celda of hoja.celdas) {
        const x0 = cx.lineas[celda.columna - 1], x1 = cx.lineas[celda.columna]
        const y0 = cy.lineas[celda.fila - 1], y1 = cy.lineas[celda.fila]

        // Entre dos cortes queda la celda más media franja por cada lado. Se
        // busca dónde empieza y acaba de verdad la imagen (lo que no es fondo)
        // y se corta sobre eso, para no arrastrar blanco de la franja.
        const caja = contenido(fondo, Math.round(x0), Math.round(x1), Math.round(y0), Math.round(y1))
        const lado = Math.floor(Math.min(caja.x1 - caja.x0, caja.y1 - caja.y0) * 0.99)
        const left = Math.round((caja.x0 + caja.x1 - lado) / 2)
        const top = Math.round((caja.y0 + caja.y1 - lado) / 2)

        const destino = path.join(salida, `${celda.codigo}.jpg`)
        await sharp(entrada)
            .extract({ left, top, width: lado, height: lado })
            .resize(LADO, LADO)
            .jpeg({ quality: 88, mozjpeg: true })
            .toFile(destino)
        console.log(`  celda ${celda.celda} → ${celda.codigo}.jpg  (${lado}px de origen)`)
    }
}

main().catch(e => { console.error(e.message); process.exit(1) })

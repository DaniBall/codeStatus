#!/usr/bin/env node
/**
 * Genera las fotos de patos de los códigos de estado.
 *
 * Se ejecuta a mano, no en cada visita: guarda cada imagen en
 * `public/ducks/<código>.jpg` para que la web sólo tenga que cargar ficheros
 * estáticos. Las imágenes se revisan y se suben al repositorio.
 *
 *   npm run ducks                  genera las que falten
 *   npm run ducks -- 404 500       regenera sólo esos códigos
 *   npm run ducks -- --all         regenera todas, incluso las que ya existen
 *   npm run ducks -- --model turbo probando otro modelo
 *
 * Variables de entorno: DUCK_ENDPOINT, DUCK_MODEL, DUCK_SIZE.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'ducks')

const ENDPOINT = process.env.DUCK_ENDPOINT || 'https://image.pollinations.ai/prompt/'
const MODEL = process.env.DUCK_MODEL || 'flux'
const SIZE = Number(process.env.DUCK_SIZE || 768)

const CONCURRENCY = 3
const ATTEMPTS = 3
const TIMEOUT_MS = 180000

function readJson(relative) {
    return JSON.parse(fs.readFileSync(path.join(ROOT, relative), 'utf8'))
}

/** Todos los códigos con su nombre y su escena. */
function loadDucks() {
    const { scenes, style } = readJson('src/data/duckScenes.json')
    return readJson('src/status_codes.json')
        .flatMap(category => category.codes)
        .filter(item => scenes[String(item.code)])
        .map(item => ({
            code: item.code,
            name: item.name,
            scene: scenes[String(item.code)],
            // Prompt corto y concreto: cuanto más se alarga, menos caso hace el
            // modelo a la escena y menos se entiende de qué código habla.
            prompt: `${scenes[String(item.code)]}. ${style}`,
        }))
}

function imageUrl(duck) {
    const params = new URLSearchParams({
        width: String(SIZE),
        height: String(SIZE),
        seed: String(duck.code),
        model: MODEL,
        nologo: 'true',
    })
    return `${ENDPOINT}${encodeURIComponent(duck.prompt)}?${params}`
}

async function download(duck) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
        const response = await fetch(imageUrl(duck), { signal: controller.signal })
        if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`)

        const type = response.headers.get('content-type') || ''
        if (!type.startsWith('image/')) throw new Error(`respuesta que no es una imagen (${type})`)

        const bytes = Buffer.from(await response.arrayBuffer())
        // Una respuesta diminuta suele ser una página de error disfrazada.
        if (bytes.length < 2048) throw new Error(`imagen sospechosamente pequeña (${bytes.length} bytes)`)
        return bytes
    } finally {
        clearTimeout(timer)
    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function generate(duck) {
    for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
        try {
            const bytes = await download(duck)
            fs.writeFileSync(path.join(OUT_DIR, `${duck.code}.jpg`), bytes)
            return { code: duck.code, ok: true, size: bytes.length }
        } catch (error) {
            if (attempt === ATTEMPTS) return { code: duck.code, ok: false, error: error.message }
            // Los servicios gratuitos limitan por uso: esperamos algo más cada vez.
            await sleep(attempt * 5000)
        }
    }
}

/** Lanza las descargas de `CONCURRENCY` en `CONCURRENCY`. */
async function runAll(ducks, onDone) {
    const queue = [...ducks]
    const results = []
    const worker = async () => {
        while (queue.length) {
            const duck = queue.shift()
            const result = await generate(duck)
            results.push(result)
            onDone(result, results.length)
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    return results
}

async function main() {
    const args = process.argv.slice(2)
    const all = args.includes('--all')
    const modelFlag = args.indexOf('--model')
    if (modelFlag >= 0 && args[modelFlag + 1]) process.env.DUCK_MODEL = args[modelFlag + 1]
    const only = args.filter(arg => /^\d{3}$/.test(arg)).map(Number)

    fs.mkdirSync(OUT_DIR, { recursive: true })

    let ducks = loadDucks()
    if (only.length) ducks = ducks.filter(duck => only.includes(duck.code))
    if (!all && !only.length) {
        ducks = ducks.filter(duck => !fs.existsSync(path.join(OUT_DIR, `${duck.code}.jpg`)))
    }

    if (!ducks.length) {
        console.log('No hay nada que generar. Usa --all para rehacerlas todas.')
        return
    }

    console.log(`Generando ${ducks.length} imágenes con el modelo "${MODEL}" a ${SIZE}px.`)
    console.log(`Ejemplo de URL:\n  ${imageUrl(ducks[0])}\n`)

    const started = Date.now()
    const results = await runAll(ducks, (result, done) => {
        const prefix = `[${String(done).padStart(2)}/${ducks.length}]`
        console.log(result.ok
            ? `${prefix} ✓ ${result.code}  ${(result.size / 1024).toFixed(0)} KB`
            : `${prefix} ✗ ${result.code}  ${result.error}`)
    })

    const failed = results.filter(result => !result.ok)
    console.log(`\nListo en ${((Date.now() - started) / 1000).toFixed(0)}s: ` +
        `${results.length - failed.length} correctas, ${failed.length} fallidas.`)

    if (failed.length) {
        console.log(`Reintenta las que faltan con:\n  npm run ducks -- ${failed.map(f => f.code).join(' ')}`)
        process.exitCode = 1
        return
    }
    console.log('Revísalas en public/ducks/. La que no te guste, bórrala y vuelve a ejecutar\n' +
        'el script, o regenérala con: npm run ducks -- <código>')
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})

#!/usr/bin/env node
/**
 * Genera las fotos de patos de los códigos de estado.
 *
 * Se ejecuta a mano, no en cada visita: guarda cada imagen en
 * `public/ducks/<código>.jpg` para que la web sólo tenga que cargar ficheros
 * estáticos. Las imágenes se revisan y se suben al repositorio.
 *
 *   npm run ducks                    genera las que falten
 *   npm run ducks -- 404 500         regenera sólo esos códigos
 *   npm run ducks -- 404 --reroll    otra versión distinta de esa imagen
 *   npm run ducks -- --all           regenera todas, incluso las que ya existen
 *   npm run ducks -- --model turbo   prueba otro modelo
 *
 * El servicio gratuito limita por uso, así que por defecto va de una en una y
 * espaciando las peticiones. Se puede ajustar con DUCK_CONCURRENCY, DUCK_INTERVAL
 * y DUCK_ATTEMPTS. Otras variables: DUCK_ENDPOINT, DUCK_MODEL, DUCK_SIZE.
 *
 * Si algo falla no pasa nada: el script sólo genera lo que falta, así que se
 * puede volver a lanzar las veces que haga falta y sigue por donde iba.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'ducks')

const ENDPOINT = process.env.DUCK_ENDPOINT || 'https://image.pollinations.ai/prompt/'
const SIZE = Number(process.env.DUCK_SIZE || 768)

// Los flags los cambian, así que no pueden ser constantes.
let MODEL = process.env.DUCK_MODEL || 'flux'
let SEED = null       // --seed N fija la semilla
let REROLL = false    // --reroll pide otra versión de la misma escena

/**
 * De una en una y con seis segundos entre peticiones. Antes iban tres a la vez
 * con esperas cortas y el servicio devolvía 429 a casi todas.
 */
const CONCURRENCY = Number(process.env.DUCK_CONCURRENCY || 1)
const INTERVAL_MS = Number(process.env.DUCK_INTERVAL || 6000)
const ATTEMPTS = Number(process.env.DUCK_ATTEMPTS || 5)
const TIMEOUT_MS = 180000

/** Por debajo de esto no es una foto: es un error disfrazado o un render vacío. */
const MIN_BYTES = 8192

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

/**
 * La semilla decide qué imagen sale. Por defecto es el propio código, así que
 * repetir la generación da exactamente la misma foto; con --reroll cambia, que
 * es lo que hace falta cuando una sale con defectos.
 */
function seedFor(duck) {
    if (SEED !== null) return SEED
    if (REROLL) return Math.floor(Math.random() * 1000000)
    return duck.code
}

function imageUrl(duck) {
    const params = new URLSearchParams({
        width: String(SIZE),
        height: String(SIZE),
        seed: String(seedFor(duck)),
        model: MODEL,
        nologo: 'true',
    })
    return `${ENDPOINT}${encodeURIComponent(duck.prompt)}?${params}`
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/** Error con el código HTTP a mano, para poder tratar el 429 aparte. */
class HttpError extends Error {
    constructor(status, retryAfter) {
        super(`HTTP ${status}${status === 429 ? ' (demasiadas peticiones)' : ''}`)
        this.status = status
        this.retryAfter = retryAfter
    }
}

// Reparte los huecos en el tiempo aunque haya varios trabajadores.
let siguienteHueco = 0
async function esperarTurno() {
    const ahora = Date.now()
    const cuando = Math.max(ahora, siguienteHueco)
    siguienteHueco = cuando + INTERVAL_MS
    if (cuando > ahora) await sleep(cuando - ahora)
}

async function download(duck) {
    await esperarTurno()

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
        const response = await fetch(imageUrl(duck), { signal: controller.signal })
        if (!response.ok) {
            const retryAfter = Number(response.headers.get('retry-after')) || null
            throw new HttpError(response.status, retryAfter)
        }

        const type = response.headers.get('content-type') || ''
        if (!type.startsWith('image/')) throw new Error(`respuesta que no es una imagen (${type})`)

        const bytes = Buffer.from(await response.arrayBuffer())
        if (bytes.length < MIN_BYTES) {
            throw new Error(`imagen sospechosamente pequeña (${bytes.length} bytes)`)
        }
        return bytes
    } finally {
        clearTimeout(timer)
    }
}

/**
 * Cuánto esperar tras fallar. Si el servidor dice cuándo volver, se le hace
 * caso; si no, el doble cada vez, con algo de aleatorio para que varios
 * trabajadores no vuelvan todos a la vez.
 */
function esperaTrasFallo(intento, error) {
    if (error instanceof HttpError && error.retryAfter) return error.retryAfter * 1000
    const base = 2 ** intento * 5000
    return Math.round(base * (0.75 + Math.random() * 0.5))
}

async function generate(duck, onRetry) {
    for (let intento = 1; intento <= ATTEMPTS; intento++) {
        try {
            const bytes = await download(duck)
            fs.writeFileSync(path.join(OUT_DIR, `${duck.code}.jpg`), bytes)
            return { code: duck.code, ok: true, size: bytes.length, intentos: intento }
        } catch (error) {
            if (intento === ATTEMPTS) return { code: duck.code, ok: false, error: error.message }
            const espera = esperaTrasFallo(intento, error)
            onRetry(duck.code, error.message, espera)
            await sleep(espera)
        }
    }
}

/** Lanza las descargas de `CONCURRENCY` en `CONCURRENCY`. */
async function runAll(ducks, onDone, onRetry) {
    const queue = [...ducks]
    const results = []
    const worker = async () => {
        while (queue.length) {
            const duck = queue.shift()
            const result = await generate(duck, onRetry)
            results.push(result)
            onDone(result, results.length)
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    return results
}

function parseArgs(args) {
    const valor = flag => {
        const i = args.indexOf(flag)
        return i >= 0 && args[i + 1] ? args[i + 1] : null
    }
    const modelo = valor('--model')
    if (modelo) MODEL = modelo
    const semilla = valor('--seed')
    if (semilla) SEED = Number(semilla)
    REROLL = args.includes('--reroll')

    // Los valores de los flags se saltan, para que un modelo o una semilla de
    // tres cifras no se confundan con un código.
    const valores = ['--model', '--seed'].map(f => args.indexOf(f) + 1).filter(i => i > 0)
    return {
        all: args.includes('--all'),
        only: args.filter((arg, i) => !valores.includes(i) && /^\d{3}$/.test(arg)).map(Number),
    }
}

function duracion(ms) {
    const s = Math.round(ms / 1000)
    return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}

async function main() {
    const { all, only } = parseArgs(process.argv.slice(2))

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
    console.log(`De ${CONCURRENCY} en ${CONCURRENCY}, una cada ${INTERVAL_MS / 1000}s: unos ${duracion(ducks.length * INTERVAL_MS)} si no falla nada.`)
    console.log(`Ejemplo de URL:\n  ${imageUrl(ducks[0])}\n`)

    const started = Date.now()
    const results = await runAll(
        ducks,
        (result, done) => {
            const prefix = `[${String(done).padStart(2)}/${ducks.length}]`
            console.log(result.ok
                ? `${prefix} ✓ ${result.code}  ${(result.size / 1024).toFixed(0)} KB${result.intentos > 1 ? `  (al intento ${result.intentos})` : ''}`
                : `${prefix} ✗ ${result.code}  ${result.error}`)
        },
        (code, motivo, espera) => {
            console.log(`         ↻ ${code}  ${motivo}; reintento en ${duracion(espera)}`)
        }
    )

    const failed = results.filter(result => !result.ok)
    console.log(`\nListo en ${duracion(Date.now() - started)}: ` +
        `${results.length - failed.length} correctas, ${failed.length} fallidas.`)

    if (failed.length) {
        console.log('\nLas que faltan se recuperan volviendo a lanzar el script, que sólo\n' +
            'genera lo que no existe:\n  npm run ducks')
        console.log('Si siguen fallando por límite de uso, sube la espera:\n' +
            '  DUCK_INTERVAL=15000 npm run ducks')
        process.exitCode = 1
        return
    }
    console.log('\nRevísalas en public/ducks/. La que no te guste:\n' +
        '  npm run ducks -- <código> --reroll     otra versión de esa imagen\n' +
        '  npm run ducks -- <código> --model turbo   con otro modelo')
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})

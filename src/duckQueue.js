/**
 * Cola de generación de imágenes.
 *
 * La home tiene 63 tarjetas. Si todas piden su imagen a la vez, un generador
 * gratuito responde con límites de uso y casi ninguna llega: la página acaba
 * llena de patos de respaldo. Aquí limitamos cuántas se generan a la vez y el
 * resto espera turno.
 */

/** Imágenes que se generan simultáneamente. */
export const MAX_CONCURRENT = 3

let running = 0
const waiting = []

function pump() {
    while (running < MAX_CONCURRENT && waiting.length > 0) {
        const job = waiting.shift()
        job.started = true
        running += 1
        job.run()
    }
}

/**
 * Encola la generación de una imagen. `run` se ejecuta cuando hay hueco.
 * Devuelve la función que libera el turno; hay que llamarla siempre (al
 * cargar, al fallar o al desmontar), o el hueco se queda pillado.
 */
export function enqueue(run) {
    const job = { run, started: false, released: false }
    waiting.push(job)
    pump()

    return function release() {
        if (job.released) return
        job.released = true

        if (job.started) {
            running -= 1
            pump()
            return
        }
        const index = waiting.indexOf(job)
        if (index >= 0) waiting.splice(index, 1)
    }
}

/** Estado de la cola, sólo para pruebas. */
export function queueStats() {
    return { running, waiting: waiting.length }
}

/** Vacía la cola, sólo para pruebas. */
export function resetQueue() {
    waiting.length = 0
    running = 0
}

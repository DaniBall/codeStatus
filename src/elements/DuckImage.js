import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildDuckFallback, resolveDuckImage } from '../duckImage'
import { enqueue } from '../duckQueue'

/** Tiempo máximo que esperamos a que el generador cree una imagen. */
export const GENERATION_TIMEOUT_MS = 45000

/** Espera antes de reintentar una imagen que ha fallado. */
export const RETRY_DELAY_MS = 4000

/** Reintentos por imagen (los límites de uso suelen ser pasajeros). */
export const MAX_RETRIES = 1

/** Margen alrededor de la ventana para empezar a generar antes de tiempo. */
const PREFETCH_MARGIN = '600px'

/**
 * Imagen de pato de un código de estado.
 *
 * Sólo pide la imagen cuando la tarjeta se acerca a la ventana, y esperando
 * turno en la cola de generación. Mientras tanto —y también si el generador
 * falla o tarda demasiado— enseña un pato SVG dibujado en local, así que la
 * tarjeta nunca se queda con una imagen rota.
 */
export default function DuckImage({
    statusCode,
    variant = 0,
    size,
    className = '',
    timeoutMs = GENERATION_TIMEOUT_MS,
}) {
    const { code, name = '' } = statusCode || {}

    const { src, generated } = useMemo(
        () => resolveDuckImage(statusCode, { variant, width: size, height: size }),
        [statusCode, variant, size]
    )
    const fallback = useMemo(() => buildDuckFallback(code, name), [code, name])

    const holderRef = useRef(null)
    const releaseRef = useRef(null)
    const timerRef = useRef(null)

    // Sin IntersectionObserver (jsdom, navegadores viejos) generamos ya.
    const [visible, setVisible] = useState(
        () => typeof IntersectionObserver === 'undefined'
    )
    const [attempt, setAttempt] = useState(0)
    const [state, setState] = useState(generated ? 'queued' : 'ready')
    const [requestedSrc, setRequestedSrc] = useState(generated ? null : src)

    /** Cierra el intento en curso: para el reloj y devuelve el turno. */
    const settle = useCallback(() => {
        clearTimeout(timerRef.current)
        timerRef.current = null
        if (releaseRef.current) {
            releaseRef.current()
            releaseRef.current = null
        }
    }, [])

    // La tarjeta sólo se observa hasta que entra en pantalla: una vez visible
    // ya no vuelve a ocultarse para nosotros, y así no regeneramos al hacer
    // scroll de vuelta.
    useEffect(() => {
        if (visible || !holderRef.current) return undefined

        const observer = new IntersectionObserver(
            entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: PREFETCH_MARGIN }
        )
        observer.observe(holderRef.current)
        return () => observer.disconnect()
    }, [visible])

    // Otra imagen (otro código u otra variante): volvemos a empezar de cero.
    useEffect(() => {
        setAttempt(0)
    }, [src])

    useEffect(() => {
        if (!generated) {
            setState('ready')
            setRequestedSrc(src)
            return undefined
        }

        setState('queued')
        setRequestedSrc(null)
        if (!visible) return undefined

        const release = enqueue(() => {
            setState('loading')
            setRequestedSrc(src)
            // Un generador que no contesta nunca dispara onError: lo acotamos,
            // y de paso liberamos el turno para la siguiente tarjeta.
            // Si el reloj llega a saltar es que seguíamos esperando: cualquier
            // carga o fallo lo habría parado antes desde settle().
            timerRef.current = setTimeout(() => {
                settle()
                setState('failed')
                setRequestedSrc(null)
            }, timeoutMs)
        })
        releaseRef.current = release

        return () => {
            clearTimeout(timerRef.current)
            timerRef.current = null
            release()
            releaseRef.current = null
        }
    }, [src, generated, visible, attempt, timeoutMs, settle])

    // Mientras no hay imagen pedida el <img> enseña el pato de respaldo: su
    // carga no dice nada del generador, así que la ignoramos.
    const handleLoad = useCallback(() => {
        if (!requestedSrc) return
        settle()
        setState('ready')
    }, [requestedSrc, settle])

    const handleError = useCallback(() => {
        if (!requestedSrc) return
        settle()

        if (generated && attempt < MAX_RETRIES) {
            setState('queued')
            setRequestedSrc(null)
            timerRef.current = setTimeout(() => setAttempt(n => n + 1), RETRY_DELAY_MS)
            return
        }
        setState('failed')
        setRequestedSrc(null)
    }, [attempt, generated, requestedSrc, settle])

    useEffect(() => () => {
        clearTimeout(timerRef.current)
        if (releaseRef.current) releaseRef.current()
    }, [])

    const working = state === 'queued' || state === 'loading'
    const alt = state === 'failed'
        ? `Ilustración de respaldo del código HTTP ${code} ${name}`
        : `Foto de patos que ilustra el código HTTP ${code} ${name}`

    return (
        <div
            ref={holderRef}
            className={`duckImage ${className}`.trim()}
            data-state={state}
            style={{ backgroundImage: `url("${fallback}")` }}
        >
            <img
                src={requestedSrc || fallback}
                alt={alt}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
            />
            {working && <span className='duckImage-badge'>generando pato…</span>}
        </div>
    )
}

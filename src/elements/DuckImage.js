import { useEffect, useMemo, useRef, useState } from 'react'
import { buildDuckFallback, resolveDuckImage } from '../duckImage'

/** Tiempo máximo que esperamos a que el generador cree la imagen. */
export const GENERATION_TIMEOUT_MS = 45000

/**
 * Imagen de pato de un código de estado.
 *
 * Pide la imagen al generador y, mientras llega, enseña un pato SVG dibujado
 * localmente (sin red). Si la generación falla, o tarda demasiado, se queda
 * con ese pato local: la tarjeta nunca muestra una imagen rota.
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

    const imgRef = useRef(null)
    const [state, setState] = useState(generated ? 'loading' : 'ready')

    // Cada vez que cambia la imagen pedida volvemos a empezar.
    useEffect(() => {
        setState(generated ? 'loading' : 'ready')
        if (!generated) return undefined

        // El navegador puede resolver la imagen (o fallar) antes de que React
        // enganche onLoad/onError, así que comprobamos también el estado real
        // del elemento.
        const img = imgRef.current
        if (img && img.complete) {
            setState(img.naturalWidth > 0 ? 'ready' : 'failed')
            return undefined
        }

        // Un generador que no responde nunca dispara onError: lo acotamos.
        const timer = setTimeout(
            () => setState(current => (current === 'loading' ? 'failed' : current)),
            timeoutMs
        )
        return () => clearTimeout(timer)
    }, [src, generated, timeoutMs])

    const failed = state === 'failed'
    const alt = failed
        ? `Ilustración de respaldo del código HTTP ${code} ${name}`
        : `Foto de patos que ilustra el código HTTP ${code} ${name}`

    return (
        <div
            className={`duckImage ${className}`.trim()}
            data-state={state}
            style={{ backgroundImage: `url("${fallback}")` }}
        >
            <img
                ref={imgRef}
                src={failed ? fallback : src}
                alt={alt}
                loading="lazy"
                decoding="async"
                // 'failed' es definitivo hasta que se pida otra imagen: si no,
                // el onLoad del propio pato de respaldo devolvería la tarjeta a
                // la url rota y entraría en bucle.
                onLoad={() => setState(current => (current === 'failed' ? current : 'ready'))}
                onError={() => setState('failed')}
            />
            {state === 'loading' && (
                <span className='duckImage-badge'>generando pato…</span>
            )}
        </div>
    )
}

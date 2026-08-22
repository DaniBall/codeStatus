import { useEffect, useMemo, useState } from 'react'
import { buildDuckFallback, resolveDuckImage } from '../duckImage'

/**
 * Imagen de pato de un código de estado.
 *
 * Carga la foto pregenerada de `public/ducks/`. Si ese fichero todavía no
 * existe —porque nadie ha ejecutado `npm run ducks`— se queda con un pato SVG
 * dibujado en local, de modo que la tarjeta nunca muestra una imagen rota.
 */
export default function DuckImage({ statusCode, className = '' }) {
    const { code, name = '' } = statusCode || {}

    const { src } = useMemo(() => resolveDuckImage(statusCode), [statusCode])
    const fallback = useMemo(() => buildDuckFallback(code, name), [code, name])

    const [failed, setFailed] = useState(false)
    useEffect(() => setFailed(false), [src])

    return (
        <div className={`duckImage ${className}`.trim()} data-state={failed ? 'failed' : 'ready'}>
            <img
                src={failed ? fallback : src}
                alt={failed
                    ? `Placeholder duck illustration for HTTP ${code} ${name}`
                    : `Duck photo illustrating HTTP ${code} ${name}`}
                loading="lazy"
                decoding="async"
                // Sólo la foto puede fallar; el respaldo es un data: URI que
                // siempre carga, así que no hay riesgo de bucle.
                onError={() => setFailed(true)}
            />
        </div>
    )
}

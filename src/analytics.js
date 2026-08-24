import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Conteo de visitas con GoatCounter.
 *
 * Sin cookies y sin datos personales, así que no hace falta banner de
 * consentimiento. Mientras no se configure REACT_APP_GOATCOUNTER no se carga
 * absolutamente nada: la web funciona igual y no sale ni una petición.
 *
 * La web es un SPA: al pinchar en un código no se recarga la página, sólo
 * cambia la URL. El script de GoatCounter sólo vería la carga inicial, así que
 * se le dice que no cuente solo (`no_onload`) y se cuenta desde el router,
 * incluida la primera visita.
 */

/** Del tipo https://<tu-sitio>.goatcounter.com/count */
export const ENDPOINT = (process.env.REACT_APP_GOATCOUNTER || '').trim()

const SCRIPT = 'https://gc.zgo.at/count.js'

/** ¿Ha pedido el navegador que no se le rastree? */
export function noQuiereRastreo(nav = typeof navigator === 'undefined' ? {} : navigator) {
    const señal = nav.doNotTrack || nav.msDoNotTrack ||
        (typeof window !== 'undefined' ? window.doNotTrack : undefined)
    return señal === '1' || señal === 'yes'
}

/**
 * Sólo se cuenta en la web publicada, con endpoint configurado y si el
 * navegador no ha pedido lo contrario.
 */
export function seDebeContar({
    endpoint = ENDPOINT,
    entorno = process.env.NODE_ENV,
    rechaza = noQuiereRastreo(),
} = {}) {
    return Boolean(endpoint) && entorno === 'production' && !rechaza
}

// Las visitas que ocurren antes de que el script llegue se guardan y se envían
// cuando carga, para no perder la primera.
const cola = []
let cargando = false
let listo = false

function enviar(path) {
    if (listo && window.goatcounter?.count) window.goatcounter.count({ path })
    else cola.push(path)
}

function vaciarCola() {
    listo = true
    while (cola.length) window.goatcounter?.count?.({ path: cola.shift() })
}

function cargarScript() {
    if (cargando) return
    cargando = true

    const script = document.createElement('script')
    script.async = true
    script.src = SCRIPT
    script.dataset.goatcounter = ENDPOINT
    script.dataset.goatcounterSettings = JSON.stringify({ no_onload: true })
    script.addEventListener('load', vaciarCola)
    document.head.appendChild(script)
}

/** Sólo para las pruebas: deja el módulo como recién cargado. */
export function _reset() {
    cola.length = 0
    cargando = false
    listo = false
}

/**
 * Cuenta la visita en cada cambio de ruta. Va dentro del router, que es quien
 * sabe cuándo cambia la URL sin recargar.
 */
export default function Analytics() {
    const { pathname } = useLocation()

    useEffect(() => {
        if (!seDebeContar()) return
        cargarScript()
        enviar(pathname)
    }, [pathname])

    return null
}

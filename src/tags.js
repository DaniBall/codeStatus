/**
 * Qué significa cada insignia.
 *
 * La insignia sola es jerga: "No body" lo entiende quien ya sabe que una
 * respuesta HTTP son cabeceras más cuerpo, que es justo quien no necesitaba la
 * insignia. Aquí está lo que quiere decir, y se enseña en la ficha.
 *
 * Aparte de esto, cada código puede llevar su propia nota con lo suyo: esto
 * explica la etiqueta, la nota explica el caso.
 */
export const TAG_MEANINGS = {
    Deprecated: 'Retired from the standard. Nothing new should use it.',
    Reserved: 'The number is taken, but no server sends it.',
    Experimental: 'Not settled yet: support is patchy and details may change.',
    Joke: 'Never meant seriously. The number stays reserved anyway.',
    'No body': 'Headers only. There is no content to read or parse.',
}

export const tagMeaning = tag => TAG_MEANINGS[tag] || ''

/**
 * Avisos frente a datos.
 *
 * Las cuatro primeras dicen "no cuentes con esto"; "No body" sólo describe cómo
 * es la respuesta. Se marca en el HTML con data-kind en vez de que el CSS liste
 * las cuatro etiquetas: cada estado (normal, filtrando) las necesitaría todas.
 */
const AVISOS = ['Deprecated', 'Reserved', 'Experimental', 'Joke']

export const tagKind = tag => (AVISOS.includes(tag) ? 'warn' : 'info')

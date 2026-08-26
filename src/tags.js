/**
 * Las insignias de estado.
 *
 * Aquí sólo viven la lista y de qué tipo es cada una. El texto que se ve —la
 * etiqueta y su significado— está en data/textos.<idioma>.json, porque cambia
 * con el idioma. El nombre que sale aquí es la clave interna, y no se traduce:
 * es lo que guarda status_codes.json y lo que usan el filtro y las pruebas.
 */
export const TAGS = ['Deprecated', 'Reserved', 'Experimental', 'Joke', 'No body']

/**
 * Avisos frente a datos.
 *
 * Las cuatro primeras dicen "no cuentes con esto"; "No body" sólo describe cómo
 * es la respuesta. Se marca en el HTML con data-kind en vez de que el CSS liste
 * las cuatro etiquetas: cada estado (normal, filtrando) las necesitaría todas.
 */
const AVISOS = ['Deprecated', 'Reserved', 'Experimental', 'Joke']

export const tagKind = tag => (AVISOS.includes(tag) ? 'warn' : 'info')

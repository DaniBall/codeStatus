/**
 * Filtrado del catálogo.
 *
 * Se busca contra el número, el nombre, la procedencia, el estado y la
 * descripción, así que valen tanto "404" como "timeout", "nginx" o
 * "deprecated". Con varias palabras tienen que aparecer todas, que es lo que
 * espera cualquiera al ir afinando.
 */

/**
 * Minúsculas, sin tildes y sin puntuación, para que "timeout" encuentre
 * "Login Time-out" y "im a teapot" encuentre "I'm a teapot".
 *
 * Las tildes se quitan separando la letra de su acento y tirando el acento. Si
 * en vez de eso se borrara la letra entera, "Código" quedaría en "cdigo" y
 * escribir "codigo" sin tilde —que es lo que hace medio mundo— no lo
 * encontraría. La ñ pasa por lo mismo y queda en n.
 */
function normalize(text) {
    return String(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
}

/** Texto sobre el que se busca en un código. */
function haystack(item) {
    return normalize(
        [item.code, item.name, item.source, item.spec, ...(item.tags || []), item.description]
            .filter(Boolean)
            .join(' ')
    )
}

export function matchesQuery(item, query) {
    const clean = normalize(query).trim()
    if (!clean) return true
    const texto = haystack(item)
    return clean.split(/\s+/).every(palabra => texto.includes(palabra))
}

/**
 * Filtro por insignia.
 *
 * Aparte de la búsqueda por texto a propósito: buscar "deprecated" encuentra lo
 * que *diga* esa palabra, y el día que una descripción la mencione el filtro
 * empezaría a traer códigos de más sin que nadie se entere. Esto mira la
 * etiqueta, que es un dato, no prosa.
 */
export function matchesTag(item, tag) {
    if (!tag) return true
    return Boolean(item.tags?.includes(tag))
}

/**
 * Devuelve el catálogo con sólo los códigos que encajan, quitando las
 * secciones que se quedan vacías. Texto e insignia se acumulan.
 */
export function filterCatalogue(catalogue, query, tag) {
    if (!query.trim() && !tag) return catalogue
    return catalogue
        .map(category => ({
            ...category,
            codes: category.codes.filter(
                item => matchesQuery(item, query) && matchesTag(item, tag)
            ),
        }))
        .filter(category => category.codes.length > 0)
}

/** Cuántos códigos hay en un catálogo ya filtrado. */
export function countCodes(catalogue) {
    return catalogue.reduce((total, category) => total + category.codes.length, 0)
}

/**
 * Enlace al RFC que define un código.
 *
 * La URL se deriva del número en vez de escribirse a mano en el JSON: 63
 * enlaces copiados uno a uno es una errata esperando a pasar, y rfc-editor.org
 * tiene la misma forma para todos.
 */
export function specUrl(spec) {
    const numero = /^RFC (\d+)$/.exec(String(spec || ''))
    return numero ? `https://www.rfc-editor.org/rfc/rfc${numero[1]}` : null
}

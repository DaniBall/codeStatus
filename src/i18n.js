import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import catalogo from './status_codes.json'
import en from './data/textos.en.json'
import es from './data/textos.es.json'
import codigosEs from './data/codigos.es.json'

/**
 * Español e inglés.
 *
 * Mismo trato que el modo claro/oscuro: mientras no se elija nada se sigue el
 * idioma del navegador, y al elegir uno se recuerda y manda sobre lo que diga
 * el sistema.
 *
 * El inglés vive en status_codes.json, que es el catálogo de verdad; el español
 * es una capa encima. Así hay una sola fuente para la estructura (códigos,
 * familias, insignias, RFC) y el idioma sólo cambia el texto. Si algún día falta
 * una traducción, se ve el inglés en vez de un hueco.
 *
 * Los nombres de los códigos no se traducen a propósito: "404 Not Found" es lo
 * que devuelve el protocolo y lo que ves en las herramientas del navegador.
 */
const STORAGE_KEY = 'codestatus-lang'
const IDIOMAS = { en, es }
export const DISPONIBLES = ['en', 'es']

/** El idioma del navegador, si lo tenemos; si no, inglés. */
export function idiomaDelNavegador(nav = typeof navigator === 'undefined' ? {} : navigator) {
    const lista = nav.languages?.length ? nav.languages : [nav.language].filter(Boolean)
    for (const etiqueta of lista) {
        // "es-ES", "es_MX" o "es" valen todos; sólo miramos la parte de delante.
        const base = String(etiqueta).toLowerCase().split(/[-_]/)[0]
        if (DISPONIBLES.includes(base)) return base
    }
    return 'en'
}

/** Lo guardado, o null si no hay nada (o si el navegador no deja leer). */
function preferenciaGuardada() {
    try {
        const guardado = window.localStorage.getItem(STORAGE_KEY)
        return DISPONIBLES.includes(guardado) ? guardado : null
    } catch {
        return null
    }
}

/**
 * Rellena los huecos de una plantilla: "{n} de {total}" con {n: 3, total: 85}.
 * Lo que no se pase se queda como está, que es más fácil de ver que un hueco.
 */
export function rellenar(plantilla, valores = {}) {
    return String(plantilla).replace(/\{(\w+)\}/g, (hueco, clave) =>
        clave in valores ? String(valores[clave]) : hueco
    )
}

/**
 * El catálogo con el texto del idioma pedido.
 *
 * Se traduce una sola vez y aquí: a partir de este punto el buscador, las
 * tarjetas y la ficha trabajan con el texto ya resuelto y no saben de idiomas.
 * Es también lo que hace que buscar "tetera" funcione en español.
 */
export function catalogoEn(lang) {
    const textos = IDIOMAS[lang] || en
    if (lang !== 'es') return catalogo

    return catalogo.map(categoria => {
        const traducida = textos.categorias[categoria.family]
        return {
            ...categoria,
            category: traducida?.nombre ?? categoria.category,
            categoryDescription: traducida?.descripcion ?? categoria.categoryDescription,
            codes: categoria.codes.map(item => {
                const suyo = codigosEs[String(item.code)]
                if (!suyo) return item
                return {
                    ...item,
                    description: suyo.description ?? item.description,
                    // Sólo se pisa la nota si existe en español y en el original.
                    ...(item.note && suyo.note ? { note: suyo.note } : {}),
                }
            }),
        }
    })
}

/** El idioma resuelto: textos, traductor y catálogo ya en ese idioma. */
function paquete(lang, cambiar = () => {}) {
    const textos = IDIOMAS[lang] || en
    const t = (clave, valores) => {
        // Si falta una traducción se ve el inglés, no un hueco.
        const cadena = textos.ui[clave] ?? en.ui[clave] ?? clave
        return valores ? rellenar(cadena, valores) : cadena
    }
    return { lang, t, cambiar, textos, catalogo: catalogoEn(lang) }
}

// Por defecto, inglés completo: así un componente suelto —en una prueba, por
// ejemplo— funciona sin tener que envolverlo, en vez de reventar al buscar un
// texto que no está.
const LangContext = createContext(paquete('en'))

export function LanguageProvider({ children }) {
    const [preferencia, setPreferencia] = useState(preferenciaGuardada)
    const [navegador] = useState(idiomaDelNavegador)
    const lang = preferencia || navegador

    // El <html lang> importa: de ahí sale la pronunciación de un lector de
    // pantalla y la oferta de traducir del navegador. El título va detrás por
    // lo mismo, que es lo que se ve en la pestaña y en los marcadores.
    //
    // Las etiquetas og: del index.html se quedan en inglés: las lee un robot
    // que no ejecuta JavaScript, así que cambiarlas aquí no serviría de nada.
    useEffect(() => {
        document.documentElement.lang = lang
        document.title = (IDIOMAS[lang] || en).ui.titulo
    }, [lang])

    const cambiar = useCallback(() => {
        const siguiente = lang === 'es' ? 'en' : 'es'
        setPreferencia(siguiente)
        try {
            window.localStorage.setItem(STORAGE_KEY, siguiente)
        } catch {
            // Navegar en privado no debería impedir cambiar de idioma.
        }
    }, [lang])

    const valor = useMemo(() => paquete(lang, cambiar), [lang, cambiar])

    return <LangContext.Provider value={valor}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

/** Un botón, no un desplegable: con dos idiomas no hay nada que desplegar. */
export function LanguageToggle() {
    const { t, cambiar } = useLang()
    const etiqueta = t('idioma')
    return (
        <button
            type='button'
            className='langToggle'
            onClick={cambiar}
            title={etiqueta}
        >
            <span aria-hidden='true'>{t('idiomaCodigo')}</span>
            <span className='visually-hidden'>{etiqueta}</span>
        </button>
    )
}

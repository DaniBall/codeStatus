import '../App.css'
import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import TagGlossary from './TagGlossary.js'
import { duckImagePath } from '../duckImage.js'
import { specUrl } from '../spec.js'
import { useLang } from '../i18n.js'

/**
 * La ficha de un código, en una tarjeta encima del catálogo.
 *
 * La URL sigue siendo /418, así que se puede compartir y recargar. Si se llega
 * desde el catálogo, debajo sigue el catálogo tal como estaba (búsqueda,
 * filtro y scroll) y cerrar es volver atrás. Si se entra directo por la URL,
 * cerrar lleva a la portada.
 */
export default function StatusInfo() {
    const { code } = useParams();
    const { t, catalogo } = useLang()
    const navigate = useNavigate()
    const location = useLocation()
    const [grande, setGrande] = useState(false)
    const cerrarBoton = useRef(null)

    const category = catalogo.find(cat =>
        cat.codes.some(c => String(c.code) === code)
    )
    const statusCode = category?.codes.find(c => String(c.code) === code)

    const desdeCatalogo = Boolean(location.state?.fondo)
    const cerrar = () => (desdeCatalogo ? navigate(-1) : navigate('/'))

    // Escape cierra la ficha, salvo que esté abierta la foto en grande: esa
    // se lleva su propio Escape primero.
    useEffect(() => {
        if (!statusCode || grande) return undefined
        const tecla = event => { if (event.key === 'Escape') cerrar() }
        document.addEventListener('keydown', tecla)
        return () => document.removeEventListener('keydown', tecla)
    })

    // Con la ficha abierta el catálogo de debajo no se desplaza, y el foco
    // entra en la ficha para que el teclado y los lectores sepan dónde están.
    useEffect(() => {
        if (!statusCode) return undefined
        const antes = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        cerrarBoton.current?.focus()
        return () => { document.body.style.overflow = antes }
    }, [statusCode])

    if (!statusCode) return null

    // Los códigos no oficiales no están en MDN: cada uno apunta a su fuente.
    // El enlace va siempre a la versión en inglés: no todas las páginas están
    // traducidas y un enlace roto es peor que una página en otro idioma.
    const docs = statusCode.docs
        || `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode.code}`
    const docsLabel = statusCode.docsLabel || t('docsMDN')
    const rfc = specUrl(statusCode.spec)

    return (
        <div className='ficha-fondo' onClick={cerrar} data-family={category.family}>
            <article
                className='statusInfo-card'
                role='dialog'
                aria-modal='true'
                aria-labelledby='ficha-titulo'
                onClick={event => event.stopPropagation()}
            >
                <button
                    type='button'
                    className='ficha-cerrar'
                    ref={cerrarBoton}
                    aria-label={t('cerrar')}
                    onClick={cerrar}
                >
                    ×
                </button>

                {/* A 300px los chistes se pierden en los detalles: la foto
                    se puede ver entera, a todo lo que dé la pantalla. */}
                <button
                    type='button'
                    className='statusInfo-zoom'
                    aria-label={t('ampliar')}
                    onClick={() => setGrande(true)}
                >
                    <DuckImage statusCode={statusCode} family={category.family} />
                </button>

                <div className='statusInfo-body'>
                    <h1 className='statusInfo-code' id='ficha-titulo'>{statusCode.code}</h1>
                    <p className='statusInfo-name'>{statusCode.name}</p>

                    {/* La insignia y lo que quiere decir, juntas: sola es
                        jerga que sólo entiende quien no la necesitaba. */}
                    {statusCode.tags && <TagGlossary tags={statusCode.tags} />}

                    {statusCode.source && (
                        <p className='statusInfo-source'>
                            <strong>{t('noEstandar')}</strong> {t('soloDe')}{' '}
                            <strong>{statusCode.source}</strong>.
                        </p>
                    )}

                    <p className='statusInfo-description'>{statusCode.description}</p>

                    {/* Una insignia sola deja al lector sabiendo que algo pasa
                        pero no qué: la nota es la mitad que importa. */}
                    {statusCode.note && (
                        <p className='statusInfo-note'>{statusCode.note}</p>
                    )}

                    <a
                        className='statusInfo-link'
                        href={docs}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {docsLabel}
                    </a>

                    {rfc && (
                        <p className='statusInfo-spec'>
                            {t('definidoEn')}{' '}
                            <a href={rfc} target="_blank" rel="noopener noreferrer">
                                {statusCode.spec}
                            </a>
                        </p>
                    )}
                </div>
            </article>

            {grande && (
                <Ampliada
                    src={duckImagePath(statusCode.code)}
                    pie={`${statusCode.code} ${statusCode.name}`}
                    alt={t('altFoto', { code: statusCode.code, name: statusCode.name })}
                    cerrar={() => setGrande(false)}
                />
            )}
        </div>
    );
}

/** La foto a pantalla completa. Se cierra con Escape, con la X o pulsando fuera. */
function Ampliada({ src, pie, alt, cerrar }) {
    const { t } = useLang()
    const boton = useRef(null)

    useEffect(() => {
        boton.current?.focus()
        const tecla = event => { if (event.key === 'Escape') cerrar() }
        document.addEventListener('keydown', tecla)
        return () => document.removeEventListener('keydown', tecla)
    }, [cerrar])

    const fuera = event => {
        event.stopPropagation()
        cerrar()
    }

    return (
        <div className='lightbox' role='dialog' aria-modal='true' aria-label={pie} onClick={fuera}>
            <button type='button' className='lightbox-close' ref={boton} aria-label={t('cerrar')}>
                ×
            </button>
            <figure className='lightbox-figure' onClick={event => event.stopPropagation()}>
                <img src={src} alt={alt} />
                <figcaption>{pie}</figcaption>
            </figure>
        </div>
    )
}

import '../App.css'
import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import Footer from './Footer.js'
import TagGlossary from './TagGlossary.js'
import NotFound from './NotFound.js'
import { duckImagePath } from '../duckImage.js'
import { specUrl } from '../spec.js'
import { useLang } from '../i18n.js'

export default function StatusInfo() {
    const { code } = useParams();
    const { t, catalogo } = useLang()
    // Busca en el catálogo ya traducido el código correspondiente
    const category = catalogo.find(cat =>
        cat.codes.some(c => String(c.code) === code)
    )
    const statusCode = category?.codes.find(c => String(c.code) === code)

    const [grande, setGrande] = useState(false)

    if (!statusCode) return <NotFound code={code} />

    // Los códigos no oficiales no están en MDN: cada uno apunta a su fuente.
    // El enlace va siempre a la versión en inglés: no todas las páginas están
    // traducidas y un enlace roto es peor que una página en otro idioma.
    const docs = statusCode.docs
        || `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode.code}`
    const docsLabel = statusCode.docsLabel || t('docsMDN')
    const rfc = specUrl(statusCode.spec)

    return (
        <div className='App statusInfo-page' data-family={category.family}>
            <div className='statusInfo'>
                <Link className='statusInfo-back' to='/'>{t('volver')}</Link>

                <article className='statusInfo-card'>
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
                        <h1 className='statusInfo-code'>{statusCode.code}</h1>
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
            </div>
            <Footer />
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

    return (
        <div className='lightbox' role='dialog' aria-modal='true' aria-label={pie} onClick={cerrar}>
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

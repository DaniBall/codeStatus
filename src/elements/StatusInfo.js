import '../App.css'
import codeStatus from '../status_codes.json'
import { useParams, Link } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import Footer from './Footer.js'
import TagGlossary from './TagGlossary.js'
import { specUrl } from '../spec.js'

export default function StatusInfo() {
    const { code } = useParams();
    // Busca en el JSON el código correspondiente
    const category = codeStatus.find(cat =>
        cat.codes.some(c => String(c.code) === code)
    )
    const statusCode = category?.codes.find(c => String(c.code) === code)

    if (!statusCode) {
        return (
            <div className='App'>
                <div className='statusInfo-missing'>
                    <h1>Status code not found</h1>
                    <p>There is no HTTP status code <strong>{code}</strong>.</p>
                    <Link className='statusInfo-back' to='/'>← All status codes</Link>
                </div>
                <Footer />
            </div>
        )
    }

    // Los códigos no oficiales no están en MDN: cada uno apunta a su fuente.
    const docs = statusCode.docs
        || `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode.code}`
    const docsLabel = statusCode.docsLabel || 'Read the docs on MDN'
    const rfc = specUrl(statusCode.spec)

    return (
        <div className='App statusInfo-page' data-family={category.family}>
            <div className='statusInfo'>
                <Link className='statusInfo-back' to='/'>← All status codes</Link>

                <article className='statusInfo-card'>
                    <DuckImage statusCode={statusCode} family={category.family} />
                    <div className='statusInfo-body'>
                        <h1 className='statusInfo-code'>{statusCode.code}</h1>
                        <p className='statusInfo-name'>{statusCode.name}</p>

                        {/* La insignia y lo que quiere decir, juntas: sola es
                            jerga que sólo entiende quien no la necesitaba. */}
                        {statusCode.tags && <TagGlossary tags={statusCode.tags} />}

                        {statusCode.source && (
                            <p className='statusInfo-source'>
                                <strong>Not a standard code.</strong> You will only
                                see it coming from <strong>{statusCode.source}</strong>.
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
                                Defined in{' '}
                                <a href={rfc} target="_blank" rel="noopener noreferrer">
                                    {statusCode.spec}
                                </a>
                            </p>
                        )}
                    </div>
                </article>
            </div>
            <Footer />
        </div>
    );
}

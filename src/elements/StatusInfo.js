import '../App.css'
import codeStatus from '../status_codes.json'
import { useParams, Link } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import { getDuckScene } from '../duckImage'

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
            </div>
        )
    }

    const scene = getDuckScene(statusCode.code)
    // Los códigos no oficiales no están en MDN: cada uno apunta a su fuente.
    const docs = statusCode.docs
        || `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode.code}`
    const docsLabel = statusCode.docsLabel || 'Read the docs on MDN'

    return (
        <div className='App' data-family={category.family}>
            <div className='statusInfo'>
                <Link className='statusInfo-back' to='/'>← All status codes</Link>

                <article className='statusInfo-card'>
                    <DuckImage statusCode={statusCode} family={category.family} />
                    <div className='statusInfo-body'>
                        <h1 className='statusInfo-code'>{statusCode.code}</h1>
                        <p className='statusInfo-name'>{statusCode.name}</p>

                        {statusCode.source && (
                            <p className='statusInfo-source'>
                                <strong>Not a standard code.</strong> You will only
                                see it coming from <strong>{statusCode.source}</strong>.
                            </p>
                        )}

                        <p className='statusInfo-description'>{statusCode.description}</p>
                        {scene && <p className='statusInfo-scene'>🦆 {scene}</p>}
                        <a
                            className='statusInfo-link'
                            href={docs}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {docsLabel} ↗
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
}

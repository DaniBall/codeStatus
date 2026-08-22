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

    return (
        <div className='App' data-family={String(statusCode.code).charAt(0)}>
            <div className='statusInfo'>
                <Link className='statusInfo-back' to='/'>← All status codes</Link>

                <article className='statusInfo-card'>
                    <DuckImage statusCode={statusCode} />
                    <div className='statusInfo-body'>
                        <h1 className='statusInfo-code'>{statusCode.code}</h1>
                        <p className='statusInfo-name'>{statusCode.name}</p>
                        <p className='statusInfo-description'>{statusCode.description}</p>
                        {scene && <p className='statusInfo-scene'>🦆 {scene}</p>}
                        <a
                            className='statusInfo-link'
                            href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${statusCode.code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read the docs on MDN ↗
                        </a>
                    </div>
                </article>
            </div>
        </div>
    );
}

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

    if (!statusCode) return <p>Código no encontrado</p>

    const scene = getDuckScene(statusCode.code)

    return (
        <div className='App'>
            <DuckImage statusCode={statusCode} className='duckImage--detail' />
            <h2>{statusCode.code}</h2>
            <h3>{statusCode.name}</h3>
            <p>{statusCode.description}</p>
            {scene && <p className='duckScene'>🦆 {scene}</p>}
            <a href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/" + statusCode.code}
                target="_blank" rel="noopener noreferrer">Learn more</a>
            
            <Link to={`/`}> 🏠</Link>
        </div>
    );
}

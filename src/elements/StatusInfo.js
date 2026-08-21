import { useState } from 'react'
import '../App.css'
import codeStatus from '../status_codes.json'
import { useParams, Link } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import { getDuckScene } from '../duckImage'

export default function StatusInfo() {
    const { code } = useParams();
    // Variante de la imagen: al cambiarla la web genera otro pato para el mismo código
    const [variant, setVariant] = useState(0)

    // Busca en el JSON el código correspondiente
    const category = codeStatus.find(cat =>
        cat.codes.some(c => String(c.code) === code)
    )
    const statusCode = category?.codes.find(c => String(c.code) === code)

    if (!statusCode) return <p>Código no encontrado</p>

    const scene = getDuckScene(statusCode.code)

    return (
        <div className='App'>
            <DuckImage
                statusCode={statusCode}
                variant={variant}
                size={768}
                className='duckImage--detail'
            />
            {!statusCode.image && (
                <button
                    type='button'
                    className='duckImage-retry'
                    onClick={() => setVariant(v => v + 1)}
                >
                    🦆 Generar otro pato
                </button>
            )}
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

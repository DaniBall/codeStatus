import '../App.css'
import codeStatus from '../status_codes.json'
import { useParams } from 'react-router-dom'

export default function StatusInfo() {
    const { code } = useParams();
    // Busca en el JSON el código correspondiente
    const category = codeStatus.find(cat =>
        cat.codes.some(c => String(c.code) === code)
    )
    const statusCode = category?.codes.find(c => String(c.code) === code)

    if (!statusCode) return <p>Código no encontrado</p>
    return (
        <div className='App'>
            <img src={statusCode.image} alt={statusCode.name} />
            <h2>{statusCode.code}</h2>
            <h3>{statusCode.name}</h3>
            <p>{statusCode.description}</p>
            <a href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/" + statusCode.code}
                target="_blank" rel="noopener noreferrer">Learn more</a>
        </div>
    )
}
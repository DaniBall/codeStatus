import { Link } from 'react-router-dom'
import DuckImage from './DuckImage.js'
import Footer from './Footer.js'
import { useLang } from '../i18n.js'

/**
 * Lo que se ve cuando no hay nada que ver: el pato del 404, con su linterna
 * en el nido vacío. En una web de códigos HTTP, la página de error tiene que
 * ser el propio chiste.
 *
 * Con `code` es un número que no existe (/999); sin él, una ruta cualquiera.
 */
export default function NotFound({ code }) {
    const { t, catalogo } = useLang()
    const pato = catalogo.flatMap(cat => cat.codes).find(c => c.code === 404)

    return (
        <div className='App' data-family='4'>
            <div className='notFound'>
                <DuckImage statusCode={pato} family='4' className='notFound-duck' />
                <h1>{code ? t('noExiste') : t('paginaNoExiste')}</h1>
                <p>
                    {code
                        ? <>{t('noExisteDetalle')} <strong>{code}</strong>.</>
                        : t('paginaNoExisteDetalle')}
                </p>
                <Link className='statusInfo-back' to='/'>{t('volver')}</Link>
            </div>
            <Footer />
        </div>
    )
}

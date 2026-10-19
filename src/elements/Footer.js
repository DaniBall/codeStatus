import { ENDPOINT as ANALITICA } from '../analytics'
import { useLang } from '../i18n.js'

const AÑO = new Date().getFullYear()
const REPO = 'https://github.com/DaniBall/codeStatus'
// Con noreferrer el navegador no dice de dónde viene la visita; el ref sí.
const HILVAN = 'https://hilvanhoy.es/?ref=codestatus'

export default function Footer() {
    const { t, lang } = useLang()
    return (
        <footer className='siteFooter'>
            {/* Es un juego en español: a quien lee en inglés no le sirve. */}
            {lang === 'es' && (
                <a
                    className='siteFooter-promo'
                    href={HILVAN}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <span className='siteFooter-promoText'>También hice un juego</span>
                    <strong className='siteFooter-promoName'>hilvanhoy.es →</strong>
                </a>
            )}
            <p className='siteFooter-line'>
                © {AÑO} Daniel Bola Martínez. {t('pieDerechos')}{' '}
                <a
                    className='siteFooter-link'
                    href={REPO}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    {t('pieRepo')}
                </a>
            </p>
            <p className='siteFooter-line siteFooter-note'>
                {t('pieFuentes')}
                {/* Sólo se promete si de verdad hay analítica configurada. */}
                {ANALITICA && ` ${t('pieAnalitica')}`}
            </p>
        </footer>
    )
}

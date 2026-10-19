import { ENDPOINT as ANALITICA } from '../analytics'
import { useLang } from '../i18n.js'

const AÑO = new Date().getFullYear()
const REPO = 'https://github.com/DaniBall/codeStatus'
const HILVAN = 'https://hilvanhoy.es'

export default function Footer() {
    const { t, lang } = useLang()
    return (
        <footer className='siteFooter'>
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
                {/* Es un juego en español: a quien lee en inglés no le sirve. */}
                {lang === 'es' && (
                    <>
                        {' · '}
                        También hice{' '}
                        <a
                            className='siteFooter-link'
                            href={HILVAN}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            hilvanhoy.es
                        </a>
                    </>
                )}
            </p>
            <p className='siteFooter-line siteFooter-note'>
                {t('pieFuentes')}
                {/* Sólo se promete si de verdad hay analítica configurada. */}
                {ANALITICA && ` ${t('pieAnalitica')}`}
            </p>
        </footer>
    )
}

import { ENDPOINT as ANALITICA } from '../analytics'
import { useLang } from '../i18n.js'

const AÑO = new Date().getFullYear()
const REPO = 'https://github.com/DaniBall/codeStatus'

export default function Footer() {
    const { t } = useLang()
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
            </p>
            <p className='siteFooter-line siteFooter-note'>
                {t('pieFuentes')}
                {/* Sólo se promete si de verdad hay analítica configurada. */}
                {ANALITICA && ` ${t('pieAnalitica')}`}
            </p>
        </footer>
    )
}

import { ENDPOINT as ANALITICA } from '../analytics'

const AÑO = new Date().getFullYear()
const REPO = 'https://github.com/DaniBall/codeStatus'

export default function Footer() {
    return (
        <footer className='siteFooter'>
            <p className='siteFooter-line'>
                © {AÑO} Daniel Bola Martínez. All rights reserved.{' '}
                <a
                    className='siteFooter-link'
                    href={REPO}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Source on GitHub
                </a>
            </p>
            <p className='siteFooter-line siteFooter-note'>
                Status code definitions come from the IANA HTTP Status Code Registry
                and the relevant RFCs. Duck photos are AI-generated.
                {/* Sólo se promete si de verdad hay analítica configurada. */}
                {ANALITICA && ' Visits are counted anonymously with GoatCounter. No cookies.'}
            </p>
        </footer>
    )
}

const AÑO = new Date().getFullYear()

export default function Footer() {
    return (
        <footer className='siteFooter'>
            <p className='siteFooter-line'>
                © {AÑO} Daniel Bola Martínez · codeStatus. All rights reserved.
            </p>
            <p className='siteFooter-line siteFooter-note'>
                Status code definitions come from the IANA HTTP Status Code Registry
                and the relevant RFCs. Duck photos are AI-generated.
            </p>
        </footer>
    )
}

import { useEffect, useState } from 'react'

const UMBRAL = 600

function Arriba() {
    return (
        <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true' focusable='false'
            fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M12 19V5M5 12l7-7 7 7' />
        </svg>
    )
}

/** Solo aparece tras bajar un buen tramo: en poco scroll estorbaría más de lo que ayuda. */
export default function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > UMBRAL)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!visible) return null

    const suave = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    return (
        <button
            type='button'
            className='backToTop'
            onClick={() => window.scrollTo({ top: 0, behavior: suave ? 'smooth' : 'auto' })}
            title='Back to top'
        >
            <Arriba />
            <span className='visually-hidden'>Back to top</span>
        </button>
    )
}

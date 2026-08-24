import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Modo claro y oscuro.
 *
 * Mientras no se elige nada se sigue la preferencia del sistema, y de eso se
 * encarga el propio CSS con prefers-color-scheme: así no hay parpadeo antes de
 * que arranque React. Al elegir un modo se marca data-theme en el <html>, que
 * en el CSS pesa más que la media query, y la elección se recuerda.
 */
const STORAGE_KEY = 'codestatus-theme'
const QUERY = '(prefers-color-scheme: dark)'

const ThemeContext = createContext({ scheme: 'light', toggle: () => {} })

function systemScheme() {
    return window.matchMedia?.(QUERY).matches ? 'dark' : 'light'
}

/** Lo guardado, o 'system' si no hay nada (o si el navegador no deja leer). */
function storedPreference() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        return saved === 'light' || saved === 'dark' ? saved : 'system'
    } catch {
        return 'system'
    }
}

export function ThemeProvider({ children }) {
    const [preference, setPreference] = useState(storedPreference)
    const [system, setSystem] = useState(systemScheme)

    // El sistema puede cambiar mientras la página está abierta.
    useEffect(() => {
        const media = window.matchMedia?.(QUERY)
        if (!media) return undefined
        const onChange = event => setSystem(event.matches ? 'dark' : 'light')
        media.addEventListener('change', onChange)
        return () => media.removeEventListener('change', onChange)
    }, [])

    const scheme = preference === 'system' ? system : preference

    useEffect(() => {
        const root = document.documentElement
        // Sin elección explícita no se marca nada y decide la media query.
        if (preference === 'system') delete root.dataset.theme
        else root.dataset.theme = preference
    }, [preference])

    const toggle = useCallback(() => {
        const next = scheme === 'dark' ? 'light' : 'dark'
        setPreference(next)
        try {
            window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // Navegar en privado no debería impedir cambiar de modo.
        }
    }, [scheme])

    const value = useMemo(() => ({ scheme, toggle }), [scheme, toggle])
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

/** Luna y sol dibujados. Con emoji cada sistema pinta el suyo y desentona. */
function Luna() {
    return (
        <svg width='16' height='16' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
            <path
                d='M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2z'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinejoin='round'
            />
        </svg>
    )
}

function Sol() {
    return (
        <svg width='16' height='16' viewBox='0 0 24 24' aria-hidden='true' focusable='false'
            fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
            <circle cx='12' cy='12' r='4' />
            <path d='M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4' />
        </svg>
    )
}

export function ThemeToggle() {
    const { scheme, toggle } = useTheme()
    const aOscuro = scheme === 'light'
    const etiqueta = aOscuro ? 'Switch to dark mode' : 'Switch to light mode'
    return (
        <button
            type='button'
            className='themeToggle'
            onClick={toggle}
            aria-pressed={scheme === 'dark'}
            title={etiqueta}
        >
            {aOscuro ? <Luna /> : <Sol />}
            <span className='visually-hidden'>{etiqueta}</span>
        </button>
    )
}

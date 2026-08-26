import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import codeStatus from './status_codes.json'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatusInfo from './elements/StatusInfo.js'
import DuckImage from './elements/DuckImage.js'
import Mark from './elements/Mark.js'
import Footer from './elements/Footer.js'
import BackToTop from './elements/BackToTop.js'
import { ThemeProvider, ThemeToggle } from './theme.js'
import { LanguageProvider, LanguageToggle, useLang } from './i18n.js'
import { countCodes, filterCatalogue } from './search.js'
import { TAGS, tagKind } from './tags.js'
import { subirArriba } from './scroll.js'
import Analytics from './analytics.js'

const TOTAL = countCodes(codeStatus)

function Home() {
  const { t, textos, catalogo } = useLang()
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState(null)
  const visible = useMemo(() => filterCatalogue(catalogo, query, tag), [catalogo, query, tag])
  const encontrados = countCodes(visible)
  const buscando = query.trim().length > 0
  const insignia = nombre => textos.insignias[nombre]

  // Qué se está filtrando, para el recuento y para el aviso de "nada encaja".
  const criterios = [
    buscando ? query.trim() : null,
    tag ? t('criterioInsignia', { tag: insignia(tag).etiqueta }) : null,
  ]
    .filter(Boolean)
    .join(` ${t('yCriterios')} `)

  // La leyenda vive al final y los resultados están arriba: pulsar y quedarse
  // abajo sería filtrar a ciegas.
  const alternarTag = pulsado => {
    setTag(actual => (actual === pulsado ? null : pulsado))
    subirArriba()
  }

  const limpiar = () => {
    setQuery('')
    setTag(null)
  }

  // La barra va pegada arriba, así que al saltar a una familia hay que dejarle
  // su hueco. No es un número fijo: cambia con el ancho, según envuelvan las
  // fichas, y al filtrar, que el índice se queda con menos familias. Lo mide y
  // el CSS lo usa en scroll-margin-top.
  const barra = useRef(null)
  useEffect(() => {
    const nodo = barra.current
    if (!nodo) return undefined

    const medir = () =>
      document.documentElement.style.setProperty('--topBar', `${nodo.offsetHeight}px`)
    medir()

    if (typeof ResizeObserver === 'undefined') return undefined
    const observador = new ResizeObserver(medir)
    observador.observe(nodo)
    return () => observador.disconnect()
  })

  return (
    <div className="App">
      <header className='topBar' ref={barra}>
        <h1 className='topBar-title'>
          <Mark />
          codeStatus
        </h1>

        <form className='search' role='search' onSubmit={event => event.preventDefault()}>
          <label className='visually-hidden' htmlFor='search'>{t('buscar')}</label>
          <input
            id='search'
            className='search-input'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={t('buscarPista')}
            autoComplete='off'
            aria-describedby='search-count'
          />
        </form>

        <div className='topBar-controls'>
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <nav className='topBar-nav' aria-label={t('familias')}>
          {visible.map(category => (
            <a
              key={category.family}
              className='topBar-link'
              href={`#c${category.family}`}
              data-family={category.family}
            >
              {category.category}
            </a>
          ))}
        </nav>

        {/* Filtran, así que van con el resto de lo que filtra y no en un
            glosario aparte. Los de arriba saltan a una sección; estos quitan
            códigos de en medio, y por eso son botones y no enlaces. */}
        <div className='topBar-filters' role='group' aria-label={t('filtrar')}>
          {TAGS.map(nombre => (
            <button
              type='button'
              className='tag'
              key={nombre}
              data-kind={tagKind(nombre)}
              aria-pressed={tag === nombre}
              title={insignia(nombre).significado}
              onClick={() => alternarTag(nombre)}
            >
              {insignia(nombre).etiqueta}
            </button>
          ))}
        </div>
      </header>

      <div className='searchStatus'>
        {/* El recuento se anuncia solo, para quien no ve desaparecer las tarjetas. */}
        <p id='search-count' className='search-count' role='status'>
          {criterios
            ? t('encontrados', { n: encontrados, total: TOTAL, criterios })
            : t('total', { n: TOTAL })}
        </p>
        {/* El filtro se pulsa al final de la página; quitarlo tiene que poder
            hacerse desde aquí arriba, que es donde se ve el resultado. */}
        {tag && (
          <button type='button' className='searchStatus-clear' onClick={() => setTag(null)}>
            {t('limpiarFiltro')}
          </button>
        )}
      </div>

      {visible.map(category => (
        <section
          key={category.family}
          id={`c${category.family}`}
          className='category'
          data-family={category.family}
        >
          <div className='category-header'>
            <h2 className='category-title'>{category.category}</h2>
            <p className='category-description'>{category.categoryDescription}</p>
          </div>
          <div className='codeStatusSpace'>
            {category.codes.map(item => (
              <Link to={`/${item.code}`} key={item.code} className='cardLink'>
                <article className='codeStatusCard'>
                  <DuckImage statusCode={item} family={category.family} />
                  <div className='codeStatusCard-body'>
                    <h3 className='codeStatusCard-code'>{item.code}</h3>
                    <p className='codeStatusCard-name'>{item.name}</p>
                    {/* De dónde sale, y en qué estado está: sin esto un 521
                        parece tan estándar como un 404, y un 102 tan vigente. */}
                    {(item.source || item.tags) && (
                      <div className='codeStatusCard-marks'>
                        {item.source && (
                          <span className='codeStatusCard-source'>{item.source}</span>
                        )}
                        {/* En la tarjeta sólo cabe la insignia; el significado
                            va en el title y, entero, en la ficha. */}
                        {item.tags?.map(nombre => (
                          <span
                            className='tag'
                            key={nombre}
                            data-kind={tagKind(nombre)}
                            title={insignia(nombre).significado}
                          >
                            {insignia(nombre).etiqueta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {encontrados === 0 && (
        <div className='emptyState'>
          <p>{t('sinResultados')} <strong>{criterios}</strong>.</p>
          <button type='button' className='emptyState-clear' onClick={limpiar}>
            {t('limpiarBusqueda')}
          </button>
        </div>
      )}

      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          {/* Dentro del router: es quien sabe cuándo cambia la ruta sin recargar. */}
          <Analytics />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:code" element={<StatusInfo />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

import { useMemo, useState } from 'react';
import './App.css';
import codeStatus from './status_codes.json'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatusInfo from './elements/StatusInfo.js'
import DuckImage from './elements/DuckImage.js'
import Footer from './elements/Footer.js'
import { ThemeProvider, ThemeToggle } from './theme.js'
import { countCodes, filterCatalogue } from './search.js'

const TOTAL = countCodes(codeStatus)

function Home() {
  const [query, setQuery] = useState('')
  const visible = useMemo(() => filterCatalogue(codeStatus, query), [query])
  const encontrados = countCodes(visible)
  const buscando = query.trim().length > 0

  return (
    <div className="App">
      <header className='topBar'>
        <h1 className='topBar-title'>🦆 codeStatus</h1>

        <form className='search' role='search' onSubmit={event => event.preventDefault()}>
          <label className='visually-hidden' htmlFor='search'>Search status codes</label>
          <input
            id='search'
            className='search-input'
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='Search: 404, timeout, nginx…'
            autoComplete='off'
            aria-describedby='search-count'
          />
        </form>

        <ThemeToggle />

        <nav className='topBar-nav' aria-label='Status code families'>
          {visible.map(category => (
            <a
              key={category.category}
              className='topBar-link'
              href={`#c${category.family}`}
              data-family={category.family}
            >
              {category.category}
            </a>
          ))}
        </nav>
      </header>

      {/* El recuento se anuncia solo, para quien no ve desaparecer las tarjetas. */}
      <p id='search-count' className='search-count' role='status'>
        {buscando
          ? `${encontrados} of ${TOTAL} status codes match “${query.trim()}”`
          : `${TOTAL} status codes`}
      </p>

      {visible.map(category => (
        <section
          key={category.category}
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
                    {/* De dónde sale: sin esto, un 521 parece tan estándar como un 404. */}
                    {item.source && (
                      <p className='codeStatusCard-source'>{item.source}</p>
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
          <p>No status code matches <strong>{query.trim()}</strong>.</p>
          <button type='button' className='emptyState-clear' onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:code" element={<StatusInfo />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

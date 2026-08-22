import './App.css';
import codeStatus from './status_codes.json'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatusInfo from './elements/StatusInfo.js'
import DuckImage from './elements/DuckImage.js'

/** Familia del código (1 para los 1xx, 2 para los 2xx...), que elige el color. */
export function familyOf(category) {
  return String(category).charAt(0)
}

function Home() {
  return (
    <div className="App">
      <header className='topBar'>
        <h1 className='topBar-title'>🦆 codeStatus</h1>
        <nav className='topBar-nav' aria-label="Status code families">
          {codeStatus.map(category => (
            <a
              key={category.category}
              className='topBar-link'
              href={`#c${category.category}`}
              data-family={familyOf(category.category)}
            >
              {category.category}
            </a>
          ))}
        </nav>
      </header>

      {codeStatus.map(category => (
        <section
          key={category.category}
          id={`c${category.category}`}
          className='category'
          data-family={familyOf(category.category)}
        >
          <div className='category-header'>
            <h2 className='category-title'>{category.category}</h2>
            <p className='category-description'>{category.categoryDescription}</p>
          </div>
          <div className='codeStatusSpace'>
            {category.codes.map(item => (
              <Link to={`/${item.code}`} key={item.code} className='cardLink'>
                <article className='codeStatusCard'>
                  <DuckImage statusCode={item} />
                  <div className='codeStatusCard-body'>
                    <h3 className='codeStatusCard-code'>{item.code}</h3>
                    <p className='codeStatusCard-name'>{item.name}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:code" element={<StatusInfo />} />
      </Routes>
    </BrowserRouter>
  )
}

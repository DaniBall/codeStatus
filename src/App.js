import { Fragment } from 'react';
import './App.css';
import codeStatus from './status_codes.json'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatusInfo from './elements/StatusInfo.js'
import DuckImage from './elements/DuckImage.js'

function Home() {
  return (
    <div className="App">
      {codeStatus.map(category => (
        <Fragment key={category.category}>
          <div className='App-header'>
            <h1>{category.category}</h1>
            <p>{category.categoryDescription}</p>
          </div>
          <div className='codeStatusSpace'>
            {category.codes.map(item => (
              <Link to={`/${item.code}`} key={item.code} className='cardLink'> 
                <div className='codeStatusCard'>
                  <DuckImage statusCode={item} />
                  <h2>{item.code}</h2>
                  <h3>{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </Fragment>
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

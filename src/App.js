import logo from './logo.svg';
import './App.css';
import codeStatus from './status_codes.json'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatusInfo from './elements/StatusInfo.js'

function Home() {
  return (
    <div className="App">
      {codeStatus.map(category => (
        <span>
          <div className='App-header'>
            <h1>{category.category}</h1>
            <p>{category.categoryDescription}</p>
          </div>
          <div className='codeStatusSpace'>
            {category.codes.map(item => (
              <Link to={`/${item.code}`} key={item.code}> 
                <div className='codeStatusCard'>
                  <img src={item.image}></img>
                  <h2>{item.code}</h2>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <a href={"https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/" + item.code} target="_blank" rel="noopener noreferrer">Learn more</a>
                </div>
              </Link>
            ))}
          </div>
        </span>
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

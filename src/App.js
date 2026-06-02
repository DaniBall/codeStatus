import logo from './logo.svg';
import './App.css';
import codeStatus from './status_codes.json'

function App() {
  console.log(codeStatus);
  console.log(Array.isArray(codeStatus));
  return (
    <div className="App">
      {codeStatus.map(category => (
        <ul>
          <div className='App-header'>
            <h1>{category.category}</h1>
            <p>{category.categoryDescription}</p>
          </div>
          <div>
            {category.codes.map(code => (
              <div>
                <img src={code.image}></img>
                <h2>{code.code}</h2>
                <h3>{code.name}</h3>
                <p>{code.description}</p>
              </div>
            ))}
          </div>
        </ul>
      ))}
    </div>
  );
}

export default App;

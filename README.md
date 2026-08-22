# codeStatus

Catálogo visual de los códigos de estado HTTP: cada código se explica con una
foto ultrarrealista y absurda protagonizada por patos.

## Las imágenes de patos

Las fotos **se generan una sola vez** y se guardan en el repositorio. La web no
llama a ningún servicio: sólo carga `public/ducks/<código>.jpg`, así que
aparecen al instante.

```bash
npm run ducks
```

Eso recorre los 63 códigos, pide cada foto al generador y la deja en
`public/ducks/`. Tarda unos minutos la primera vez. Luego **se revisan a mano**:
la que no se entienda o salga fea, se borra y se vuelve a ejecutar el script, o
se regenera sólo esa. Cuando convenzan, se suben al repositorio.

```bash
npm run ducks                    # sólo las que falten
npm run ducks -- 404 500         # regenera esos dos códigos
npm run ducks -- --all           # rehace las 63
npm run ducks -- --model turbo   # prueba otro modelo
```

Variables de entorno: `DUCK_ENDPOINT`, `DUCK_MODEL`, `DUCK_SIZE`. Por defecto se
usa [Pollinations](https://pollinations.ai), que no necesita clave de API.

### De dónde sale cada escena

`src/data/duckScenes.json` guarda, para cada código, la escena que lo ilustra
(el 404 alumbra un nido vacío con una linterna, el 429 acaba sepultado por un
montón de patitos, el 418 lleva una tetera por sombrero). El script le añade el
`style` del mismo fichero y con eso arma el prompt.

Las escenas son deliberadamente **cortas**, de una docena de palabras: cuanto
más se alarga un prompt, menos caso hace el modelo a la escena y menos se
entiende de qué código habla. Hay una prueba que impide que crezcan de 20
palabras.

### Si todavía no hay foto

Mientras un código no tenga su `.jpg` —recién clonado el repo, o porque esa foto
se borró— la tarjeta enseña un pato SVG dibujado en local con el número del
código. Nunca aparece una imagen rota, y la web funciona sin haber ejecutado el
script.

### Fijar una foto a mano

Si un código tiene el campo `image` relleno en `src/status_codes.json` (con un
`data:` URI), esa foto manda sobre la generada. Así se conservan las fotos
elegidas a mano para el 206 y el 207. También vale con dejar tu propio
`public/ducks/<código>.jpg`: el script no lo pisa salvo que uses `--all`.

## Comprobaciones

```bash
npm test    # 17 pruebas
npm run build
```

Las pruebas verifican que todos los códigos tienen escena y que ninguna se pasa
de larga, que cada código apunta a su fichero, que el SVG de respaldo es XML
correcto y sin dependencias de red, y que **las fotos que haya en
`public/ducks/` son JPEG válidos** y corresponden a códigos reales: si una se
descarga a medias o el generador devuelve una página de error disfrazada, la
prueba lo caza antes de subirla.

## Despliegue automático en GitHub Pages

`.github/workflows/deploy.yml` compila y publica en cada push a `master`. Para
activarlo hay que hacer **una cosa a mano, una sola vez**:

> Settings → Pages → *Build and deployment* → **Source: GitHub Actions**

A partir de ahí cada push a `master` instala, pasa las pruebas, compila con
`CI=true` (los avisos cuentan como error, así no se publica una web rota) y
despliega. También se puede lanzar a mano desde la pestaña *Actions*.

El script `npm run deploy` (paquete `gh-pages`) sigue existiendo, pero ya no
hace falta: publica en la rama `gh-pages`, que el modo *GitHub Actions* ignora.

### Rutas directas

`npm run build` copia `index.html` a `404.html` (script `postbuild`). GitHub
Pages sirve ese fichero cuando la ruta no existe como fichero, así que entrar
directamente en `/codeStatus/418` o recargar esa página funciona, en vez de dar
un 404 en blanco.

---


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

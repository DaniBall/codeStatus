# codeStatus

Catálogo visual de los códigos de estado HTTP: cada código se explica con una
foto ultrarrealista y absurda protagonizada por patos.

## Las imágenes de patos

La web no guarda 63 fotos: las **genera bajo demanda**.

- `src/data/duckScenes.js` describe, para cada uno de los 63 códigos, la escena
  de patos que ilustra su significado (el 404 busca un nido vacío con linterna,
  el 429 acaba sepultado por cien patitos pidiendo pan, el 418 lleva una tetera
  por sombrero...).
- `src/duckImage.js` monta con esa escena el prompt de la imagen —añadiéndole el
  estilo *ultra realistic photograph*— y construye la URL del generador.
- `src/elements/DuckImage.js` pinta la imagen. Sólo la pide cuando la tarjeta se
  acerca a la ventana, y mientras tanto —o si el generador falla o tarda más de
  45 s— muestra un pato SVG dibujado en local, así que **ninguna tarjeta se
  queda con una imagen rota**. Un fallo se reintenta una vez.
- `src/duckQueue.js` limita a 3 las imágenes que se generan a la vez. Sin esto,
  la home lanzaría 61 peticiones de golpe y un generador gratuito respondería
  con límites de uso: casi ninguna llegaría.

La semilla de cada imagen se deriva del código, de modo que un mismo código
enseña siempre el mismo pato (y el navegador lo cachea). En la página de detalle
el botón **🦆 Generar otro pato** cambia la semilla para pedir otra versión.

### Cambiar de generador

Por defecto se usa [Pollinations](https://pollinations.ai) (no necesita clave de
API). Para apuntar a otro servicio basta con definir la variable de entorno:

```bash
REACT_APP_DUCK_IMAGE_ENDPOINT=https://mi-generador/prompt/ npm start
```

La URL lleva sólo `width`, `height` y `seed`, que es lo que entiende cualquier
servicio. Si el tuyo admite más (modelo, marca de agua...), se añaden con:

```bash
REACT_APP_DUCK_IMAGE_PARAMS='model=flux&nologo=true' npm start
```

### Fijar una foto a mano

Si un código tiene el campo `image` relleno en `src/status_codes.json` (con un
`data:` URI), esa foto manda sobre la imagen generada. Así se conservan las
fotos elegidas a mano para el 206 y el 207.

## Comprobaciones

```bash
npm test    # 20 pruebas: escenas, URLs, cola, respaldo SVG y fotos fijadas
npm run build
```

Las pruebas verifican, entre otras cosas, que todos los códigos tienen escena,
que las URLs generadas son válidas y únicas, que la cola nunca lanza más de tres
generaciones a la vez, que el SVG de respaldo es XML correcto y sin dependencias
de red, y que las fotos incrustadas en el JSON se decodifican y tienen cabecera
de imagen válida.

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

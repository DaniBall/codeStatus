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
- `src/elements/DuckImage.js` pinta la imagen. Mientras se genera, y también si
  el generador falla o tarda más de 45 s, muestra un pato SVG dibujado en local,
  así que **ninguna tarjeta se queda con una imagen rota**.

La semilla de cada imagen se deriva del código, de modo que un mismo código
enseña siempre el mismo pato (y el navegador lo cachea). En la página de detalle
el botón **🦆 Generar otro pato** cambia la semilla para pedir otra versión.

### Cambiar de generador

Por defecto se usa [Pollinations](https://pollinations.ai) (no necesita clave de
API). Para apuntar a otro servicio basta con definir la variable de entorno:

```bash
REACT_APP_DUCK_IMAGE_ENDPOINT=https://mi-generador/prompt/ npm start
```

### Fijar una foto a mano

Si un código tiene el campo `image` relleno en `src/status_codes.json` (con un
`data:` URI), esa foto manda sobre la imagen generada. Así se conservan las
fotos elegidas a mano para el 206 y el 207.

## Comprobaciones

```bash
npm test    # 19 pruebas: cobertura de escenas, URLs, respaldo SVG y fotos fijadas
npm run build
```

Las pruebas verifican, entre otras cosas, que todos los códigos tienen escena,
que las URLs generadas son válidas y únicas, que el SVG de respaldo es XML
correcto y sin dependencias de red, y que las fotos incrustadas en el JSON se
decodifican y tienen cabecera de imagen válida.

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

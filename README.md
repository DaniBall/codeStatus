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

Eso recorre los 85 códigos, pide cada foto al generador y la deja en
`public/ducks/`. Tarda unos minutos la primera vez. Luego **se revisan a mano**:
la que no se entienda o salga fea, se borra y se vuelve a ejecutar el script, o
se regenera sólo esa. Cuando convenzan, se suben al repositorio.

```bash
npm run ducks                    # sólo las que falten
npm run ducks -- 404 500         # regenera esos dos códigos
npm run ducks -- 404 --reroll    # otra versión distinta de esa imagen
npm run ducks -- --all           # rehace las 85
npm run ducks -- --model turbo   # prueba otro modelo
```

La semilla de cada imagen es su propio código, así que repetir la generación da
**exactamente la misma foto**. Cuando una sale con defectos, lo que hace falta
es `--reroll`, que cambia la semilla. `--seed N` fija una concreta.

### Elegir modelo

Desde la propia terminal se puede ver qué ofrece el servicio y comparar sin
tocar las imágenes buenas:

```bash
npm run ducks -- --models                    # qué modelos hay disponibles hoy
npm run ducks -- 404 --compare flux,turbo    # el mismo código con cada uno
```

Las comparaciones se guardan en `duck-samples/`, que no se versiona ni entra en
la web. Cuando uno convenza:

```bash
npm run ducks -- --all --model <el que ganase>
```

### Límite de uso

El servicio es gratuito y limita por uso: pedirle muchas a la vez devuelve
`429` en casi todas. Por eso el script va **de una en una y espaciando seis
segundos** las peticiones, respeta la cabecera `Retry-After` cuando el servidor
la manda y reintenta hasta cinco veces doblando la espera.

Aun así puede fallar alguna. No importa: el script sólo genera lo que no
existe, así que se vuelve a lanzar y sigue por donde iba. Si insiste en fallar,
sube la espera:

```bash
DUCK_INTERVAL=15000 npm run ducks
```

Variables de entorno: `DUCK_ENDPOINT`, `DUCK_MODEL`, `DUCK_SIZE`,
`DUCK_CONCURRENCY`, `DUCK_INTERVAL`, `DUCK_ATTEMPTS`. Por defecto se usa
[Pollinations](https://pollinations.ai), que no necesita clave de API.

### De dónde sale cada escena

`src/data/duckScenes.json` guarda, para cada uno de los 85 códigos, la escena que lo ilustra
(el 404 alumbra un nido vacío con una linterna, el 429 acaba sepultado por un
montón de patitos, el 418 lleva una tetera por sombrero). El script le añade el
`style` del mismo fichero y con eso arma el prompt.

Las escenas rondan las **25 palabras** y describen escenario, luz y qué se ve
en el encuadre. La diferencia está en que el detalle sea **concreto**: "lit only
by a narrow torch beam from off-frame" aporta, "beautiful, amazing, 8k" no.
Los adjetivos apilados y los detalles decorativos compiten con el chiste y
hacen que no se entienda de qué código habla. Una prueba las mantiene entre 12
y 35 palabras.

Y están escritas para que **el pato no tenga que manipular nada**. Un pato
"sujetando" o "pulsando" algo obliga al modelo a inventarle manos, y de ahí
salen los picos torcidos y las patas de más. El objeto va en la escena, no en
las alas: *a duck standing on a big red reset button*, no *pressing it*. Otra
prueba comprueba que no vuelva a colarse ninguno de esos verbos.

Por lo mismo se generan a 1024px, donde la anatomía sale bastante mejor que a
768.

### Si todavía no hay foto

Mientras un código no tenga su `.jpg` —recién clonado el repo, o porque esa foto
se borró— la tarjeta enseña un pato SVG dibujado en local con el número del
código. Nunca aparece una imagen rota, y la web funciona sin haber ejecutado el
script.

### Poner una foto a mano

Basta con dejar tu propio `public/ducks/<código>.jpg`: el script sólo genera
las que faltan, así que no lo pisa salvo que uses `--all`.

## Códigos

Las cinco familias oficiales están completas: los 63 códigos del registro de
IANA, ni uno más ni uno menos. Hay una prueba que lo comprueba código a código,
para que nadie cuele uno inventado entre los estándar.

Aparte va **In the wild**: 22 códigos que no están en ningún estándar pero que
te encuentras trabajando, cada uno de un servidor, un CDN o un framework
concreto. Cloudflare (520-526, 530), nginx (444, 494-497, 499), Laravel (419),
la API vieja de Twitter (420), Microsoft (440, 449, 450), Apache/cPanel (509) y
un par de convenios informales de proxies (598, 599).

Como confundirlos con los estándar sería un problema, cada uno lleva **de dónde
sale**: una insignia en la tarjeta, un aviso en su ficha y un enlace a la
documentación de quien lo inventó en vez de a MDN, que no los recoge. Tienen
además su propio color, distinto de las cinco familias.

### Estado de cada código

No todos los códigos siguen vigentes, y un catálogo que no lo diga engaña: el
`102` lleva años deprecado y a simple vista parecía tan normal como el `200`.
Cada código puede llevar insignias, y salen tanto en la tarjeta como en la
ficha:

| Insignia | Qué significa |
| --- | --- |
| `Deprecated` | Retirado. `102`, `305` y `510` |
| `Reserved` | Nunca llegó a usarse. `306` |
| `Experimental` | Todavía no es estable. `425` |
| `Joke` | El de la tetera, `418` |
| `No body` | La respuesta no lleva cuerpo. Los `1xx`, `204`, `205` y `304` |

Las cuatro primeras son avisos y van en color de aviso, que no es el de ninguna
familia a propósito: con el color de su sección se leerían como decoración. `No
body` es un dato, no una advertencia, y va discreta.

Una insignia sola deja al lector sabiendo que pasa algo pero no qué, así que
todas las de aviso llevan una **nota** que lo explica en la ficha, y hay una
prueba que lo exige. También la llevan el `413` y el `422`, que no están
deprecados pero sí **renombrados** por RFC 9110 (`Payload Too Large` pasó a
`Content Too Large`, y `Unprocessable Entity` a `Unprocessable Content`): aquí
salen con el nombre nuevo, avisando del viejo, que es el que sigue devolviendo
casi todo el mundo.

Los 63 oficiales dicen además **qué RFC los define**, con enlace. La URL se
deriva del número en `src/spec.js` en vez de escribirse a mano en el JSON:
63 enlaces copiados uno a uno son una errata esperando a pasar. En móvil esa
línea se oculta, porque el botón de MDN queda justo encima y lleva a lo mismo,
y así la ficha sigue cabiendo entera sin scroll.

> Los estados se han contrastado contra lo que documentan MDN e IANA, pero **no
> se han releído en vivo**: el entorno donde se editó esto no tiene salida a
> internet. Si algún día MDN cambia una etiqueta, esto no se entera solo.

## Buscador

La barra lleva un buscador que filtra según escribes. Busca contra el número,
el nombre, la procedencia, el estado, el RFC y la descripción, así que valen
`404`, `timeout`, `nginx`, `csrf`, `deprecated` o `rfc 6585`. Con varias
palabras tienen que aparecer todas.

La puntuación se ignora a los dos lados: `timeout` encuentra `Login Time-out`
y `im a teapot` encuentra `I'm a teapot`.

## Volver arriba

La portada son 85 tarjetas en seis secciones, así que desde el final hay un buen
trecho hasta el buscador. Un botón fijo abajo a la derecha sube del todo, y sólo
aparece pasados 600px de scroll: antes de eso estorbaría más de lo que ayuda.
Respeta `prefers-reduced-motion`, subiendo de golpe en vez de animado.

En la ficha de un código no hace falta: el enlace de arriba ya vuelve a la
portada.

## Visitas

GitHub Pages no da estadísticas, y el *Traffic* de GitHub cuenta visitas al
**repositorio**, no a la web. Para medir la web hay un contador opcional con
[GoatCounter](https://www.goatcounter.com): sin cookies y sin datos personales,
así que no hace falta banner de consentimiento.

**Viene apagado.** Mientras `REACT_APP_GOATCOUNTER` esté vacío no se carga
nada, no sale ni una petición y el pie no promete nada. Para encenderlo:

1. Crea un sitio gratuito en GoatCounter (uso personal).
2. Pon su URL de conteo en `.env.production` y haz push. El despliegue la
   recoge sola.

```
REACT_APP_GOATCOUNTER=https://tu-sitio.goatcounter.com/count
```

No es un secreto: aparece en el código fuente de la página.

Tampoco se cuenta en desarrollo ni en las pruebas, ni a quien lleve activado el
*Do Not Track* del navegador.

### Por qué no basta con pegar el script

La web es un SPA: al pinchar en un código **no se recarga la página**, sólo
cambia la URL. El script de GoatCounter sólo vería la carga inicial, así que se
contarían las visitas a la portada y **cero en las 85 fichas**, que es justo lo
interesante. Por eso se le pasa `no_onload` y cuenta `src/analytics.js` desde
el router, en cada cambio de ruta y también en la primera.

## Licencia

Proyecto privado: ver `LICENSE`. Las definiciones de los códigos vienen del
registro de IANA y de los RFC correspondientes, y no las cubre esa licencia.

## Colores

Cada familia de códigos tiene su color, y ese mismo color manda en la cabecera
de la sección, en el borde y el número de la tarjeta, en la ficha del código y
en el pato dibujado de respaldo:

| Familia | Color |
|---------|-------|
| `1xx` informativos    | azul     |
| `2xx` correctos       | verde    |
| `3xx` redirecciones   | ámbar    |
| `4xx` error de cliente| rojo     |
| `5xx` error de servidor| morado  |
| `In the wild` no oficiales | verde azulado |

Hay **dos modos, claro y oscuro**. Sin elegir nada se sigue la preferencia del
sistema, y de eso se encarga el propio CSS con `prefers-color-scheme`, así que
no hay parpadeo antes de que arranque React. El botón de la barra fija uno
—marca `data-theme` en el `<html>`, que pesa más que la media query— y lo
recuerda en `localStorage`.

Los seis acentos se aclaran en oscuro para mantener el contraste. Las dos
paletas pasan AA: en la clara el peor par queda en 4,7:1 y en la oscura, en
6,9:1.

El fondo es un gris neutro a propósito. Si tuviera color propio competiría con
los seis acentos y el color dejaría de significar de qué familia es un código.

Así el color dice de qué familia es un código, en vez de ser decoración suelta.
Los cinco acentos pasan el contraste AA de WCAG sobre blanco (el peor está en
5.3:1) y el texto principal sobre el fondo llega a 15.8:1.

## Comprobaciones

```bash
npm test    # 61 pruebas
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

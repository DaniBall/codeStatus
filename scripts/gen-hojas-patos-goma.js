/**
 * Genera las hojas para que ChatGPT dibuje los 85 patos de goma de 9 en 9:
 *
 *   docs/hojas-patos-goma.json  lo que lee el modelo: 10 hojas de 3x3, cada
 *                               celda con su código y su escena
 *   docs/hojas-patos-goma.md    la instrucción que se pega, paso a paso
 *
 * De 9 en 9 porque las guías coinciden en que, por encima de ese número por
 * petición, el modelo empieza a mezclar escenas y a cambiar el pato entre
 * celdas. Y en cuadrícula fija porque luego scripts/recortar-hojas.js corta
 * cada hoja por posición: la celda 1 es arriba a la izquierda, la 9 abajo a la
 * derecha, siempre.
 *
 * Se generan, no se escriben a mano. Si cambian las escenas, se relanza.
 */
const fs = require('fs')
const path = require('path')

const RAIZ = path.join(__dirname, '..')
const duck = require(`${RAIZ}/src/data/duckScenes.json`)
const catalogo = require(`${RAIZ}/src/status_codes.json`)

const POR_HOJA = 9
const CARTELES = { 403: 'NO ENTRY', 503: 'CLOSED', 509: 'SORRY' }

/** El pato de todas las hojas. Si cambia, cambia aquí y en ningún otro sitio. */
const PATO =
    'a classic glossy yellow rubber bath duck toy with an orange beak and small black ' +
    'painted eyes, the same toy in every image'

const ESTILO =
    'Studio product photography of toys, soft natural light, shallow depth of field, ' +
    'realistic miniature props and sets at rubber-duck scale, colourful and playful'

/**
 * La escena de duckScenes.json, pasada a pato de goma.
 *
 * Las escenas se escribieron para un ánade real, y casi todas valen tal cual:
 * un pato de goma colocado en el sitio cuenta el mismo chiste. Sólo se cambia
 * "a duck" / "ducks" por el juguete, para que el modelo no meta un pato vivo.
 */
function escenaDeGoma(texto) {
    return texto
        .replace(/\bducklings\b/gi, 'tiny rubber ducklings')
        .replace(/\bducks\b/gi, 'rubber ducks')
        .replace(/\bduck\b/gi, 'rubber duck')
        .replace(/rubber rubber/gi, 'rubber')
}

const codigos = catalogo.flatMap(cat => cat.codes.map(i => ({ ...i, familia: cat.category })))

const hojas = []
for (let i = 0; i < codigos.length; i += POR_HOJA) {
    const tanda = codigos.slice(i, i + POR_HOJA)
    hojas.push({
        hoja: hojas.length + 1,
        celdas: tanda.map((item, n) => ({
            celda: n + 1,
            fila: Math.floor(n / 3) + 1,
            columna: (n % 3) + 1,
            codigo: item.code,
            nombre: item.name,
            escena: escenaDeGoma(duck.scenes[String(item.code)]),
            ...(CARTELES[item.code] ? { cartel: CARTELES[item.code] } : {}),
        })),
    })
}

const json = {
    proyecto: 'codeStatus',
    descripcion:
        'Una imagen por cada código de estado HTTP, protagonizada por un pato de goma. ' +
        'Cada imagen tiene que hacer entender de un vistazo qué significa su código, y hacer gracia.',
    pato: PATO,
    estilo: ESTILO,
    formatoDeHoja: {
        lienzo: 'cuadrado 1:1, el tamaño más grande que permitas',
        cuadricula: '3 columnas x 3 filas, 9 celdas exactamente iguales',
        orden: 'celda 1 arriba a la izquierda, se sigue por filas, celda 9 abajo a la derecha',
        separacion: 'una franja lisa de fondo blanco entre celdas, sin líneas ni marcos dibujados',
        celdasVacias: 'si una hoja trae menos de 9, las celdas sobrantes van en blanco liso',
        archivo: 'JPEG',
    },
    reglas: [
        'Cada celda es una imagen cuadrada independiente, con su propia escena completa dentro.',
        'Nada se sale de su celda ni invade la de al lado.',
        'El pato de goma es siempre el mismo juguete: mismo amarillo, mismo pico, mismos ojos.',
        'Es un juguete: no tiene alas que se muevan ni manos. Se cuenta el chiste con dónde está colocado y con los objetos de alrededor.',
        'Sin números, sin códigos, sin texto ni rótulos. La única excepción son los carteles que trae el campo "cartel".',
        'Sin marcas de agua.',
        'Tiene que entenderse en miniatura: la web enseña cada imagen a 300px de lado.',
    ],
    hojas,
}

fs.writeFileSync(`${RAIZ}/docs/hojas-patos-goma.json`, JSON.stringify(json, null, 2) + '\n')

/* ---------- la instrucción ---------- */

const tabla = hojas
    .map(h => `| ${h.hoja} | ${h.celdas.map(c => c.codigo).join(', ')} |`)
    .join('\n')

const md = `# Patos de goma con ChatGPT, por hojas

Las 85 imágenes en **10 hojas de 3×3**. ChatGPT dibuja nueve por hoja y luego
\`scripts/recortar-hojas.js\` corta cada hoja en sus nueve imágenes, con el nombre
de fichero correcto.

> **No se edita a mano.** Se genera con \`node scripts/gen-hojas-patos-goma.js\`.

## Por qué así

- **Nueve por petición, no más.** Por encima, el modelo empieza a mezclar
  escenas entre celdas y a cambiar el pato de una a otra.
- **Una referencia primero.** Antes de las hojas se genera un solo pato y se
  aprueba. Luego se le pide que todas las hojas usen *ese* pato. Es lo que
  mantiene el mismo juguete en las 85.
- **Fondo blanco entre celdas y sin líneas.** El recorte va por posición; una
  franja lisa deja margen para que un pato desplazado unos píxeles no salga
  cortado.

## Paso 1 · El pato de referencia

Abre una conversación nueva, sube \`hojas-patos-goma.json\` y pega:

\`\`\`text
Te he subido un JSON para una web que explica los códigos de estado HTTP con
patos de goma. Antes de las hojas necesito el pato de referencia.

Genera una sola imagen cuadrada: el pato descrito en "pato", solo, de perfil
tres cuartos, sobre fondo blanco liso, con el estilo de "estilo". Nada más en
la imagen.

Ese será el pato de las 85 imágenes, así que tómate tu tiempo.
\`\`\`

Si no te convence, pídele otro hasta que sí. **Ese es el ejemplo** que fija el
aspecto de todos los demás; si cambias de idea más tarde, toca rehacer las
hojas.

## Paso 2 · Las hojas

En la **misma conversación**, para que conserve el pato:

\`\`\`text
Perfecto, ese es el pato. Ahora la hoja 1 del JSON.

- Una imagen cuadrada, en JPEG, con una cuadrícula de 3x3: 9 celdas exactamente
  iguales, separadas por una franja de fondo blanco liso. Sin líneas, sin
  marcos, sin números ni texto.
- La celda 1 arriba a la izquierda y se sigue por filas hasta la 9 abajo a la
  derecha, en el orden del JSON.
- En cada celda, la escena de esa celda, protagonizada por el pato de
  referencia. El mismo juguete en las nueve.
- Respeta "formatoDeHoja" y "reglas".

Cuando la tengas, dime qué código va en cada celda para comprobarlo.
\`\`\`

Y para las siguientes basta con:

\`\`\`text
Hoja 2, con las mismas reglas y el mismo pato.
\`\`\`

Cada 3 o 4 hojas el pato empieza a cambiar de tono o de forma. Si lo ves,
vuelve a subirle la imagen de referencia del paso 1 y dile «este es el pato».

## Paso 3 · Pasármelas

Guarda cada hoja como \`hoja-01.jpg\`, \`hoja-02.jpg\`… y pásamelas. Las corto,
compruebo cada imagen (cuadrada, JPEG, nada cortado) y las subo.

Si quieres cortarlas tú:

\`\`\`bash
node scripts/recortar-hojas.js 1 ruta/a/hoja-01.jpg
\`\`\`

## Qué va en cada hoja

| Hoja | Códigos, celda 1 → 9 |
| --- | --- |
${tabla}

La hoja 10 sólo usa las cuatro primeras celdas; las otras cinco van en blanco.

## Ideas de las que sale el método

- [Rosebud: cómo hacer una sprite sheet con IA](https://lab.rosebud.ai/blog/how-to-create-a-sprite-sheet-with-ai)
- [Indie Hackers: una hoja completa a partir de una referencia](https://www.indiehackers.com/post/gpt-image-2-5-a-full-sprite-sheet-from-one-reference-110562d19f)
- [Plantilla de cuadrícula 4x4 con celdas idénticas](https://youmind.com/zh-CN/prompts/2d-animation-sprite-sheet-generator-34141)
`

fs.writeFileSync(`${RAIZ}/docs/hojas-patos-goma.md`, md)

console.log('hojas:', hojas.length, '| celdas:', hojas.reduce((t, h) => t + h.celdas.length, 0))

/**
 * Genera los dos ficheros que se le pasan a ChatGPT para hacer las fotos:
 *
 *   docs/prompts-chatgpt.json  el que lee el modelo: los 85 prompts ya montados
 *   docs/prompts-chatgpt.md    la instrucción que pega el humano, más los
 *                              prompts sueltos por si hay que rehacer uno
 *
 * Se generan, no se escriben a mano: 85 escenas copiadas una a una son una
 * errata esperando a pasar, y así no se quedan viejos cuando cambie
 * duckScenes.json. Se vuelve a lanzar y ya está.
 */
const fs = require('fs')
const path = require('path')

const RAIZ = path.join(__dirname, '..')
const duck = require(`${RAIZ}/src/data/duckScenes.json`)
const catalogo = require(`${RAIZ}/src/status_codes.json`)

// Las únicas tres imágenes que llevan texto legible. El resto, ninguno.
const CARTELES = { 403: 'NO ENTRY', 503: 'CLOSED', 509: 'SORRY' }

/**
 * El prompt de una imagen.
 *
 * Lo cuadrado va delante y repetido: es lo que más se tuerce, y un modelo de
 * imagen pesa más lo que lee al principio. Lo demás no repite lo que ya dice
 * el `style` ("wildlife photograph", "natural anatomy").
 */
function promptDe(code, scene) {
    const cartel = CARTELES[code]
    const texto = cartel
        ? `The only readable text anywhere in the image is a sign reading "${cartel}"`
        : 'No text, no lettering, no numbers, no watermark'

    return [
        'Square 1:1 image, 1024x1024',
        scene,
        duck.style,
        'real photograph, not an illustration',
        'the duck never grips or holds anything with hand-like limbs',
        texto,
        'no borders, no collage, no split frames',
        'square 1:1 aspect ratio',
    ].join('. ') + '.'
}

const imagenes = catalogo.flatMap(categoria =>
    categoria.codes.map(item => ({
        archivo: `${item.code}.jpg`,
        codigo: item.code,
        nombre: item.name,
        familia: categoria.category,
        prompt: promptDe(item.code, duck.scenes[String(item.code)]),
    }))
)

const sinEscena = imagenes.filter(i => !duck.scenes[String(i.codigo)])
if (sinEscena.length) throw new Error(`sin escena: ${sinEscena.map(i => i.codigo)}`)

/* ---------- el JSON que lee el modelo ---------- */

const json = {
    proyecto: 'codeStatus',
    descripcion:
        'Una foto por cada código de estado HTTP, protagonizada por patos. ' +
        'Cada imagen tiene que hacer entender de un vistazo qué significa su ' +
        'código, y tiene que hacer gracia.',
    formato: {
        relacionDeAspecto: '1:1',
        tamano: '1024x1024',
        formatoDeArchivo: 'JPEG',
        nombreDeArchivo: 'el campo "archivo" de cada entrada, tal cual',
        importante:
            'TODAS las imágenes son cuadradas, sin excepción. Si alguna sale ' +
            'apaisada o vertical, se rehace. La web las recorta al cuadrado, ' +
            'así que una apaisada pierde media escena.',
    },
    reglas: [
        'Fotografía real hecha con cámara. Nada de ilustración, cómic, render 3D, pintura ni estilo Pixar.',
        'Ánade real con anatomía correcta: pico, alas y patas palmeadas. Nada de patas de más, alas fundidas, picos torcidos ni dos cabezas.',
        'Los patos no tienen manos: ni dedos, ni un pato agarrando algo como una persona. El objeto está en la escena, no sujeto por el pato.',
        'Un solo pato, salvo que la escena diga expresamente que hay más.',
        'Sin texto, salvo en los tres códigos cuyo prompt lo pide (403, 503 y 509).',
        'Sin marcas de agua, sin bordes, sin collages ni viñetas partidas.',
        'Tiene que entenderse en miniatura: la web las enseña a 300px de lado.',
    ],
    total: imagenes.length,
    imagenes,
}

fs.writeFileSync(
    `${RAIZ}/docs/prompts-chatgpt.json`,
    JSON.stringify(json, null, 2) + '\n'
)

/* ---------- el documento que pega el humano ---------- */

const NOMBRES = {
    '1': '1xx · Informativos',
    '2': '2xx · Correctos',
    '3': '3xx · Redirecciones',
    '4': '4xx · Errores del cliente',
    '5': '5xx · Errores del servidor',
    wild: 'En la práctica · no oficiales',
}

let md = `# Generar las imágenes con ChatGPT

Dos ficheros y ya:

1. **Sube [\`prompts-chatgpt.json\`](prompts-chatgpt.json)** a la conversación.
   Lleva los 85 prompts ya montados, el formato y las reglas.
2. **Pega la instrucción** de aquí abajo.
3. Ve pidiéndole tandas. Guarda cada imagen en \`public/ducks/\` con el nombre
   que dice el propio JSON (\`404.jpg\`, \`500.jpg\`…).

> **No se editan a mano.** Los dos ficheros se generan desde
> \`src/data/duckScenes.json\` con \`node scripts/gen-prompts-chatgpt.js\`.

---

## La instrucción

\`\`\`text
Te he subido un JSON con 85 fotografías que necesito generar para una web que
explica los códigos de estado HTTP con patos.

Cómo está montado:
- "formato" dice cómo tiene que salir cada imagen.
- "reglas" son las que valen para todas.
- "imagenes" es la lista: cada entrada trae el prompt ya escrito y el nombre de
  fichero con el que tengo que guardarla.

Lo que necesito:
- Genera las imágenes en el orden del JSON, usando el campo "prompt" tal cual.
- TODAS cuadradas, 1:1, 1024x1024. Sin excepción: si una sale apaisada o
  vertical, rehazla antes de enseñármela.
- Entrégamelas en JPEG, y dime con qué nombre guardo cada una (campo "archivo").
- Ve de cinco en cinco y espera a que te diga que siga. Son 85, no intentes
  hacerlas todas de golpe.
- Si una te sale con el pato deforme, con dedos o con texto que no tocaba,
  rehazla tú antes de pasar a la siguiente. No me la enseñes rota.

Empieza por las cinco primeras.
\`\`\`

---

## Qué revisar antes de guardar

| Fallo | Qué hacer |
| --- | --- |
| No es cuadrada | Pídele que la rehaga en 1:1. Es el que más se repite |
| El pato tiene dedos o manos | Rehacer. El objeto va *en la escena*, no sujeto |
| Sale texto donde no toca | Rehacer. Sólo el 403, el 503 y el 509 llevan cartel |
| Patas de más, dos cabezas, alas fundidas | Rehacer |
| No se entiende el chiste en miniatura | Rehacer: la web las enseña a 300px |

En hilos largos el modelo se contagia de lo anterior y empieza a repetir
encuadres y colores. Si lo notas, abre conversación nueva, vuelve a subir el
JSON y dile por qué código va.

## Al terminar

\`\`\`bash
npm test
\`\`\`

Hay una prueba que recorre \`public/ducks/\` y comprueba que cada fichero sea un
JPEG de verdad y que su nombre corresponda a un código real. Si se ha colado un
PNG con el nombre cambiado, ahí salta.

---

## Apéndice: los prompts sueltos

Por si hay que rehacer uno concreto sin volver a subir el JSON entero.

`

for (const categoria of catalogo) {
    md += `\n### ${NOMBRES[categoria.family]}\n`
    for (const item of categoria.codes) {
        const entrada = imagenes.find(i => i.codigo === item.code)
        md += `\n**${item.code} · ${item.name}** → \`public/ducks/${entrada.archivo}\`\n\n`
        md += '```text\n' + entrada.prompt + '\n```\n'
    }
}

fs.writeFileSync(`${RAIZ}/docs/prompts-chatgpt.md`, md)

console.log('imágenes:', imagenes.length)
console.log('con cartel:', Object.keys(CARTELES).join(', '))
console.log('json:', (fs.statSync(`${RAIZ}/docs/prompts-chatgpt.json`).size / 1024).toFixed(1) + ' KB')

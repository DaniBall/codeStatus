/**
 * Genera docs/prompts-chatgpt.md a partir de los datos del repo.
 *
 * Se genera, no se escribe a mano: 85 escenas copiadas una a una es una errata
 * esperando a pasar, y además así el fichero no se queda viejo cuando cambie
 * duckScenes.json. Se vuelve a lanzar y ya está.
 */
const fs = require('fs')

const RAIZ = require('path').join(__dirname, '..')
const duck = require(`${RAIZ}/src/data/duckScenes.json`)
const catalogo = require(`${RAIZ}/src/status_codes.json`)

// Las únicas tres imágenes que llevan texto legible. El resto, ninguno.
const CARTELES = { 403: 'NO ENTRY', 503: 'CLOSED', 509: 'SORRY' }

// Sin repetir lo que ya dice el style: ahí van "wildlife photograph" y
// "natural anatomy". Aquí sólo lo que el style no cubre.
const BASE =
    'Real photograph, not an illustration. Square 1:1 framing. ' +
    'The duck never grips or holds anything with hand-like limbs.'

function coletilla(code) {
    const cartel = CARTELES[code]
    return cartel
        ? `${BASE} The only readable text in the image is the sign reading "${cartel}". No watermark, no border.`
        : `${BASE} No text, no lettering, no watermark, no border.`
}

const promptDe = (code, scene) => `${scene}. ${duck.style}. ${coletilla(code)}`

const CABECERA = `# Prompts para generar las imágenes con ChatGPT

Los 85 prompts, uno por código, listos para copiar y pegar. Cada uno es
**independiente**: lleva dentro el estilo y las reglas, así que funciona aunque
lo pegues en una conversación recién abierta.

> **No se edita a mano.** Se genera desde \`src/data/duckScenes.json\` con
> \`node scripts/gen-prompts-chatgpt.js\`. Si cambian las escenas, se vuelve a
> lanzar.

## Cómo va

1. Abre ChatGPT y pega el **mensaje inicial** de aquí abajo. Sirve para que
   coja el tono una vez y no haya que repetirlo entero cada vez.
2. Pega un prompt. Sale una imagen.
3. Descárgala y guárdala como \`public/ducks/<código>.jpg\`. El nombre de fichero
   va en el encabezado de cada prompt, no hay que pensarlo.
4. Si sale fea o no se entiende el chiste, pídele otra («otra versión, más
   claro que X») antes de pasar al siguiente.

### Lo que más se tuerce

**ChatGPT entrega PNG.** El repositorio espera JPEG de verdad: hay una prueba
que mira los bytes de cabecera, así que **renombrar el \`.png\` a \`.jpg\` no
cuela**. Hay que convertir el fichero. En Windows, abrir con Paint y
«Guardar como → JPEG» vale.

**Cuadrada.** Si te la da apaisada, pídele «square, 1:1». La web recorta al
cuadrado y si no, se pierde media escena.

**Cada 8 o 10 imágenes, conversación nueva.** En hilos largos el modelo se
contagia de lo anterior y empieza a repetir encuadres y colores. Como cada
prompt es independiente, abrir un chat nuevo no cuesta nada.

**Patos con manos.** Si aparece algo parecido a dedos o a un pato agarrando
cosas como una persona, descártala. Las escenas están escritas para que el
objeto esté *en la escena*, no sujeto por el pato.

---

## Mensaje inicial

\`\`\`text
Vamos a generar una serie de fotografías para una web que explica los códigos
de estado HTTP con patos. Te iré pasando una escena cada vez.

Reglas para todas:
- Fotografía de naturaleza real, hecha con cámara. Nada de ilustración, cómic,
  render 3D, pintura ni estilo Pixar.
- Un ánade real, con anatomía correcta: pico, alas y patas palmeadas. Nada de
  patas de más, alas fundidas ni dos cabezas.
- Los patos no tienen manos. Nunca dedos ni un pato agarrando algo como una
  persona: el objeto está en la escena, no sujeto por el pato.
- Un solo pato, salvo que la escena diga que hay más.
- Formato cuadrado 1:1.
- Sin texto, sin marcas de agua, sin bordes ni collages. Sólo hay tres escenas
  con un cartel legible, y cuando toque te lo diré en el propio prompt.
- Tiene que entenderse de un vistazo y hacer gracia, incluso en miniatura.

Responde sólo "listo" y te paso la primera.
\`\`\`

---
`

const NOMBRES = {
    '1': '1xx · Informativos',
    '2': '2xx · Correctos',
    '3': '3xx · Redirecciones',
    '4': '4xx · Errores del cliente',
    '5': '5xx · Errores del servidor',
    wild: 'En la práctica · no oficiales',
}

let salida = CABECERA
let total = 0

for (const categoria of catalogo) {
    salida += `\n## ${NOMBRES[categoria.family]}\n`
    for (const item of categoria.codes) {
        const scene = duck.scenes[String(item.code)]
        if (!scene) throw new Error(`sin escena: ${item.code}`)
        salida += `\n### ${item.code} · ${item.name}\n\n`
        salida += `Guardar como \`public/ducks/${item.code}.jpg\`\n\n`
        salida += '```text\n' + promptDe(item.code, scene) + '\n```\n'
        total++
    }
}

salida += `\n---\n\n## Cuando estén las 85\n
\`\`\`bash
npm test
\`\`\`

Hay una prueba que recorre \`public/ducks/\` y comprueba que cada fichero sea un
JPEG de verdad y que su nombre corresponda a un código real. Si has colado un
PNG renombrado, ahí salta.
`

fs.writeFileSync(`${RAIZ}/docs/prompts-chatgpt.md`, salida)
console.log('prompts escritos:', total)
console.log('con cartel:', Object.keys(CARTELES).join(', '))

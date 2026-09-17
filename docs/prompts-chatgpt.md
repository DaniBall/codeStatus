# Prompts para generar las imágenes con ChatGPT

Los 85 prompts, uno por código, listos para copiar y pegar. Cada uno es
**independiente**: lleva dentro el estilo y las reglas, así que funciona aunque
lo pegues en una conversación recién abierta.

> **No se edita a mano.** Se genera desde `src/data/duckScenes.json` con
> `node scripts/gen-prompts-chatgpt.js`. Si cambian las escenas, se vuelve a
> lanzar.

## Cómo va

1. Abre ChatGPT y pega el **mensaje inicial** de aquí abajo. Sirve para que
   coja el tono una vez y no haya que repetirlo entero cada vez.
2. Pega un prompt. Sale una imagen.
3. Descárgala y guárdala como `public/ducks/<código>.jpg`. El nombre de fichero
   va en el encabezado de cada prompt, no hay que pensarlo.
4. Si sale fea o no se entiende el chiste, pídele otra («otra versión, más
   claro que X») antes de pasar al siguiente.

### Lo que más se tuerce

**ChatGPT entrega PNG.** El repositorio espera JPEG de verdad: hay una prueba
que mira los bytes de cabecera, así que **renombrar el `.png` a `.jpg` no
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

```text
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
```

---

## 1xx · Informativos

### 100 · Continue

Guardar como `public/ducks/100.jpg`

```text
a mallard duck crouched in a sprinter starting block on a red running track, muscles tensed the instant before the gun, empty lanes stretching ahead in low morning sun. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 101 · Switching Protocols

Guardar como `public/ducks/101.jpg`

```text
a duck in an open changing-room doorway mid-change, a hanging business suit on one side of the frame and a wetsuit with flippers on the other. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 102 · Processing

Guardar como `public/ducks/102.jpg`

```text
a duck lit blue by a laptop screen at three in the morning, an endless spinning loading wheel on it, a ring of cold coffee cups across the cluttered desk. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 103 · Early Hints

Guardar como `public/ducks/103.jpg`

```text
a duck peering through a gap in heavy red theatre curtains before the show, the seats beyond still dark and empty, warm stage light across its face. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

## 2xx · Correctos

### 200 · OK

Guardar como `public/ducks/200.jpg`

```text
a duck in mirrored sunglasses floating on a pink inflatable ring in a sunlit pool, one wing raised in a confident thumbs-up, a cocktail glass drifting beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 201 · Created

Guardar como `public/ducks/201.jpg`

```text
a mother duck in a nest of soft down beside a newly hatched duckling, still wet, broken eggshell in the foreground, morning light coming through the reeds. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 202 · Accepted

Guardar como `public/ducks/202.jpg`

```text
a duck behind a grey government counter under flat fluorescent light, a freshly stamped form on the desk, an endless queue of ducks blurred into the distance behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 203 · Non-Authoritative Information

Guardar como `public/ducks/203.jpg`

```text
a duck whispering from behind an open newspaper on a park bench, eyes darting sideways, autumn leaves on the ground, second-hand gossip going somewhere it should not. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 204 · No Content

Guardar como `public/ducks/204.jpg`

```text
a single duck standing in the exact centre of a completely empty white gallery room, bare walls, polished concrete floor, absolutely nothing else in the frame. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 205 · Reset Content

Guardar como `public/ducks/205.jpg`

```text
a duck standing squarely on an enormous red reset button set into a control panel, loose papers still fluttering down around it in the aftermath. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 206 · Partial Content

Guardar como `public/ducks/206.jpg`

```text
a duck upended in a still pond with only its tail and orange webbed feet above the waterline, the rest hidden underwater, ripples spreading outward. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 207 · Multi-Status

Guardar como `public/ducks/207.jpg`

```text
five rubber ducks lined up on a bathroom shelf, each with a completely different painted expression from delighted to appalled, soft window light on the tiles. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 208 · Already Reported

Guardar como `public/ducks/208.jpg`

```text
a duck with one wing over its face in weary resignation while another duck beside it retells the very same story again, both perched on a garden wall. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 226 · IM Used

Guardar como `public/ducks/226.jpg`

```text
a duck vacuum-sealed inside a transparent compression bag on a bedroom floor, comically flattened but perfectly calm and dignified, folded clothes stacked beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

## 3xx · Redirecciones

### 300 · Multiple Choices

Guardar como `public/ducks/300.jpg`

```text
a duck standing at a muddy crossroads where five weathered signposts point in five different directions, not one of them legible, heavy overcast sky. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 301 · Moved Permanently

Guardar como `public/ducks/301.jpg`

```text
a duck family walking away down a dirt path from a cracked dry pond, stacked cardboard moving boxes left behind them, long late-afternoon shadows. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 302 · Found

Guardar como `public/ducks/302.jpg`

```text
a duck sitting in a small blue plastic paddling pool on a lawn, right beside its own proper pond which sits drained and empty behind it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 303 · See Other

Guardar como `public/ducks/303.jpg`

```text
a duck turned firmly away from the camera, its whole body angled toward a different duck across the water, refusing to be the one you look at. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 304 · Not Modified

Guardar como `public/ducks/304.jpg`

```text
a duck sitting on a nest draped in dust sheets and cobwebs, a thick grey layer of dust on the unbroken eggs, everything exactly as it was left. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 305 · Use Proxy

Guardar como `public/ducks/305.jpg`

```text
a duck wearing an obviously fake plastic nose and glasses disguise, standing in for someone else at a wooden lectern, unconvincing and entirely unbothered. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 306 · Unused

Guardar como `public/ducks/306.jpg`

```text
a single dusty rubber duck alone inside a glass museum case, velvet rope in front and a small brass plaque below, the room silent and empty. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 307 · Temporary Redirect

Guardar como `public/ducks/307.jpg`

```text
a duck in a hi-vis vest beside one orange traffic cone that diverts a muddy path around a puddle, temporary and slightly absurd. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 308 · Permanent Redirect

Guardar como `public/ducks/308.jpg`

```text
a duck in a hard hat beside a metal detour arrow set into fresh wet concrete, the old path behind it filled in for good. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

## 4xx · Errores del cliente

### 400 · Bad Request

Guardar como `public/ducks/400.jpg`

```text
a duck leaning out of a car window quacking incomprehensible nonsense into a drive-through speaker, the cashier duck inside staring back completely baffled. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 401 · Unauthorized

Guardar como `public/ducks/401.jpg`

```text
a heavy-set bouncer duck in a black bomber jacket blocking a velvet rope at night, a small duck in front with no wristband, neon reflections on wet pavement. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 402 · Payment Required

Guardar como `public/ducks/402.jpg`

```text
a duck at a shop counter beside an empty open wallet, a single moth caught in mid-flight above it, the card machine glowing red behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 403 · Forbidden

Guardar como `public/ducks/403.jpg`

```text
a stern security duck in mirrored sunglasses in front of a padlocked chain-link gate, wings crossed, a bolted NO ENTRY sign on the fence behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. The only readable text in the image is the sign reading "NO ENTRY". No watermark, no border.
```

### 404 · Not Found

Guardar como `public/ducks/404.jpg`

```text
a duck staring into a completely empty nest at night, lit only by a narrow torch beam from off-frame, dark woods behind, nothing there at all. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 405 · Method Not Allowed

Guardar como `public/ducks/405.jpg`

```text
a duck at a table with a steaming bowl of soup and only a fork beside it, a referee whistle lying on the tablecloth, entirely the wrong tool. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 406 · Not Acceptable

Guardar como `public/ducks/406.jpg`

```text
a duck in a monocle grimacing at a plate of food pushed firmly aside, starched white tablecloth, a sweating waiter duck blurred in the background. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 407 · Proxy Authentication Required

Guardar como `public/ducks/407.jpg`

```text
a duck in a wooden tollbooth on a narrow bridge with the barrier still down, waiting for a badge that has not appeared, mist over the water below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 408 · Request Timeout

Guardar como `public/ducks/408.jpg`

```text
a duck asleep face-down at a restaurant table with cobwebs strung between its beak and the untouched cutlery, the waiter never came. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 409 · Conflict

Guardar como `public/ducks/409.jpg`

```text
two ducks in a violent tug-of-war over the same slice of bread on a pond bank, feathers exploding into the air between them, water flying. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 410 · Gone

Guardar como `public/ducks/410.jpg`

```text
a lone duck standing in a cracked dry pond bed at sunset, one feather beside it and a small weathered headstone, dust hanging in the light. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 411 · Length Required

Guardar como `public/ducks/411.jpg`

```text
a duck beside a measuring tape stretched taut across a doorway, nothing getting through until it has been measured first. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 412 · Precondition Failed

Guardar como `public/ducks/412.jpg`

```text
a small duck on tiptoes against a fairground height requirement sign and still hopelessly short, the ride operator duck shaking its head behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 413 · Content Too Large

Guardar como `public/ducks/413.jpg`

```text
a tiny duckling buckling under an enormous watermelon balanced on its back, legs splayed and eyes wide with regret, on a sunlit picnic lawn. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 414 · URI Too Long

Guardar como `public/ducks/414.jpg`

```text
a duck standing on an endless paper receipt that unrolls out of shot across a shop floor, down the steps and around the corner. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 415 · Unsupported Media Type

Guardar como `public/ducks/415.jpg`

```text
a duck staring at a chrome toaster with a floppy disk jammed halfway into the slot, a thin wisp of smoke rising from it, kitchen counter. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 416 · Range Not Satisfiable

Guardar como `public/ducks/416.jpg`

```text
a duck stretched off the very edge of a picnic table, straining toward a slice of bread that is far beyond any possible reach. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 417 · Expectation Failed

Guardar como `public/ducks/417.jpg`

```text
a duck in a paper party hat staring at a birthday cake collapsed into a puddle of frosting, one candle still bravely alight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 418 · I'm a teapot

Guardar como `public/ducks/418.jpg`

```text
a duck with a porcelain teapot balanced on its head and real steam pouring from the spout, a cup of coffee pushed firmly away across the table. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 421 · Misdirected Request

Guardar como `public/ducks/421.jpg`

```text
a postal worker duck beside a parcel left at entirely the wrong pond, the resident duck staring at it with visible irritation. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 422 · Unprocessable Content

Guardar como `public/ducks/422.jpg`

```text
a duck surrounded by unidentifiable flat-pack furniture parts on a living room floor, assembly instructions in an alien alphabet spread out beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 423 · Locked

Guardar como `public/ducks/423.jpg`

```text
a duck shut out of its own nest by an absurdly large brass padlock, a snapped key on the ground below, cold grey light. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 424 · Failed Dependency

Guardar como `public/ducks/424.jpg`

```text
a duck at the end of a long line of fallen dominoes stretching away across a wooden floor, the very last one still tipping over. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 425 · Too Early

Guardar como `public/ducks/425.jpg`

```text
a duck in a paper party hat alone in a fully decorated empty hall, streamers and balloons everywhere, the wall clock reading six in the morning. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 426 · Upgrade Required

Guardar como `public/ducks/426.jpg`

```text
a duck between an ancient scratched flip phone and a gleaming new smartphone on a shop counter, the choice already made for it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 428 · Precondition Required

Guardar como `public/ducks/428.jpg`

```text
a duck guarding a doorway beside a clipboard with one blank unsigned form on it, nobody getting through until that page is filled in. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 429 · Too Many Requests

Guardar como `public/ducks/429.jpg`

```text
one exhausted duck almost buried under a heaving pile of ducklings all begging for food at once, an empty bread bag on the grass. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 431 · Request Header Fields Too Large

Guardar como `public/ducks/431.jpg`

```text
a duck wearing an absurdly enormous ornate hat ten times its own size, neck bent sideways under the weight, everything else in the frame dwarfed. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 451 · Unavailable For Legal Reasons

Guardar como `public/ducks/451.jpg`

```text
a duck in a courtroom beside a judge gavel and a sealed evidence box stamped in red, dark wood panelling, nothing to be said. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

## 5xx · Errores del servidor

### 500 · Internal Server Error

Guardar como `public/ducks/500.jpg`

```text
a singed duck standing in a smoking server room with sparks raining down from an open rack, feathers slightly alight, red emergency light everywhere. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 501 · Not Implemented

Guardar como `public/ducks/501.jpg`

```text
a duck staring at a completely blank instruction manual open on a workbench, an unfinished machine behind it still under a dust sheet. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 502 · Bad Gateway

Guardar como `public/ducks/502.jpg`

```text
two ducks on opposite rooftops with a snapped string hanging between two tin cans, both still shouting into them, city skyline at dusk. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 503 · Service Unavailable

Guardar como `public/ducks/503.jpg`

```text
a queue of ducks waiting outside a locked gate with a hand-painted CLOSED sign, an empty lifeguard chair beside a drained pond behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. The only readable text in the image is the sign reading "CLOSED". No watermark, no border.
```

### 504 · Gateway Timeout

Guardar como `public/ducks/504.jpg`

```text
a duck waiting at a rural mailbox in a snowstorm, snow piled on its head and shoulders, calendar pages blowing past, nothing ever arriving. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 505 · HTTP Version Not Supported

Guardar como `public/ducks/505.jpg`

```text
a duck staring at a vinyl record resting on an open laptop keyboard, waiting for a sound that is never going to come. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 506 · Variant Also Negotiates

Guardar como `public/ducks/506.jpg`

```text
a duck facing its own reflection between two opposing mirrors, the same duck repeating away into infinity, not one of them able to decide. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 507 · Insufficient Storage

Guardar como `public/ducks/507.jpg`

```text
a duck perched precariously on a nest catastrophically overflowing with far too many eggs, more spilling down the tree and piling on the ground below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 508 · Loop Detected

Guardar como `public/ducks/508.jpg`

```text
a duck chasing its own tail in a perfect circle with heavy motion blur, the pond water beneath it spun into a spiral. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 510 · Not Extended

Guardar como `public/ducks/510.jpg`

```text
a duck at the foot of a stepladder comically too short for the loaf of bread on the very top shelf, deep pantry shadows. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 511 · Network Authentication Required

Guardar como `public/ducks/511.jpg`

```text
a duck at an airport café table glaring at a tablet showing a hostile wifi login portal, cold coffee and a boarding pass beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

## En la práctica · no oficiales

### 419 · Page Expired

Guardar como `public/ducks/419.jpg`

```text
a duck at a theatre door beside a completely faded ticket, the print long gone from it, the usher entirely unmoved. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 420 · Enhance Your Calm

Guardar como `public/ducks/420.jpg`

```text
a duck sitting in a perfect lotus position on a meditation cushion while a phone buzzes furiously beside it, incense smoke curling upward. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 440 · Login Time-out

Guardar como `public/ducks/440.jpg`

```text
a duck locked out of a dark office at night, its access badge dead on the floor, the card reader glowing red beside the door. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 444 · No Response

Guardar como `public/ducks/444.jpg`

```text
a duck turning its back and walking away mid-conversation, the other duck left mid-sentence behind it on a gravel path. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 449 · Retry With

Guardar como `public/ducks/449.jpg`

```text
a duck at a counter with a half-filled form pushed back across it, the clerk duck waiting for the rest, rubber stamp untouched. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 450 · Blocked by Windows Parental Controls

Guardar como `public/ducks/450.jpg`

```text
a duckling straining toward a tablet placed high on a shelf far out of reach, a parent duck standing guard below, living room lamplight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 494 · Request Header Too Large

Guardar como `public/ducks/494.jpg`

```text
a duck wedged immovably in a narrow doorway by an absurdly oversized backpack, legs still pedalling uselessly in the air. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 495 · SSL Certificate Error

Guardar como `public/ducks/495.jpg`

```text
a duck squinting suspiciously at an obviously forged passport lying open on a desk, the photograph in it clearly wrong. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 496 · SSL Certificate Required

Guardar como `public/ducks/496.jpg`

```text
a duck at a border checkpoint with empty wings spread wide and no papers at all, the guard duck thoroughly unimpressed. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 497 · HTTP Request Sent to HTTPS Port

Guardar como `public/ducks/497.jpg`

```text
a duck in swimming trunks and a snorkel at the door of a black-tie gala, the doorman duck visibly horrified. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 499 · Client Closed Request

Guardar como `public/ducks/499.jpg`

```text
an empty chair at a restaurant table with a half-finished glass on it, the duck already gone, its coat still over the chair back. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 509 · Bandwidth Limit Exceeded

Guardar como `public/ducks/509.jpg`

```text
a duck at a buffet counter picked completely clean, empty trays under warming lamps and a small handwritten SORRY sign. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. The only readable text in the image is the sign reading "SORRY". No watermark, no border.
```

### 520 · Web Server Returned an Unknown Error

Guardar como `public/ducks/520.jpg`

```text
a duck shrugging at a control panel covered in unlabelled blinking lights, no idea at all which one is the problem. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 521 · Web Server Is Down

Guardar como `public/ducks/521.jpg`

```text
a duck standing at a boarded-up shop with every light off, shutters down, a faded sign swinging in the wind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 522 · Connection Timed Out

Guardar como `public/ducks/522.jpg`

```text
a duck at one end of a rope bridge that simply stops halfway across a deep canyon, the planks ending in open air, fog below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 523 · Origin Is Unreachable

Guardar como `public/ducks/523.jpg`

```text
a duck at a signpost pointing straight across an open ocean, with no road, no boat and no bridge anywhere in sight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 524 · A Timeout Occurred

Guardar como `public/ducks/524.jpg`

```text
a duck asleep in a waiting room chair beneath a ticket display that has not changed in hours, strip lighting overhead. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 525 · SSL Handshake Failed

Guardar como `public/ducks/525.jpg`

```text
a duck facing a padlock with two keys lying on the ground below it, neither of them anywhere near the right shape. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 526 · Invalid SSL Certificate

Guardar como `public/ducks/526.jpg`

```text
a duck beside an official-looking certificate stamped with an enormous seal drawn in crayon, entirely unconvincing. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 530 · Site Frozen

Guardar como `public/ducks/530.jpg`

```text
a duck frozen solid inside a clear block of ice, its expression completely calm, cold blue light coming through. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 598 · Network Read Timeout Error

Guardar como `public/ducks/598.jpg`

```text
a duck beside an old telephone receiver left off the hook, listening to nothing but silence in an empty room. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

### 599 · Network Connect Timeout Error

Guardar como `public/ducks/599.jpg`

```text
a duck staring at an old rotary phone that never rings, dust settled on the dial, the line long dead. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. Real photograph, not an illustration. Square 1:1 framing. The duck never grips or holds anything with hand-like limbs. No text, no lettering, no watermark, no border.
```

---

## Cuando estén las 85

```bash
npm test
```

Hay una prueba que recorre `public/ducks/` y comprueba que cada fichero sea un
JPEG de verdad y que su nombre corresponda a un código real. Si has colado un
PNG renombrado, ahí salta.

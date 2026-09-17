# Generar las imágenes con ChatGPT

Dos ficheros y ya:

1. **Sube [`prompts-chatgpt.json`](prompts-chatgpt.json)** a la conversación.
   Lleva los 85 prompts ya montados, el formato y las reglas.
2. **Pega la instrucción** de aquí abajo.
3. Ve pidiéndole tandas. Guarda cada imagen en `public/ducks/` con el nombre
   que dice el propio JSON (`404.jpg`, `500.jpg`…).

> **No se editan a mano.** Los dos ficheros se generan desde
> `src/data/duckScenes.json` con `node scripts/gen-prompts-chatgpt.js`.

---

## La instrucción

```text
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
```

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

```bash
npm test
```

Hay una prueba que recorre `public/ducks/` y comprueba que cada fichero sea un
JPEG de verdad y que su nombre corresponda a un código real. Si se ha colado un
PNG con el nombre cambiado, ahí salta.

---

## Apéndice: los prompts sueltos

Por si hay que rehacer uno concreto sin volver a subir el JSON entero.


### 1xx · Informativos

**100 · Continue** → `public/ducks/100.jpg`

```text
Square 1:1 image, 1024x1024. a mallard duck crouched in a sprinter starting block on a red running track, muscles tensed the instant before the gun, empty lanes stretching ahead in low morning sun. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**101 · Switching Protocols** → `public/ducks/101.jpg`

```text
Square 1:1 image, 1024x1024. a duck in an open changing-room doorway mid-change, a hanging business suit on one side of the frame and a wetsuit with flippers on the other. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**102 · Processing** → `public/ducks/102.jpg`

```text
Square 1:1 image, 1024x1024. a duck lit blue by a laptop screen at three in the morning, an endless spinning loading wheel on it, a ring of cold coffee cups across the cluttered desk. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**103 · Early Hints** → `public/ducks/103.jpg`

```text
Square 1:1 image, 1024x1024. a duck peering through a gap in heavy red theatre curtains before the show, the seats beyond still dark and empty, warm stage light across its face. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

### 2xx · Correctos

**200 · OK** → `public/ducks/200.jpg`

```text
Square 1:1 image, 1024x1024. a duck in mirrored sunglasses floating on a pink inflatable ring in a sunlit pool, one wing raised in a confident thumbs-up, a cocktail glass drifting beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**201 · Created** → `public/ducks/201.jpg`

```text
Square 1:1 image, 1024x1024. a mother duck in a nest of soft down beside a newly hatched duckling, still wet, broken eggshell in the foreground, morning light coming through the reeds. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**202 · Accepted** → `public/ducks/202.jpg`

```text
Square 1:1 image, 1024x1024. a duck behind a grey government counter under flat fluorescent light, a freshly stamped form on the desk, an endless queue of ducks blurred into the distance behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**203 · Non-Authoritative Information** → `public/ducks/203.jpg`

```text
Square 1:1 image, 1024x1024. a duck whispering from behind an open newspaper on a park bench, eyes darting sideways, autumn leaves on the ground, second-hand gossip going somewhere it should not. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**204 · No Content** → `public/ducks/204.jpg`

```text
Square 1:1 image, 1024x1024. a single duck standing in the exact centre of a completely empty white gallery room, bare walls, polished concrete floor, absolutely nothing else in the frame. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**205 · Reset Content** → `public/ducks/205.jpg`

```text
Square 1:1 image, 1024x1024. a duck standing squarely on an enormous red reset button set into a control panel, loose papers still fluttering down around it in the aftermath. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**206 · Partial Content** → `public/ducks/206.jpg`

```text
Square 1:1 image, 1024x1024. a duck upended in a still pond with only its tail and orange webbed feet above the waterline, the rest hidden underwater, ripples spreading outward. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**207 · Multi-Status** → `public/ducks/207.jpg`

```text
Square 1:1 image, 1024x1024. five rubber ducks lined up on a bathroom shelf, each with a completely different painted expression from delighted to appalled, soft window light on the tiles. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**208 · Already Reported** → `public/ducks/208.jpg`

```text
Square 1:1 image, 1024x1024. a duck with one wing over its face in weary resignation while another duck beside it retells the very same story again, both perched on a garden wall. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**226 · IM Used** → `public/ducks/226.jpg`

```text
Square 1:1 image, 1024x1024. a duck vacuum-sealed inside a transparent compression bag on a bedroom floor, comically flattened but perfectly calm and dignified, folded clothes stacked beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

### 3xx · Redirecciones

**300 · Multiple Choices** → `public/ducks/300.jpg`

```text
Square 1:1 image, 1024x1024. a duck standing at a muddy crossroads where five weathered signposts point in five different directions, not one of them legible, heavy overcast sky. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**301 · Moved Permanently** → `public/ducks/301.jpg`

```text
Square 1:1 image, 1024x1024. a duck family walking away down a dirt path from a cracked dry pond, stacked cardboard moving boxes left behind them, long late-afternoon shadows. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**302 · Found** → `public/ducks/302.jpg`

```text
Square 1:1 image, 1024x1024. a duck sitting in a small blue plastic paddling pool on a lawn, right beside its own proper pond which sits drained and empty behind it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**303 · See Other** → `public/ducks/303.jpg`

```text
Square 1:1 image, 1024x1024. a duck turned firmly away from the camera, its whole body angled toward a different duck across the water, refusing to be the one you look at. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**304 · Not Modified** → `public/ducks/304.jpg`

```text
Square 1:1 image, 1024x1024. a duck sitting on a nest draped in dust sheets and cobwebs, a thick grey layer of dust on the unbroken eggs, everything exactly as it was left. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**305 · Use Proxy** → `public/ducks/305.jpg`

```text
Square 1:1 image, 1024x1024. a duck wearing an obviously fake plastic nose and glasses disguise, standing in for someone else at a wooden lectern, unconvincing and entirely unbothered. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**306 · Unused** → `public/ducks/306.jpg`

```text
Square 1:1 image, 1024x1024. a single dusty rubber duck alone inside a glass museum case, velvet rope in front and a small brass plaque below, the room silent and empty. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**307 · Temporary Redirect** → `public/ducks/307.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a hi-vis vest beside one orange traffic cone that diverts a muddy path around a puddle, temporary and slightly absurd. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**308 · Permanent Redirect** → `public/ducks/308.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a hard hat beside a metal detour arrow set into fresh wet concrete, the old path behind it filled in for good. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

### 4xx · Errores del cliente

**400 · Bad Request** → `public/ducks/400.jpg`

```text
Square 1:1 image, 1024x1024. a duck leaning out of a car window quacking incomprehensible nonsense into a drive-through speaker, the cashier duck inside staring back completely baffled. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**401 · Unauthorized** → `public/ducks/401.jpg`

```text
Square 1:1 image, 1024x1024. a heavy-set bouncer duck in a black bomber jacket blocking a velvet rope at night, a small duck in front with no wristband, neon reflections on wet pavement. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**402 · Payment Required** → `public/ducks/402.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a shop counter beside an empty open wallet, a single moth caught in mid-flight above it, the card machine glowing red behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**403 · Forbidden** → `public/ducks/403.jpg`

```text
Square 1:1 image, 1024x1024. a stern security duck in mirrored sunglasses in front of a padlocked chain-link gate, wings crossed, a bolted NO ENTRY sign on the fence behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. The only readable text anywhere in the image is a sign reading "NO ENTRY". no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**404 · Not Found** → `public/ducks/404.jpg`

```text
Square 1:1 image, 1024x1024. a duck staring into a completely empty nest at night, lit only by a narrow torch beam from off-frame, dark woods behind, nothing there at all. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**405 · Method Not Allowed** → `public/ducks/405.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a table with a steaming bowl of soup and only a fork beside it, a referee whistle lying on the tablecloth, entirely the wrong tool. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**406 · Not Acceptable** → `public/ducks/406.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a monocle grimacing at a plate of food pushed firmly aside, starched white tablecloth, a sweating waiter duck blurred in the background. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**407 · Proxy Authentication Required** → `public/ducks/407.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a wooden tollbooth on a narrow bridge with the barrier still down, waiting for a badge that has not appeared, mist over the water below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**408 · Request Timeout** → `public/ducks/408.jpg`

```text
Square 1:1 image, 1024x1024. a duck asleep face-down at a restaurant table with cobwebs strung between its beak and the untouched cutlery, the waiter never came. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**409 · Conflict** → `public/ducks/409.jpg`

```text
Square 1:1 image, 1024x1024. two ducks in a violent tug-of-war over the same slice of bread on a pond bank, feathers exploding into the air between them, water flying. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**410 · Gone** → `public/ducks/410.jpg`

```text
Square 1:1 image, 1024x1024. a lone duck standing in a cracked dry pond bed at sunset, one feather beside it and a small weathered headstone, dust hanging in the light. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**411 · Length Required** → `public/ducks/411.jpg`

```text
Square 1:1 image, 1024x1024. a duck beside a measuring tape stretched taut across a doorway, nothing getting through until it has been measured first. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**412 · Precondition Failed** → `public/ducks/412.jpg`

```text
Square 1:1 image, 1024x1024. a small duck on tiptoes against a fairground height requirement sign and still hopelessly short, the ride operator duck shaking its head behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**413 · Content Too Large** → `public/ducks/413.jpg`

```text
Square 1:1 image, 1024x1024. a tiny duckling buckling under an enormous watermelon balanced on its back, legs splayed and eyes wide with regret, on a sunlit picnic lawn. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**414 · URI Too Long** → `public/ducks/414.jpg`

```text
Square 1:1 image, 1024x1024. a duck standing on an endless paper receipt that unrolls out of shot across a shop floor, down the steps and around the corner. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**415 · Unsupported Media Type** → `public/ducks/415.jpg`

```text
Square 1:1 image, 1024x1024. a duck staring at a chrome toaster with a floppy disk jammed halfway into the slot, a thin wisp of smoke rising from it, kitchen counter. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**416 · Range Not Satisfiable** → `public/ducks/416.jpg`

```text
Square 1:1 image, 1024x1024. a duck stretched off the very edge of a picnic table, straining toward a slice of bread that is far beyond any possible reach. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**417 · Expectation Failed** → `public/ducks/417.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a paper party hat staring at a birthday cake collapsed into a puddle of frosting, one candle still bravely alight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**418 · I'm a teapot** → `public/ducks/418.jpg`

```text
Square 1:1 image, 1024x1024. a duck with a porcelain teapot balanced on its head and real steam pouring from the spout, a cup of coffee pushed firmly away across the table. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**421 · Misdirected Request** → `public/ducks/421.jpg`

```text
Square 1:1 image, 1024x1024. a postal worker duck beside a parcel left at entirely the wrong pond, the resident duck staring at it with visible irritation. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**422 · Unprocessable Content** → `public/ducks/422.jpg`

```text
Square 1:1 image, 1024x1024. a duck surrounded by unidentifiable flat-pack furniture parts on a living room floor, assembly instructions in an alien alphabet spread out beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**423 · Locked** → `public/ducks/423.jpg`

```text
Square 1:1 image, 1024x1024. a duck shut out of its own nest by an absurdly large brass padlock, a snapped key on the ground below, cold grey light. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**424 · Failed Dependency** → `public/ducks/424.jpg`

```text
Square 1:1 image, 1024x1024. a duck at the end of a long line of fallen dominoes stretching away across a wooden floor, the very last one still tipping over. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**425 · Too Early** → `public/ducks/425.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a paper party hat alone in a fully decorated empty hall, streamers and balloons everywhere, the wall clock reading six in the morning. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**426 · Upgrade Required** → `public/ducks/426.jpg`

```text
Square 1:1 image, 1024x1024. a duck between an ancient scratched flip phone and a gleaming new smartphone on a shop counter, the choice already made for it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**428 · Precondition Required** → `public/ducks/428.jpg`

```text
Square 1:1 image, 1024x1024. a duck guarding a doorway beside a clipboard with one blank unsigned form on it, nobody getting through until that page is filled in. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**429 · Too Many Requests** → `public/ducks/429.jpg`

```text
Square 1:1 image, 1024x1024. one exhausted duck almost buried under a heaving pile of ducklings all begging for food at once, an empty bread bag on the grass. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**431 · Request Header Fields Too Large** → `public/ducks/431.jpg`

```text
Square 1:1 image, 1024x1024. a duck wearing an absurdly enormous ornate hat ten times its own size, neck bent sideways under the weight, everything else in the frame dwarfed. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**451 · Unavailable For Legal Reasons** → `public/ducks/451.jpg`

```text
Square 1:1 image, 1024x1024. a duck in a courtroom beside a judge gavel and a sealed evidence box stamped in red, dark wood panelling, nothing to be said. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

### 5xx · Errores del servidor

**500 · Internal Server Error** → `public/ducks/500.jpg`

```text
Square 1:1 image, 1024x1024. a singed duck standing in a smoking server room with sparks raining down from an open rack, feathers slightly alight, red emergency light everywhere. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**501 · Not Implemented** → `public/ducks/501.jpg`

```text
Square 1:1 image, 1024x1024. a duck staring at a completely blank instruction manual open on a workbench, an unfinished machine behind it still under a dust sheet. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**502 · Bad Gateway** → `public/ducks/502.jpg`

```text
Square 1:1 image, 1024x1024. two ducks on opposite rooftops with a snapped string hanging between two tin cans, both still shouting into them, city skyline at dusk. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**503 · Service Unavailable** → `public/ducks/503.jpg`

```text
Square 1:1 image, 1024x1024. a queue of ducks waiting outside a locked gate with a hand-painted CLOSED sign, an empty lifeguard chair beside a drained pond behind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. The only readable text anywhere in the image is a sign reading "CLOSED". no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**504 · Gateway Timeout** → `public/ducks/504.jpg`

```text
Square 1:1 image, 1024x1024. a duck waiting at a rural mailbox in a snowstorm, snow piled on its head and shoulders, calendar pages blowing past, nothing ever arriving. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**505 · HTTP Version Not Supported** → `public/ducks/505.jpg`

```text
Square 1:1 image, 1024x1024. a duck staring at a vinyl record resting on an open laptop keyboard, waiting for a sound that is never going to come. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**506 · Variant Also Negotiates** → `public/ducks/506.jpg`

```text
Square 1:1 image, 1024x1024. a duck facing its own reflection between two opposing mirrors, the same duck repeating away into infinity, not one of them able to decide. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**507 · Insufficient Storage** → `public/ducks/507.jpg`

```text
Square 1:1 image, 1024x1024. a duck perched precariously on a nest catastrophically overflowing with far too many eggs, more spilling down the tree and piling on the ground below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**508 · Loop Detected** → `public/ducks/508.jpg`

```text
Square 1:1 image, 1024x1024. a duck chasing its own tail in a perfect circle with heavy motion blur, the pond water beneath it spun into a spiral. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**510 · Not Extended** → `public/ducks/510.jpg`

```text
Square 1:1 image, 1024x1024. a duck at the foot of a stepladder comically too short for the loaf of bread on the very top shelf, deep pantry shadows. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**511 · Network Authentication Required** → `public/ducks/511.jpg`

```text
Square 1:1 image, 1024x1024. a duck at an airport café table glaring at a tablet showing a hostile wifi login portal, cold coffee and a boarding pass beside it. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

### En la práctica · no oficiales

**419 · Page Expired** → `public/ducks/419.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a theatre door beside a completely faded ticket, the print long gone from it, the usher entirely unmoved. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**420 · Enhance Your Calm** → `public/ducks/420.jpg`

```text
Square 1:1 image, 1024x1024. a duck sitting in a perfect lotus position on a meditation cushion while a phone buzzes furiously beside it, incense smoke curling upward. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**440 · Login Time-out** → `public/ducks/440.jpg`

```text
Square 1:1 image, 1024x1024. a duck locked out of a dark office at night, its access badge dead on the floor, the card reader glowing red beside the door. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**444 · No Response** → `public/ducks/444.jpg`

```text
Square 1:1 image, 1024x1024. a duck turning its back and walking away mid-conversation, the other duck left mid-sentence behind it on a gravel path. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**449 · Retry With** → `public/ducks/449.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a counter with a half-filled form pushed back across it, the clerk duck waiting for the rest, rubber stamp untouched. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**450 · Blocked by Windows Parental Controls** → `public/ducks/450.jpg`

```text
Square 1:1 image, 1024x1024. a duckling straining toward a tablet placed high on a shelf far out of reach, a parent duck standing guard below, living room lamplight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**494 · Request Header Too Large** → `public/ducks/494.jpg`

```text
Square 1:1 image, 1024x1024. a duck wedged immovably in a narrow doorway by an absurdly oversized backpack, legs still pedalling uselessly in the air. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**495 · SSL Certificate Error** → `public/ducks/495.jpg`

```text
Square 1:1 image, 1024x1024. a duck squinting suspiciously at an obviously forged passport lying open on a desk, the photograph in it clearly wrong. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**496 · SSL Certificate Required** → `public/ducks/496.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a border checkpoint with empty wings spread wide and no papers at all, the guard duck thoroughly unimpressed. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**497 · HTTP Request Sent to HTTPS Port** → `public/ducks/497.jpg`

```text
Square 1:1 image, 1024x1024. a duck in swimming trunks and a snorkel at the door of a black-tie gala, the doorman duck visibly horrified. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**499 · Client Closed Request** → `public/ducks/499.jpg`

```text
Square 1:1 image, 1024x1024. an empty chair at a restaurant table with a half-finished glass on it, the duck already gone, its coat still over the chair back. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**509 · Bandwidth Limit Exceeded** → `public/ducks/509.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a buffet counter picked completely clean, empty trays under warming lamps and a small handwritten SORRY sign. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. The only readable text anywhere in the image is a sign reading "SORRY". no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**520 · Web Server Returned an Unknown Error** → `public/ducks/520.jpg`

```text
Square 1:1 image, 1024x1024. a duck shrugging at a control panel covered in unlabelled blinking lights, no idea at all which one is the problem. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**521 · Web Server Is Down** → `public/ducks/521.jpg`

```text
Square 1:1 image, 1024x1024. a duck standing at a boarded-up shop with every light off, shutters down, a faded sign swinging in the wind. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**522 · Connection Timed Out** → `public/ducks/522.jpg`

```text
Square 1:1 image, 1024x1024. a duck at one end of a rope bridge that simply stops halfway across a deep canyon, the planks ending in open air, fog below. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**523 · Origin Is Unreachable** → `public/ducks/523.jpg`

```text
Square 1:1 image, 1024x1024. a duck at a signpost pointing straight across an open ocean, with no road, no boat and no bridge anywhere in sight. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**524 · A Timeout Occurred** → `public/ducks/524.jpg`

```text
Square 1:1 image, 1024x1024. a duck asleep in a waiting room chair beneath a ticket display that has not changed in hours, strip lighting overhead. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**525 · SSL Handshake Failed** → `public/ducks/525.jpg`

```text
Square 1:1 image, 1024x1024. a duck facing a padlock with two keys lying on the ground below it, neither of them anywhere near the right shape. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**526 · Invalid SSL Certificate** → `public/ducks/526.jpg`

```text
Square 1:1 image, 1024x1024. a duck beside an official-looking certificate stamped with an enormous seal drawn in crayon, entirely unconvincing. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**530 · Site Frozen** → `public/ducks/530.jpg`

```text
Square 1:1 image, 1024x1024. a duck frozen solid inside a clear block of ice, its expression completely calm, cold blue light coming through. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**598 · Network Read Timeout Error** → `public/ducks/598.jpg`

```text
Square 1:1 image, 1024x1024. a duck beside an old telephone receiver left off the hook, listening to nothing but silence in an empty room. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

**599 · Network Connect Timeout Error** → `public/ducks/599.jpg`

```text
Square 1:1 image, 1024x1024. a duck staring at an old rotary phone that never rings, dust settled on the dial, the line long dead. funny wildlife photograph, real mallard duck, natural anatomy, sharp focus, highly detailed. real photograph, not an illustration. the duck never grips or holds anything with hand-like limbs. No text, no lettering, no numbers, no watermark. no borders, no collage, no split frames. square 1:1 aspect ratio.
```

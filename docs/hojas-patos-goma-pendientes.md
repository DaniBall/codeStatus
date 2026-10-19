# Patos de goma: hojas pendientes (de la 5 a la 10)

Para seguir en una conversación nueva de ChatGPT. Las hojas conservan su número,
así que el recorte es el de siempre: `node scripts/recortar-hojas.js <hoja> <imagen>`.

> **No se edita a mano.** Se genera con `node scripts/gen-hojas-patos-goma.js`.

## Paso 1 · Arrancar con el pato de siempre

Abre una conversación nueva y sube `hojas-patos-goma-pendientes.json` y
**una de las imágenes ya hechas** como referencia del pato (vale
`public/ducks/200.jpg`, o cualquier otra que te guste). Luego pega:

```text
Te he subido un JSON y una imagen ya terminada de esta serie. Es para una web que
explica los códigos de estado HTTP con patos de goma: cada imagen tiene que
hacer entender su código y hacer gracia.

El pato de goma de esa imagen es el protagonista de toda la serie: úsalo tal
cual en todas las imágenes, mismo juguete, mismo amarillo, mismo pico, y el
mismo estilo de foto. Sólo cambian la cara pintada, lo que lleve puesto y la
escena. No copies su escena, sólo el pato y el estilo.

Haz la hoja 5 del JSON:
- Una imagen cuadrada, en JPEG, con una cuadrícula de 3x3: 9 celdas exactamente
  iguales, separadas por una franja de fondo blanco liso. Sin líneas, sin
  marcos, sin números ni texto.
- Celda 1 arriba a la izquierda, por filas, hasta la 9 abajo a la derecha, en
  el orden del JSON.
- MUY IMPORTANTE: en cada celda dibuja exactamente la escena de su campo
  "escena". No inventes escenas genéricas (detective, playa, chef, mago…).
  Si alguien lee la escena del JSON, tiene que reconocerla en la celda.
- Que haga gracia: exagera, ponle la cara que toca y vístelo si ayuda.
- Respeta "formatoDeHoja" y "reglas".

Antes de dibujar, escríbeme en una línea por celda qué vas a poner en cada una.
```

Lo de «escríbeme antes qué vas a poner» es a propósito: si se va a inventar las
escenas, se le ve en la lista y lo corriges antes de que dibuje.

## Paso 2 · Las siguientes

```text
Hoja N, con las mismas reglas y el mismo pato. Primero la lista de escenas, luego la imagen.
```

Si vuelve a salirse del JSON: «Esa hoja no sigue el campo "escena". Repítela.»
Cada 3 hojas, súbele otra vez la imagen de referencia.

## Qué va en cada hoja

| Hoja | Códigos, celda 1 → 9 |
| --- | --- |
| 5 | 413, 414, 415, 416, 417, 418, 421, 422, 423 |
| 6 | 424, 425, 426, 428, 429, 431, 451, 500, 501 |
| 7 | 502, 503, 504, 505, 506, 507, 508, 510, 511 |
| 8 | 419, 420, 440, 444, 449, 450, 494, 495, 496 |
| 9 | 497, 499, 509, 520, 521, 522, 523, 524, 525 |
| 10 | 526, 530, 598, 599 |

La hoja 10 sólo usa las cuatro primeras celdas; las otras cinco van en blanco.

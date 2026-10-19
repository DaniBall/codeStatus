# Patos de goma con ChatGPT, por hojas

Las 85 imágenes en **10 hojas de 3×3**. ChatGPT dibuja nueve por hoja y luego
`scripts/recortar-hojas.js` corta cada hoja en sus nueve imágenes, con el nombre
de fichero correcto.

> **No se edita a mano.** Se genera con `node scripts/gen-hojas-patos-goma.js`.

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

Abre una conversación nueva, sube `hojas-patos-goma.json` y pega:

```text
Te he subido un JSON para una web que explica los códigos de estado HTTP con
patos de goma. Antes de las hojas necesito el pato de referencia.

Genera una sola imagen cuadrada: el pato descrito en "pato", solo, de perfil
tres cuartos, sobre fondo blanco liso, con el estilo de "estilo". Nada más en
la imagen.

Ese será el pato de las 85 imágenes, así que tómate tu tiempo.
```

Si no te convence, pídele otro hasta que sí. **Ese es el ejemplo** que fija el
aspecto de todos los demás; si cambias de idea más tarde, toca rehacer las
hojas.

## Paso 2 · Las hojas

En la **misma conversación**, para que conserve el pato:

```text
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
```

Y para las siguientes basta con:

```text
Hoja 2, con las mismas reglas y el mismo pato.
```

Cada 3 o 4 hojas el pato empieza a cambiar de tono o de forma. Si lo ves,
vuelve a subirle la imagen de referencia del paso 1 y dile «este es el pato».

## Paso 3 · Pasármelas

Guarda cada hoja como `hoja-01.jpg`, `hoja-02.jpg`… y pásamelas. Las corto,
compruebo cada imagen (cuadrada, JPEG, nada cortado) y las subo.

Si quieres cortarlas tú:

```bash
node scripts/recortar-hojas.js 1 ruta/a/hoja-01.jpg
```

## Qué va en cada hoja

| Hoja | Códigos, celda 1 → 9 |
| --- | --- |
| 1 | 100, 101, 102, 103, 200, 201, 202, 203, 204 |
| 2 | 205, 206, 207, 208, 226, 300, 301, 302, 303 |
| 3 | 304, 305, 306, 307, 308, 400, 401, 402, 403 |
| 4 | 404, 405, 406, 407, 408, 409, 410, 411, 412 |
| 5 | 413, 414, 415, 416, 417, 418, 421, 422, 423 |
| 6 | 424, 425, 426, 428, 429, 431, 451, 500, 501 |
| 7 | 502, 503, 504, 505, 506, 507, 508, 510, 511 |
| 8 | 419, 420, 440, 444, 449, 450, 494, 495, 496 |
| 9 | 497, 499, 509, 520, 521, 522, 523, 524, 525 |
| 10 | 526, 530, 598, 599 |

La hoja 10 sólo usa las cuatro primeras celdas; las otras cinco van en blanco.

## Ideas de las que sale el método

- [Rosebud: cómo hacer una sprite sheet con IA](https://lab.rosebud.ai/blog/how-to-create-a-sprite-sheet-with-ai)
- [Indie Hackers: una hoja completa a partir de una referencia](https://www.indiehackers.com/post/gpt-image-2-5-a-full-sprite-sheet-from-one-reference-110562d19f)
- [Plantilla de cuadrícula 4x4 con celdas idénticas](https://youmind.com/zh-CN/prompts/2d-animation-sprite-sheet-generator-34141)

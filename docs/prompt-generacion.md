# Prompt para generar las imágenes con un modelo externo

Este documento es para pegárselo a un generador de imágenes (Gemini, ChatGPT,
Midjourney...) junto con `src/data/duckScenes.json`, cuando no se usa el script
`npm run ducks`.

---

## Instrucción para el modelo

Vas a generar las ilustraciones de **codeStatus**, una web de consulta que
explica cada código de estado HTTP con una foto absurda protagonizada por
patos. Cada imagen tiene que hacer entender de un vistazo qué significa su
código, y tiene que hacer gracia.

Te paso un JSON con dos claves:

- `style`: el estilo común a todas las imágenes.
- `scenes`: un objeto donde **la clave es el código HTTP** y el valor es la
  escena que hay que representar.

El prompt de cada imagen es: **`scene` + ". " + `style`**.

### Reglas que no se negocian

1. **Fotografía, no ilustración.** Tiene que parecer una foto de naturaleza
   real, hecha con cámara. Nada de dibujo, cómic, render 3D, pintura, estilo
   Pixar ni acuarela.

2. **Anatomía de pato real.** Un ánade real: pico, alas y patas palmeadas
   correctas. Rechaza cualquier resultado con patas de más, alas fundidas,
   picos torcidos, dos cabezas o cuerpos mezclados.

3. **Los patos no tienen manos.** Nunca dibujes dedos, manos humanas ni un pato
   agarrando un objeto como si fuera una persona. Las escenas ya están escritas
   para que el objeto esté *en la escena*, no sujeto por el pato: respétalo.

4. **Un solo pato**, salvo que la escena diga expresamente que hay más
   (`two ducks`, `five rubber ducks`, `a queue of ducks`, `ducklings`).

5. **Cuadradas, 1024 × 1024.** La web las recorta en cuadrado.

6. **Sin marcas.** Ni marca de agua, ni logotipo, ni firma, ni marco, ni bordes,
   ni collage de varias viñetas. Una sola imagen limpia.

7. **Sin texto**, salvo un cartel corto que la escena nombre expresamente
   (`NO ENTRY` en el 403, `CLOSED` en el 503, `SORRY` en el 509). Si no vas a
   poder escribirlo legible, deja el cartel en blanco: **letras inventadas o
   deformes son peor que ningún cartel**.

8. **Legible en miniatura.** La web las enseña a unos 200 píxeles. Sujeto
   grande y centrado, fondo despejado, buen contraste entre pato y fondo. Si el
   chiste no se pilla en miniatura, la imagen no sirve.

### Formato de salida

- **JPEG** (no PNG, no WebP).
- Nombre exacto: **`<código>.jpg`** — `404.jpg`, `521.jpg`. Sólo el número.
- Cuadradas, idealmente 1024 × 1024.
- Entre 50 y 200 KB. Son 85 imágenes que van dentro del repositorio.

### Cómo trabajar

No intentes las 85 de una vez. Ve **de cinco en cinco**, enséñamelas y sigo.
Si una sale con la anatomía mal, repítela antes de pasar a la siguiente.

---

## Plantilla por imagen

> Genera una imagen cuadrada de 1024 × 1024 con este prompt:
>
> `<scene>. <style>`
>
> Fotografía realista de naturaleza. Un ánade real con anatomía correcta, sin
> manos ni dedos. Sin texto, sin marca de agua, sin bordes. Sujeto grande y
> centrado sobre fondo despejado.

---

## Al terminar

Deja los ficheros en `public/ducks/` y comprueba que están bien:

```bash
npm test
```

Esa prueba verifica que cada fichero se llame como un código que existe, que
sea un JPEG de verdad —renombrar un PNG a `.jpg` no cuela— y que no esté a
medio descargar.

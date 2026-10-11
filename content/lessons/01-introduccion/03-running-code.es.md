---
title: Cómo ejecutar código en este curso
order: 3
minutes: 6
---

> **Meta:** usar las cajas de código como un profesional: imprimir valores, leer mensajes de error y salir de un bucle infinito.

## La caja de código

Cada caja oscura con un botón **Ejecutar** es un pequeño editor de código:

- **Edita** el código: haz clic dentro y escribe, como en cualquier caja de texto.
- **Ejecútalo**: presiona el botón **Ejecutar**, o **Ctrl + Enter** (**Cmd + Enter** en Mac).
- **Restablécelo**: vuelve al código original si te pierdes.

Todo lo que tu código imprima con `console.log` aparece debajo de la caja.

## Imprimir valores

`console.log` puede imprimir varios valores a la vez. Pone un espacio entre ellos:

```js-run
const language = 'JavaScript'
const year = 1995

console.log('Lenguaje:', language)
console.log(language, 'se creó en', year)
console.log([1, 2, 3], { course: 'DSA' })
```

Vas a usar `console.log` todo el tiempo para revisar qué está haciendo tu código. Cuando algo no funciona, imprimir los valores paso a paso suele ser la forma más rápida de descubrir por qué.

## Leer un mensaje de error

Los errores no son fracasos: son la computadora diciéndote exactamente qué salió mal. Ejecuta este código:

```js-run
function greet(name) {
  return 'Hola, ' + name
}

console.log(greet('Ada'))
console.log(gret('Grace'))
```

Vas a ver dos cosas:

1. `Hola, Ada`: todo lo que está **antes** del error se ejecuta y se imprime igual.
2. Una línea roja: `ReferenceError: gret is not defined`.

Lee los mensajes de error en dos partes. El **tipo** (`ReferenceError`) te dice qué clase de problema es: aquí, usar un nombre que JavaScript no conoce. El **mensaje** (`gret is not defined`, "gret no está definido") te dice qué nombre. ¡Es un error de escritura! Cambia `gret` por `greet` y ejecútalo otra vez.

## Cuando el código nunca termina

Un bucle que nunca termina se llama **bucle infinito**. En una pestaña normal del navegador, congelaría la página. Aquí no puede: si tu código sigue ejecutándose después de **2 segundos**, el curso lo detiene por ti y muestra un mensaje.

Este bucle nunca termina, porque olvidamos aumentar `count`:

```js-run
let count = 0

while (count < 5) {
  // Ups: nunca le sumamos 1 a count, así que count < 5 siempre es verdadero.
}

console.log('¡Listo!')
```

Ejecútalo y espera dos segundos. Luego arréglalo: agrega `count++` dentro del bucle y ejecútalo otra vez. Ahora verás `¡Listo!`.

## Opcional: practicar en Chrome DevTools

Las cajas de código son perfectas para las lecciones. Para sesiones de práctica más largas, también puedes usar el editor de código que trae Google Chrome:

1. Abre Chrome y luego el menú **⋮ → Más herramientas → Herramientas para desarrolladores**.
2. En DevTools, abre **⋮ → Posición** (_Dock side_) y elige **Desacoplar en una ventana separada** para tener una ventana completa.
3. Ve a la pestaña **Sources** (Fuentes) y luego a **Snippets** (abre el navegador con el botón `»` si no lo ves).
4. Haz clic en **+ New snippet**, escribe tu código y ejecútalo con **Ctrl + Enter** (**Cmd + Enter** en Mac).

La salida aparece en la **Console** (consola) de abajo. También puedes llamar a tus funciones directamente desde la consola después de ejecutar el snippet.

## Resumen

- **Ejecutar** = el botón o **Ctrl/Cmd + Enter**. **Restablecer** vuelve al código original.
- `console.log(a, b, c)` imprime varios valores separados por espacios.
- Un mensaje de error = un **tipo** + un **mensaje**. Lo que se imprimió antes del error sigue apareciendo.
- Los bucles infinitos se detienen después de **2 segundos**.

## Compruébalo tú mismo

1. ¿Qué atajo de teclado ejecuta el código?
2. En `ReferenceError: gret is not defined`, ¿qué parte te dice la clase de problema?
3. ¿Qué pasa si tu código ejecuta un bucle que nunca termina?

Ya estás listo para el **cuestionario del Módulo 1**. Después de eso, ¡a Big O!

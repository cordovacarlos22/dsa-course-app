---
title: Cómo ejecutar código en este curso
order: 3
minutes: 8
---

> **Meta:** usar las cajas de código como un profesional: imprimir valores, leer mensajes de error y salir de un bucle infinito.

## La caja de código

Cada caja oscura con un botón **Ejecutar** es un pequeño editor de código:

- **Edita** el código: haz clic dentro y escribe, como en cualquier caja de texto.
- **Ejecútalo**: presiona el botón **Ejecutar**, o **Ctrl + Enter** (**Cmd + Enter** en Mac).
- **Restablécelo**: vuelve al código original si te pierdes.

Cuando presionas Ejecutar, tu código corre aquí mismo en tu navegador, en un espacio aparte de la página, así que la lección nunca se congela. JavaScript lee tu código **de arriba hacia abajo**, una línea a la vez, y todo lo que tu código imprima con `console.log` aparece debajo de la caja. Nada de lo que escribas puede romper la lección: si te pierdes, Restablecer lo regresa todo.

Eso hace que las cajas de código sean el mejor lugar para experimentar. Cambia un número, renombra una variable, borra una línea y mira qué pasa. Aprendes más de un resultado que te sorprende que de leer el mismo código diez veces. Pruébalo con esta: ejecútala, luego intercambia las dos últimas líneas y ejecútala otra vez.

```js-run
console.log('1. Esta línea corre primero')
const result = 2 + 3
console.log('2. Luego esta: 2 + 3 =', result)
console.log('3. Y esta corre al final')
```

Las **comprobaciones** de código usan un espacio de trabajo más grande: la lección a la izquierda, y a la derecha el editor con el resultado debajo (pestañas en el teléfono). **Ejecutar** muestra lo que imprime tu código, y **Comprobar** ejecuta pruebas sobre tu código y te dice cuáles pasan. Lo vas a probar en los siguientes pasos.

**Error común:** calcular un valor y esperar verlo. Una línea como `2 + 3` sola calcula la respuesta y luego la tira. Solo lo que le pasas a `console.log` aparece debajo de la caja.

## Imprimir valores

`console.log` es tu ventana a un programa que está corriendo. No puedes ver qué hay dentro de una variable mientras el código corre, pero sí puedes imprimirla. Por eso los programadores imprimen valores todo el tiempo: para revisar que una variable guarda lo que creen, y para seguir un bucle vuelta por vuelta.

`console.log` puede imprimir varios valores a la vez. Sepáralos con comas, y pone un espacio entre ellos. Los arrays y los objetos se imprimen con su contenido, así que puedes ver cada elemento:

```js-run
const language = 'JavaScript'
const year = 1995

console.log('Lenguaje:', language)
console.log(language, 'se creó en', year)
console.log([1, 2, 3], { course: 'DSA' })
```

Cuando algo no funciona, imprimir los valores paso a paso suele ser la forma más rápida de descubrir por qué. Pon un `console.log` dentro de un bucle y obtienes una línea por vuelta, así que puedes ver cómo cambia una variable:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
  console.log('i es', i, '| el invitado es', guests[i], '| count es', count)
}
```

**Error común:** unir un objeto a un texto con `+`. `console.log('Invitado: ' + { name: 'Ana' })` imprime `Invitado: [object Object]`, porque `+` convierte primero el objeto en texto. Usa una coma, `console.log('Invitado:', { name: 'Ana' })`, y vas a ver lo que tiene adentro.

## Leer un mensaje de error

Los errores no son fracasos: son la computadora diciéndote exactamente qué salió mal. Cuando JavaScript llega a una línea que no puede ejecutar, se **detiene** ahí e imprime un error. Todo lo que está antes de esa línea ya corrió; nada de lo que está después corre.

Cada mensaje de error tiene dos partes. El **tipo** te dice qué clase de problema es, y el **mensaje** te da los detalles. Estos tres tipos son los que más vas a ver:

- **ReferenceError:** usaste un nombre que JavaScript no conoce, casi siempre un error de escritura o una variable que olvidaste crear.
- **TypeError:** el valor no es del tipo correcto para lo que hiciste con él, como leer una propiedad de `undefined` o llamar algo que no es una función. Te lo vas a encontrar mucho con las listas enlazadas: `null.next` es un TypeError.
- **SyntaxError:** JavaScript ni siquiera pudo leer el código, por ejemplo porque falta un `)` o una `}`. Con este, no corre nada.

Ejecuta este código:

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

El **tipo** (`ReferenceError`) dice que usamos un nombre que JavaScript no conoce. El **mensaje** (`gret is not defined`, "gret no está definido") dice qué nombre. ¡Es un error de escritura! Cambia `gret` por `greet` y ejecútalo otra vez.

Aquí hay un TypeError. No hay ningún invitado en el índice 5, así que `guests[5]` es `undefined`, y `undefined` no tiene `length`:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests[5]) // undefined: no hay invitado en el índice 5
console.log(guests[5].length)
```

**Error común:** leer solo la palabra "Error" y adivinar. El mensaje casi siempre dice el problema exacto: qué nombre falta, o qué valor era `undefined`. Lee la línea completa antes de cambiar algo.

## Cuando el código nunca termina

Un bucle `while` corre **mientras su condición sea verdadera**. Así que algo dentro del bucle tiene que cambiar, poco a poco, hasta que la condición se vuelva falsa. Si nada cambia, la condición sigue siendo verdadera para siempre, y tienes un **bucle infinito**. En una pestaña normal del navegador, congelaría la página, porque JavaScript hace una cosa a la vez y nunca llega a lo demás. Aquí no puede: si tu código sigue ejecutándose después de **2 segundos**, el curso lo detiene por ti y muestra un mensaje.

Este bucle nunca termina, porque olvidamos aumentar `count`:

```js-run
let count = 0

while (count < 5) {
  // Ups: nunca le sumamos 1 a count, así que count < 5 siempre es verdadero.
}

console.log('¡Terminó!')
```

Ejecútalo y espera dos segundos. Luego arréglalo: agrega `count++` dentro del bucle y ejecútalo otra vez. Ahora verás `¡Terminó!`.

**Error común:** cambiar la variable en la dirección equivocada. Si el bucle corre mientras `count < 5`, entonces `count--` hace `count` cada vez más chico, así que nunca llega a 5: sigue siendo un bucle infinito. Pregúntate: "¿Cada vuelta me acerca al final?"

### Opcional: practicar en Chrome DevTools

Las cajas de código son perfectas para las lecciones. Para sesiones de práctica más largas, también puedes usar el editor de código que trae Google Chrome. Los pasos son los mismos en Mac, Windows o una Chromebook:

1. Abre Chrome y luego el menú **⋮ → Más herramientas → Herramientas para desarrolladores**.
2. En DevTools, abre su propio menú **⋮** (no el del navegador), luego **Posición** (_Dock side_), y elige **Desacoplar en una ventana separada** para tener una ventana completa.
3. Ve a la pestaña **Sources** (Fuentes) y luego a **Snippets** (abre el navegador con el botón `»` si no lo ves).
4. Haz clic en **+ New snippet**, escribe tu código y ejecútalo con **Ctrl + Enter** (**Cmd + Enter** en Mac).

La salida aparece en la **Console** (consola) de abajo. También puedes llamar a tus funciones directamente desde la consola después de ejecutar el snippet. DevTools tiene un tema claro y uno oscuro: elige uno en su **Configuración** (el ícono del engrane) y luego recarga DevTools cuando te lo pida.

En resumen:

- **Ejecutar** = el botón o **Ctrl/Cmd + Enter**. **Restablecer** vuelve al código original.
- `console.log(a, b, c)` imprime varios valores separados por espacios.
- Un mensaje de error = un **tipo** + un **mensaje**. Lo que se imprimió antes del error sigue apareciendo.
- Los bucles infinitos se detienen después de **2 segundos**.

Ya puedes hacer el **cuestionario del Módulo 1**. Después de eso, ¡a Big O!

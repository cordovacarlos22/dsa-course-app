---
title: Cómo ejecutar código en este curso
order: 3
minutes: 12
---

> **Meta:** dominar las cajas de código: imprimir valores, seguir la repetición, leer mensajes de error y salir de un bucle infinito.

## La caja de código

Cada caja oscura con un botón **Ejecutar** es un pequeño editor de código:

- **Edita** el código: haz clic dentro y escribe, como en cualquier caja de texto.
- **Ejecútalo**: presiona el botón **Ejecutar**, o **Ctrl + Enter** (**Cmd + Enter** en Mac).
- **Restablécelo**: vuelve al código original si te pierdes.

Cuando presionas Ejecutar, tu código corre aquí mismo en tu navegador, en un espacio aparte de la página, así que la lección nunca se congela. JavaScript ejecuta tu código **de arriba hacia abajo**, una línea a la vez, y todo lo que tu código imprima con `console.log` aparece debajo de la caja. Nada de lo que escribas puede romper la lección: si te pierdes, Restablecer lo regresa todo.

Eso hace que las cajas de código sean el mejor lugar para experimentar. Cambia un número, renombra una variable, borra una línea y mira qué pasa. Aprendes más de un resultado que te sorprende que de leer el mismo código diez veces. Pruébalo con esta: ejecútala, luego presiona **Editar**, intercambia las dos últimas líneas y ejecútala otra vez.

```js-run
console.log('1. Esta línea corre primero')
const result = 2 + 3
console.log('2. Luego esta: 2 + 3 =', result)
console.log('3. Y esta corre al final')
```

Después de presionar Ejecutar, la caja se convierte en una **repetición** de lo que pasó:

- El código aparece **de solo lectura, con números de línea**.
- La salida aparece **una línea a la vez**. Cada línea tiene una **etiqueta de línea**, como `línea 3`, que dice qué línea del código la imprimió, y esa línea del código se ilumina.
- **Repetir** la reproduce otra vez, **Paso** muestra una línea más cada vez que lo presionas, **Mostrar todo** muestra todo de una vez, y **Editar** te regresa al editor, con tu código tal como lo dejaste.

En la caja de arriba, las etiquetas dicen `línea 1`, `línea 3` y `línea 4`. La línea 2 no imprimió nada, así que nunca se ilumina: calculó `2 + 3` en silencio. Cuando la salida es larga (más de 60 líneas), o tu dispositivo pide menos movimiento, todo aparece de una vez.

**Por dentro:** una página web ejecuta su JavaScript **una cosa a la vez**. Si tu código corriera dentro de la página y se atorara en un bucle, la página no podría hacer nada más: ni desplazarse, ni responder a clics, ni dibujarse. Por eso el curso ejecuta tu código en un **Web Worker**, un ayudante aparte que ejecuta JavaScript junto a la página en vez de dentro de ella. La lección sigue respondiendo mientras tu código corre, y si tu código sigue ocupado después de **2 segundos**, el curso detiene el worker. Antes de ejecutar tu código, el curso también anota el número de línea de cada `console.log`; así es como la repetición sabe qué línea imprimió qué.

Las **comprobaciones** de código usan un espacio de trabajo más grande: la lección a la izquierda, y a la derecha el editor con el resultado debajo (pestañas en el teléfono). **Ejecutar** muestra lo que imprime tu código, y **Comprobar** ejecuta pruebas sobre tu código y te dice cuáles pasan. Vas a probar una al final del siguiente paso: un calentamiento corto. Las demás comprobaciones de este módulo son preguntas sobre el código, para que te concentres en leerlo.

**Error común:** calcular un valor y esperar verlo. Una línea como `2 + 3` sola calcula la respuesta y luego la tira. Solo lo que le pasas a `console.log` aparece debajo de la caja.

## Imprimir valores

`console.log` es tu ventana a un programa que está corriendo. No puedes ver qué hay dentro de una variable mientras el código corre, pero sí puedes imprimirla. Por eso quienes programan imprimen valores todo el tiempo: para revisar que una variable guarda lo que creen, y para seguir un bucle vuelta por vuelta.

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
  console.log('i es', i, '| nombre:', guests[i], '| count es', count)
}
```

Mira la repetición de este: la etiqueta dice `línea 5` tres veces, porque la misma línea se ejecuta otra vez en cada vuelta del bucle. Es el bucle, hecho visible.

Las comas y el `+` se parecen, pero hacen cosas distintas. Una coma le da a `console.log` valores separados, y los imprime uno por uno. Un `+` con texto primero **une**, de izquierda a derecha, y `console.log` recibe solo el resultado unido. Predice cada línea y luego ejecútalo:

```js-run
console.log('5' + 3)
console.log(5 + 3)
console.log('Total:', 5 + 3)
console.log('Total: ' + 5 + 3)
```

`'5' + 3` une texto, así que imprime `53`. `5 + 3` suma números: `8`. Con la coma, `5 + 3` se calcula por separado, así que obtienes `Total: 8`. Pero en la última línea, `'Total: ' + 5` pasa primero y forma el texto `'Total: 5'`, y luego `+ 3` le une otro `3`: `Total: 53`. Cuando mezclas texto y números, las comas son la opción segura.

**Error común:** unir un objeto a un texto con `+`. `console.log('Datos: ' + { name: 'Ana' })` imprime `Datos: [object Object]`, porque `+` convierte primero el objeto en texto. Usa una coma, `console.log('Datos:', { name: 'Ana' })`, y vas a ver lo que tiene adentro.

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

El **tipo** (`ReferenceError`) dice que usamos un nombre que JavaScript no conoce. El **mensaje** (`gret is not defined`, "gret no está definido") dice qué nombre. ¡Es un error de escritura! Presiona **Editar**, cambia `gret` por `greet` y ejecútalo otra vez.

En la repetición, el error aparece al final, en rojo, con la etiqueta de la línea que lo lanzó: aquí, `línea 6`. Esa etiqueta es tu punto de partida: ve a esa línea y léela con calma. (Cuando el navegador no puede saber qué línea fue, el error simplemente no tiene etiqueta.)

Aquí hay un TypeError. No hay nadie en el índice 5, así que `guests[5]` es `undefined`, y `undefined` no tiene `length`:

```js-run
const guests = ['Ana', 'Ben', 'Cleo']
console.log(guests[5]) // undefined: no hay nadie en el índice 5
console.log(guests[5].length)
```

Un **SyntaxError** funciona distinto. Antes de ejecutar nada, JavaScript primero **lee** todo tu código para entender su estructura: dónde empieza y termina cada función, cada bucle y cada línea. Si no puede entender el código, se rinde ahí mismo, así que no corre ni la primera línea. Por eso este ejemplo no es una caja con Ejecutar:

```js
console.log('¿Esto se imprime?')
console.log('Falta el paréntesis de cierre'
```

Recibirías un error como `SyntaxError: missing ) after argument list` ("falta un ) después de la lista de argumentos"), y ninguna salida, ni siquiera `¿Esto se imprime?`. Las palabras cambian un poco de un navegador a otro. Cuando veas un SyntaxError, busca un `)`, una `}` o una comilla que falte, muchas veces cerca del final del código.

**Error común:** leer solo la palabra "Error" y adivinar. El mensaje casi siempre dice el problema exacto: qué nombre falta, o qué valor era `undefined`. Lee la línea completa antes de cambiar algo.

## Cuando el código nunca termina

Un bucle `while` corre **mientras su condición sea verdadera**. Así que algo dentro del bucle tiene que cambiar, poco a poco, hasta que la condición se vuelva falsa. Si nada cambia, la condición sigue siendo verdadera para siempre, y tienes un **bucle infinito**. En una pestaña normal del navegador, congelaría la página, porque JavaScript hace una cosa a la vez y nunca llega a lo demás. Aquí no puede: tu código corre en el Web Worker que conociste en el primer paso, y si sigue ejecutándose después de **2 segundos**, el curso lo detiene por ti y muestra un mensaje.

Este bucle nunca termina, porque olvidamos aumentar `count`:

```js-run
let count = 0

while (count < 5) {
  // Ups: nunca le sumamos 1 a count, así que count < 5 siempre es verdadero.
}

console.log('¡Terminó!')
```

Ejecútalo y espera dos segundos. Luego arréglalo: agrega `count++` dentro del bucle y ejecútalo otra vez. Ahora verás `¡Terminó!`.

Antes de ejecutar cualquier bucle, hazle tres preguntas:

1. **¿Cuándo se detiene?** Lee la condición: este bucle se detiene cuando `count < 5` se vuelve falso, o sea, cuando `count` llega a 5.
2. **¿Qué cambia en cada vuelta?** Busca la línea dentro del bucle que cambia la variable de la condición. Si no hay ninguna, nunca se detiene.
3. **¿El cambio avanza hacia el final?** `count++` lleva `count` de 0 hasta 5, así que sí.

**Error común:** cambiar la variable en la dirección equivocada. Si el bucle corre mientras `count < 5`, entonces `count--` hace `count` cada vez más chico, así que nunca llega a 5: sigue siendo un bucle infinito. Pregúntate: "¿Cada vuelta me acerca al final?"

### Opcional: practicar en Chrome DevTools

Las cajas de código son perfectas para las lecciones. Para sesiones de práctica más largas, también puedes usar el editor de código que trae Google Chrome. Los pasos son los mismos en Mac, Windows o una Chromebook:

1. Abre Chrome y luego el menú **⋮ → Más herramientas → Herramientas para desarrolladores**.
2. En DevTools, abre su propio menú **⋮** (no el del navegador), luego **Posición** (_Dock side_). Puedes acoplar DevTools a la derecha, abajo o a la izquierda de la página, o elegir **Desacoplar en una ventana separada** para darle su propia ventana. Luego pon esa ventana en pantalla completa para tener mucho espacio.
3. Ve a la pestaña **Sources** (Fuentes) y abre su panel izquierdo con el botón **Show navigator** (arriba a la izquierda) si está cerrado. Luego elige la pestaña **Snippets**; si no la ves, está detrás del botón `»`. Cada snippet que guardas se queda ahí, así que es un buen lugar para tu código de práctica.
4. Haz clic en **+ New snippet**, escribe tu código y ejecútalo con **Ctrl + Enter** (**Cmd + Enter** en Mac), o con el botón de reproducir de abajo.

Pruébalo con una función chiquita:

```js
function sayBack(words) {
  return words
}

console.log(sayBack('¡Hola desde un snippet!'))
```

La salida aparece en la **Console** (consola) de abajo. Después de ejecutar el snippet, la función existe en esa pestaña, así que también puedes llamarla directo desde la consola: escribe `sayBack('Hola desde la consola')` y presiona Enter. DevTools tiene un tema claro y uno oscuro: elige uno en su **Configuración** (el ícono del engrane) y luego recarga DevTools cuando te lo pida.

En resumen:

- **Ejecutar** = el botón o **Ctrl/Cmd + Enter**. **Restablecer** vuelve al código original.
- Después de Ejecutar, la **repetición** muestra cada línea de salida con una **etiqueta** de la línea que la imprimió: **Repetir**, **Paso**, **Mostrar todo** y **Editar**.
- Tu código corre en un **Web Worker**, junto a la página, así que la lección nunca se congela.
- `console.log(a, b, c)` imprime varios valores separados por espacios. Un `+` con texto primero une.
- Un mensaje de error = un **tipo** + un **mensaje**. Lo que se imprimió antes del error sigue apareciendo, excepto con un **SyntaxError**, donde no corre nada.
- Los bucles infinitos se detienen después de **2 segundos**. Revisa cada bucle: ¿cuándo se detiene, y cada vuelta avanza hacia eso?

Ya puedes hacer el **cuestionario del Módulo 1**. Después de eso, ¡a Big O!

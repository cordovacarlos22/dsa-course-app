---
title: Las estructuras de datos que te dan gratis
order: 1
minutes: 10
---

> **Meta:** saber qué es una estructura de datos, conocer las dos que JavaScript te da gratis y aprender las cuatro preguntas que vamos a hacerle a cada una.

## ¿Qué es una estructura de datos?

Acabas de pasar un módulo completo aprendiendo a medir código con Big O. Antes de usarlo en búsquedas, ordenamientos y las estructuras de datos que vas a construir tú, apuntémoslo a algo que ya usas todos los días: **los arrays y los objetos**. Este módulo no enseña a usarlos desde cero. Ya sabes crear un array o leer una propiedad. En cambio, los vamos a ver **con los lentes de Big O**: qué hacen rápido, qué cosas son más lentas de lo que esperarías, y por qué.

Primero, una definición. Una **estructura de datos** es una forma de organizar datos en la memoria para que algunas cosas sean fáciles y rápidas de hacer con ellos. La misma información se puede guardar en estructuras distintas, y la estructura que eliges decide qué operaciones son baratas y cuáles son caras.

Esto ya lo haces en la vida real. Un diccionario guarda sus palabras en orden alfabético, así que encontrar una palabra es rápido, pero agregar una palabra nueva obliga a hacerle espacio en la página correcta. Una caja de zapatos llena de recibos es lo contrario: echar un recibo nuevo no cuesta nada, pero encontrar un recibo específico obliga a revisar toda la caja. Ninguno de los dos es "el mejor". Cada uno es bueno para algo y malo para otra cosa. Eso se llama un **intercambio** (en inglés, _trade-off_), y toda estructura de datos tiene uno.

Casi todo este curso trata de estructuras de datos: listas enlazadas, pilas, colas, árboles, montículos, tablas hash y grafos. Las vas a construir tú. Pero JavaScript ya te da dos gratis, sin escribir nada de código: el **array** y el **objeto**.

```viz
array-vs-object
```

**Qué acaba de pasar:** la misma fiesta se guardó de dos formas distintas.

- El **array** `guests` guarda a los invitados **en orden**, cada uno en una posición numerada (un índice).
- Al **objeto** `rsvps` no le importa el orden. **Etiqueta** cada respuesta con una clave: el nombre de quien respondió.

Leer, agregar al final y buscar cuestan más o menos lo mismo en los dos. Pero cuando Zoe se agregó al principio, el array tuvo que reindexar a cada persona de la lista, mientras que el objeto no tenía ningún "principio" del cual preocuparse. Ese es el intercambio que vas a estudiar en este módulo: el array paga por su orden.

Ejecuta esto para ver las dos estructuras y una sorpresa:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(guests)
console.log(rsvps)

console.log(typeof guests) // ¡'object'!
console.log(Array.isArray(guests), Array.isArray(rsvps))
```

`typeof` dice que un array es un `'object'`. En JavaScript, los arrays de verdad son un tipo especial de objeto, uno cuyas claves son los números 0, 1, 2… más un `length`. Se comportan tan distinto que los estudiamos por separado, y `Array.isArray` es la forma de distinguirlos.

**Error común:** pensar que uno de los dos siempre es mejor. Los arrays no son "objetos peores" ni los objetos son "arrays más rápidos". Están hechos para trabajos distintos.

## Acceder contra buscar

Para comparar estructuras de datos de forma justa, le hacemos las mismas cuatro preguntas a cada una. Estas palabras van a regresar en cada módulo del curso, así que vale la pena ser precisos:

- **Insertar:** agregar un elemento nuevo.
- **Eliminar:** quitar un elemento.
- **Acceder:** leer un elemento cuando sabes **dónde** está: su índice en un array, o su clave en un objeto.
- **Buscar:** encontrar un elemento cuando solo sabes **qué** es: su valor.

La diferencia entre las dos últimas es la que más se confunde. Acceder pregunta "¿qué hay en el índice 3?" o "¿qué respondió Dev?". Buscar pregunta "¿Zoe está en la lista?" o "¿alguien respondió maybe?". Al acceder tienes una dirección, así que puedes ir directo. Al buscar no tienes dirección, así que quizá tengas que mirar en todas partes.

```viz
search-cases
```

**Qué acaba de pasar:** buscar un nombre en la lista obliga a revisar las cajas una por una. En el mejor caso el nombre está en la primera caja; en el peor caso no está y se revisan todas las cajas. Eso es buscar, y en una lista desordenada es **O(n)**.

Compáralo con leer `guests[3]`, que salta directo a la caja 3 en un paso, como viste en el módulo de Big O. El mismo array, los mismos invitados, dos costos muy distintos: todo depende de si sabes **dónde** o solo **qué**.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

// Acceder: sabemos dónde. Un paso: O(1).
console.log(guests[3])

// Buscar: solo sabemos qué. indexOf revisa las cajas una por una: O(n).
console.log(guests.indexOf('Eli'))
console.log(guests.indexOf('Zoe')) // -1: las revisó todas y no está
```

**Error común:** decir que `indexOf` o `includes` son "acceder". Son una línea cada uno, pero son búsquedas: tienen un bucle por dentro.

## ¿Por qué medir herramientas que ya usas?

Es tentador pensar que las herramientas que vienen incluidas son gratis porque tú no las escribiste. No lo son. Cuando llamas a un método, se ejecuta código de alguien más, y ese código tiene un Big O igual que el tuyo. Algunos métodos dan un pasito. Otros recorren cada elemento, y unos cuantos hacen todavía más. Si no sabes cuál es cuál, una línea que se ve inocente dentro de un bucle puede volver lenta una función rápida.

Por eso este módulo tiene tres metas:

1. **Ponerle un Big O a cada operación básica de los objetos y los arrays**, y saber la razón de cada uno.
2. **Explicar qué hace que el frente de un array sea el lado caro**, y qué puedes hacer al respecto.
3. **Poner en la balanza los arrays contra los objetos, y sus métodos incluidos entre sí**: `push`, `slice`, `sort`, `Object.keys`, `hasOwnProperty` y más.

También vas a conocer un Big O nuevo, **O(n log n)**, que es donde cae el `sort` de JavaScript. Esta es la escala que vamos a seguir usando:

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** estas son las formas del módulo de Big O, desde el O(1) plano hasta el O(n²) empinado. Cada operación de este módulo cae en una de ellas. Para ubicarla, hazte una pregunta sencilla: **¿cuántos elementos toca?** Un elemento, sin importar el tamaño: O(1). Cada elemento una vez: O(n).

No necesitas memorizar una tabla con todos los métodos. Si entiendes **por qué** una operación cuesta lo que cuesta, puedes deducirlo cuando lo necesites. En una entrevista, esa habilidad vale mucho más que una lista memorizada.

Puedes sentir la diferencia ahora mismo. Este código agrega 30,000 invitados al final de un array y 30,000 al principio de otro:

```js-run
let start = performance.now()
const atTheEnd = []
for (let i = 0; i < 30000; i++) {
  atTheEnd.push(i)
}
console.log('push:', (performance.now() - start).toFixed(1), 'ms')

start = performance.now()
const atTheStart = []
for (let i = 0; i < 30000; i++) {
  atTheStart.unshift(i)
}
console.log('unshift:', (performance.now() - start).toFixed(1), 'ms')
```

La misma cantidad de elementos, el mismo tamaño final, un tiempo muy distinto. El resto de este módulo explica por qué.

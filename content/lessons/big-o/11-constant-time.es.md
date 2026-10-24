---
title: 'O(1): tiempo constante'
order: 11
minutes: 9
---

> **Meta:** reconocer código O(1), el Big O más eficiente que existe.

## Una operación, sea cual sea n

Sigue **O(1)**, que se lee "O de 1". Describe código cuyo trabajo **no cambia** cuando crece la entrada. No "muy poco trabajo", sino **el mismo** trabajo: sea n 1 o mil millones, el código hace el mismo número fijo de operaciones. El 1 de O(1) no significa "una operación". Representa cualquier cantidad fija, igual que el 1 de f(n) = 1 en la definición nunca cambia con n.

Este es el ejemplo más simple. Si cada una de las n personas invitadas trae a alguien más, el total de personas es n + n. Una función que lo regresa hace **una operación**, la suma. No importa si n es 1 o un millón; siempre es una operación. Agrega otra suma, como `return n + n + n`, y son dos operaciones, así que O(2). Como seguro ya adivinaste, quitamos la constante y lo simplificamos a **O(1)**: el número de operaciones es una constante que no cambia cuando cambia n.

La versión con la fórmula de `sumOneTo` es el mismo tipo de código:

```viz
trace-sum-formula
```

**Qué acaba de pasar:** n + 1, luego la multiplicación, luego la división: 3 operaciones. Elige n = 1,000,000 y el contador se sigue quedando en 3. Tres operaciones cada vez, así que O(3), que escribimos como **O(1)**.

Aquí están: `withPlusOnes` (cada quien trae a una persona más) y `withTwoFriends` (cada quien trae a dos), con una n chiquita y una enorme:

```js-run
function withPlusOnes(n) {
  return n + n
}

function withTwoFriends(n) {
  return n + n + n
}

console.log(withPlusOnes(1), withPlusOnes(1000000))
console.log(withTwoFriends(1), withTwoFriends(1000000))
```

**Error común:** pensar que O(1) significa "exactamente un paso". Una función que siempre hace 3 pasos, o 300, también es O(1). Lo que la hace O(1) es que el número nunca crece con la entrada.

## Salta directo a la caja

El trabajo O(1) **no depende del tamaño de los datos**. El ejemplo clásico es leer un elemento de un array por su índice. Un array guarda sus elementos en un solo bloque de memoria, uno junto al otro, como cajas numeradas en fila. Así que para encontrar la caja 3, la computadora no pasa por las cajas 0, 1 y 2. Calcula dónde está la caja 3 con un poco de matemáticas (dónde empieza la fila, más 3 cajas) y **salta directo** ahí. Es un paso con 6 invitados, y un paso con un millón.

`guests.length` funciona igual: el array ya sabe su tamaño, así que no cuenta. Leer o cambiar una clave de un objeto, como `party.host`, también es O(1); vas a ver cómo lo logran los objetos en el módulo de Tablas hash. Otros trabajos O(1) de todos los días:

- leer o cambiar una clave de un objeto (`party.host`),
- hacer cuentas con unos cuantos números (`guests.length * 2`),
- darle un valor a una variable.

```viz
constant-jump
```

**Qué acaba de pasar:** `guests[3]` saltó directo a la caja 3 sin mirar las cajas 0, 1 y 2. `guests.length` también fue un paso. Luego la lista creció a un millón de invitados, y `guests[500000]` siguió saltando directo ahí en un solo paso. El tamaño de la lista nunca entró en la cuenta.

Pruébalo con una lista grande. Armar la lista tarda un momento, porque el bucle agrega un millón de nombres. Pero leer cualquiera de ellos es instantáneo:

```js-run
const guests = []
for (let i = 0; i < 1000000; i++) {
  guests.push('Persona ' + i)
}

console.log(guests[3]) // salta a la caja 3
console.log(guests[500000]) // salta a la caja 500000, igual de rápido
console.log(guests[guests.length - 1]) // la última persona, sigue siendo un salto
console.log(guests.length) // el array ya sabe su tamaño

const party = { host: 'Ana', theme: 'Retro' }
console.log(party.host) // leer una clave también es O(1)
```

**Error común:** pensar que el último elemento de un array tarda más en alcanzarse que el primero. `guests[0]` y `guests[999999]` son el mismo salto, porque la computadora calcula dónde está cada caja en vez de caminar hasta ella.

## El Big O más eficiente

En la gráfica, O(1) es una **línea plana** abajo. Es el Big O **más eficiente** que existe: ningún código puede hacerlo mejor que una cantidad fija de trabajo. Muchas veces vas a escuchar que se le llama **tiempo constante**; cuando escuches esa frase, significa O(1).

Tiempo constante no significa "instantáneo". Una función que siempre hace 1,000 operaciones sigue siendo O(1), porque ese 1,000 nunca crece: hace el mismo trabajo con 10 elementos o con 10 millones. Lo que promete O(1) es que el trabajo **no crece** con la entrada.

Justo por eso la versión con la fórmula de `sumOneTo` le ganó a la versión con el bucle: la fórmula es O(1), el bucle es O(n), y la diferencia crece cada vez que crece n. También es por eso que las operaciones O(1) son tan valiosas para cosas que una app hace todo el tiempo: puedes leer `guests.length` mil veces y nunca se vuelve más lento aunque crezca la fiesta.

Pero cuidado: código corto no es lo mismo que tiempo constante. Mira lo que puede esconder una línea que se ve inocente:

```viz
trace-is-invited
```

**Qué acaba de pasar:** para responder "¿este nombre está en la lista?", el código tuvo que revisar a los invitados uno por uno hasta encontrar el nombre o quedarse sin invitados. 'Zoe' tomó todas las revisiones. Y eso es exactamente lo que hace `guests.includes('Zoe')` por dentro: es una línea, y parece que debería ser un paso, pero es un bucle. Eso es O(n).

Así que cuando busques el Big O de una línea, pregúntate: _¿salta directo a la respuesta, o esconde un bucle?_ `guests[3]` salta. `guests.includes(name)` y `guests.indexOf(name)` recorren.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

console.log(guests[4]) // salta directo a la caja 4: O(1)
console.log(guests.includes('Zoe')) // primero revisa cada nombre: O(n)
console.log(guests.indexOf('Fay')) // revisa invitados hasta encontrar a Fay: O(n)
```

**Error común:** decir que una línea es O(1) porque es corta. `guests.includes('Zoe')` es una sola línea, pero su costo es un bucle sobre toda la lista. Juzga una línea por cuánto trabajo hace, no por cuánto espacio ocupa en la pantalla.

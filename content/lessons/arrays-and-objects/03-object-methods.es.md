---
title: Big O de los métodos de objetos
order: 3
minutes: 10
---

> **Meta:** conocer el Big O de `Object.keys`, `Object.values`, `Object.entries` y `hasOwnProperty`, y detectar un bucle escondido antes de que vuelva lento tu código.

## Object.keys, values y entries: O(n)

Los objetos traen algunos métodos incluidos que vas a usar todo el tiempo. Tres de ellos convierten un objeto en un array:

- **`Object.keys(obj)`** devuelve un array con cada **clave**.
- **`Object.values(obj)`** devuelve un array con cada **valor**.
- **`Object.entries(obj)`** devuelve un array de **pares**, cada uno un array pequeño `[clave, valor]`.

Son muy útiles porque los arrays tienen cosas que los objetos no: un `length`, índices y un orden que puedes recorrer con `for (let i = 0; …)`. Pero piensa en lo que cada método tiene que hacer. Para construir un array con cada clave, tiene que **visitar cada propiedad** del objeto una vez y copiarla a un array nuevo. El hashing no ayuda aquí, porque el trabajo en sí es "cada propiedad". Un objeto con 10 propiedades son unos 10 pasos; uno con 10,000 son unos 10,000.

```viz
object-to-array
```

**Qué acaba de pasar:** `Object.keys` empezó con un array vacío y visitó las claves una por una, copiando cada una al array nuevo: 5 claves, 5 pasos. `Object.values` hizo el mismo recorrido pero copió las respuestas, y `Object.entries` copió las dos cosas en pares. Entries hace un poco más de trabajo por clave, porque arma un par pequeño cada vez, así que podrían ser 2n o 3n pasos en vez de n. Recuerda la regla del módulo de Big O: **elimina las constantes**. Los tres son **tiempo O(n)**.

También cuestan memoria. Cada uno devuelve un **array nuevo** con un elemento por propiedad, así que el espacio extra también crece con n: **espacio O(n)**. Esa es la complejidad espacial que aprendiste en el módulo de Big O.

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(Object.keys(rsvps))
console.log(Object.values(rsvps))
console.log(Object.entries(rsvps))

// Ahora podemos recorrer el objeto como un array
const pairs = Object.entries(rsvps)
for (let i = 0; i < pairs.length; i++) {
  console.log(pairs[i][0] + ' respondió ' + pairs[i][1])
}
```

**Error común:** usar `Object.keys(rsvps).length` como si fuera tan barato como el `length` de un array. Un array tiene su tamaño siempre listo, así que leerlo es O(1). Un objeto no tiene `length`, así que `Object.keys(rsvps).length` primero construye todo el array de claves: O(n). Está bien usarlo; solo no asumas que es gratis.

## hasOwnProperty: O(1)

Muchas veces no necesitas todas las claves. Solo quieres saber si **una** clave está ahí: ¿Dev ya respondió? ¿Zoe está en la lista? Eso es lo que hace **`hasOwnProperty`**. Le das una clave, y responde `true` o `false`.

Piensa por qué es rápido. Ya sabes que un objeto puede encontrar el valor de una clave en O(1): la función hash convierte la clave en una casilla, y el objeto mira en esa casilla. Revisar si una clave **existe** es el mismo viaje: ir a la casilla y ver si hay algo. Así que `hasOwnProperty` es **O(1)**.

```viz
object-has-key
```

**Qué acaba de pasar:** `hasOwnProperty('Dev')` fue directo a donde estaría la clave de Dev y la encontró: `true`. `hasOwnProperty('Zoe')` fue directo a donde estaría la clave de Zoe, no encontró nada y respondió `false`, también en un paso. Pero la última pregunta, si alguien respondió `'late'`, era sobre un **valor**, y los valores no tienen atajo: hubo que leer cada tarjeta.

Hay varias formas de preguntar "¿está esta clave?", y no todas son iguales:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe' }

console.log(rsvps.hasOwnProperty('Ana')) // true
console.log(rsvps.hasOwnProperty('Zoe')) // false

// El operador "in" también revisa claves...
console.log('Ana' in rsvps) // true
// ...pero también cuenta los métodos que todo objeto hereda
console.log('toString' in rsvps) // ¡true!
console.log(rsvps.hasOwnProperty('toString')) // false

// JavaScript más nuevo tiene la misma revisión como función
console.log(Object.hasOwn(rsvps, 'Ben')) // true
```

Todo objeto hereda algunos métodos incluidos, como `toString`, del propio JavaScript. El operador **`in`** también los cuenta, mientras que `hasOwnProperty` solo cuenta las claves que el objeto **posee**, las que tú pusiste ahí. `Object.hasOwn(obj, clave)` es una forma más nueva de escribir `hasOwnProperty`. Todas son O(1).

**Error común:** revisar `rsvps[name] !== undefined` para saber si una clave existe. Funciona casi siempre, pero una clave puede existir con el valor `undefined`. `hasOwnProperty` responde la pregunta de verdad.

## Bucles escondidos

Esta es la lección más útil de este módulo: **el costo de una línea es el costo de todo lo que se ejecuta dentro de ella**. `Object.keys(rsvps)` parece un pasito, pero ahora sabes que es un bucle sobre cada propiedad. Eso está bien cuando lo llamas una vez. Se vuelve un problema cuando lo llamas **dentro de otro bucle**.

Mira esta función. Por cada invitado, cuenta cuántos invitados hay en total:

```js
function shareOfGuests(rsvps) {
  const guestNames = Object.keys(rsvps) // O(n), una vez
  for (let i = 0; i < guestNames.length; i++) {
    // Object.keys se ejecuta otra vez en CADA vuelta: O(n) cada vez
    const total = Object.keys(rsvps).length
    console.log(guestNames[i] + ' es 1 de ' + total)
  }
}
```

El bucle de afuera da n vueltas, y en cada vuelta `Object.keys` visita otra vez las n claves. Eso son n × n pasos: **O(n²)**, un bucle dentro de un bucle, aunque solo escribiste un `for`.

```viz
nested-grid
```

**Qué acaba de pasar:** este es el dibujo de cualquier bucle dentro de otro bucle. Cada fila es una vuelta del bucle de afuera, y en cada fila el bucle de adentro recorre a los n invitados. En `shareOfGuests`, ese bucle de adentro es el que está escondido dentro de `Object.keys`. Duplica los invitados y el trabajo crece cuatro veces.

La solución es sencilla: haz el trabajo caro **una vez**, antes del bucle, y guarda el resultado en una variable.

```js-run
function shareOfGuests(rsvps) {
  const guestNames = Object.keys(rsvps) // O(n), una vez
  const total = guestNames.length // O(1): guestNames es un array
  for (let i = 0; i < guestNames.length; i++) {
    console.log(guestNames[i] + ' es 1 de ' + total)
  }
}

shareOfGuests({ Ana: 'yes', Ben: 'no', Cleo: 'maybe' })
```

Ahora es O(n) + O(n), que es **O(n)**. El mismo resultado, mucho menos trabajo conforme crece la fiesta.

Estos son los métodos de los objetos en una tabla:

| Método                    | Tiempo | Espacio extra |
| ------------------------- | ------ | ------------- |
| `Object.keys(obj)`        | O(n)   | O(n)          |
| `Object.values(obj)`      | O(n)   | O(n)          |
| `Object.entries(obj)`     | O(n)   | O(n)          |
| `obj.hasOwnProperty(key)` | O(1)   | O(1)          |

**Error común:** juzgar el código por cuántos bucles **ves**. Cuenta también los bucles escondidos dentro de los métodos: `Object.keys`, `includes`, `indexOf` y compañía tienen uno.

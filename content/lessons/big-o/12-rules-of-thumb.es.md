---
title: Reglas prácticas
order: 12
minutes: 11
---

> **Meta:** encontrar rápido el Big O de una función completa, dándole un costo a cada línea.

## El costo de cada línea

Analizar código se puede complicar si revisas cada detalle con lupa. No necesitas contar cada operación, como hicimos en la lección 3. En su lugar, puedes darle a cada línea un **costo** en Big O, sumar los costos y simplificar con las dos reglas que ya conoces. Estas **reglas prácticas** no siempre funcionan, pero son un gran punto de partida:

1. **La aritmética es constante.** Sumar, restar, multiplicar o dividir tarda más o menos lo mismo sean cuales sean los números: 2 + 2 y 1,000,000 + 2 cuestan lo mismo. O(1).
2. **Asignar una variable es constante.** `x = 1000` tarda lo mismo que `x = 20000`. O(1).
3. **Acceder a un elemento por índice (en un array) o por clave (en un objeto) es constante.** `guests[0]` o `party.host`: O(1).
4. **Un bucle cuesta cuántas veces corre, multiplicado por el costo de una vuelta por su cuerpo.** Un bucle que corre n veces y hace trabajo O(1) cada vez cuesta n × O(1) = **O(n)**.

Las reglas 1 a 3 cubren líneas sueltas. La regla 4 es la importante, porque de los bucles sale el costo de casi todo el código. Avanza por esta función y mira cómo aparece una etiqueta de costo junto a cada línea:

```viz
trace-party-summary
```

**Qué acaba de pasar:** `guests[0]` recibió O(1) (leer por índice), `guests.length + 2` recibió O(1) (matemáticas) y `let longNames = 0` recibió O(1) (una asignación). Dentro del bucle, la revisión y la suma fueron O(1) cada vez, pero el bucle corrió n veces, así que el bucle completo costó n × O(1) = O(n). El return también fue O(1).

Suma los costos: O(1) + O(1) + O(1) + O(n) + O(1). Luego aplica las dos reglas que conoces (quitar las constantes y los términos no dominantes), y obtienes **O(n)**. No necesitas memorizar estas reglas; las vas a usar tan seguido que se te van a quedar.

Esta es la misma función. El comentario de cada línea es su costo:

```js-run
function partySummary(guests) {
  const first = guests[0] // O(1): leer por índice
  const chairs = guests.length + 2 // O(1): matemáticas
  let longNames = 0 // O(1): asignación
  for (let i = 0; i < guests.length; i++) {
    // el bucle corre n veces...
    if (guests[i].length > 3) {
      longNames = longNames + 1 // ...y hace trabajo O(1) cada vez: O(n)
    }
  }
  return [first, chairs, longNames] // O(1)
}

console.log(partySummary(['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']))
```

**Por dentro:** la regla 2 tiene un detalle que conviene conocer. `let sameList = guests` es O(1) aunque haya un millón de personas en la lista, porque no copia a nadie: copia una **referencia** al mismo array, así que los dos nombres apuntan a una sola lista (el módulo de Clases y punteros entra a fondo en esto). Pero `let copyOfList = guests.slice()` sí copia: arma un array nuevo y mete en él a cada persona de la lista, una por una, así que es O(n). Los métodos que arman un array nuevo a partir de otro, como `slice()` y `concat()`, cuestan tanto como los elementos que copian. Cuando una línea hace una copia, cuenta la copia.

**Error común:** sumar las líneas O(1) como si importaran: "cuatro líneas O(1) y una O(n), así que O(n + 4)". Quita las constantes y los términos no dominantes, y es solo **O(n)**. El bucle decide el costo.

## Los bucles multiplican

La regla 4 también explica los bucles anidados. Dice que el costo de un bucle es **cuántas veces corre** por **el trabajo de adentro**. Cuando el trabajo de adentro es O(1), el bucle es O(n). Pero cuando el trabajo de adentro es **otro bucle** de n pasos, el costo es n × O(n) = n × n = **O(n²)**. Un bucle dentro de un bucle dentro de otro bucle sería n × n × n = O(n³).

La misma regla funciona cuando lo de adentro es un bucle escondido. Un bucle sobre los invitados con `guests.includes(name)` adentro también es n × O(n) = O(n²), aunque solo haya un `for` en la pantalla.

```viz
trace-greet-everyone
```

**Qué acaba de pasar:** por cada persona `i`, el bucle de adentro recorrió a cada persona `j`. Cuando `i` y `j` eran la misma persona, no hubo saludo, pero el bucle de adentro igual dio un paso. Con n invitados, son n × n pasos adentro: **O(n²)**.

Cada vez que veas un bucle, hazte dos preguntas: _¿cuántas veces corre?_ y _¿cuánto trabajo pasa adentro, cada vez?_ Luego multiplica. Estas son las dos formas, con un contador en cada una:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Un bucle con O(1) adentro: n × 1
let welcomes = 0
for (let i = 0; i < guests.length; i++) {
  welcomes = welcomes + 1
}

// Un bucle con otro bucle adentro: n × n
let steps = 0
for (let i = 0; i < guests.length; i++) {
  for (let j = 0; j < guests.length; j++) {
    steps = steps + 1
  }
}

console.log('Un bucle:', welcomes, 'pasos') // 4
console.log('Bucles anidados:', steps, 'pasos') // 16
```

**Error común:** no ver un bucle escondido dentro de un bucle. `for (let i = 0; i < guests.length; i++) { if (helpers.includes(guests[i])) … }` parece un solo bucle, pero `includes` también recorre. Cuenta cada bucle, incluidos los que un método corre por ti.

## Un piso y un techo

Cuántas veces corre un bucle no siempre es obvio. La regla 4 necesita el **largo** del bucle, y a veces ese largo tiene un **piso** fijo (nunca corre menos veces que cierto número) o un **techo** fijo (nunca corre más). Dos ayudantes incluidos aparecen mucho aquí: `Math.max(a, b)` da el mayor de dos números, y `Math.min(a, b)` da el menor.

- **Un piso:** el salón de fiestas siempre pone al menos 12 sillas, aunque lleguen 3 invitados. Un bucle hasta `Math.max(12, guestCount)` corre **al menos** 12 veces. Para una fiesta chica siempre corre 12 veces, pero solo nos importa qué pasa cuando la entrada crece: con 10 millones de invitados, corre 10 millones de veces, y el 12 no importa. Así que es **O(n)**.
- **Un techo:** solo hay 3 premios, así que como mucho 3 invitados pueden ganar uno. Un bucle hasta `Math.min(3, guestCount)` corre **como mucho** 3 veces. Con 2 invitados corre dos veces, pero en cuanto hay más de 3 invitados, **siempre** corre 3 veces: 1,000 invitados o un millón, siguen siendo 3. Un máximo fijo es una constante, así que es **O(1)**.

Compara las dos funciones:

```js-run
function setChairs(guestCount) {
  for (let chair = 1; chair <= Math.max(12, guestCount); chair++) {
    console.log('Silla', chair)
  }
}

function printPrizes(guestCount) {
  for (let prize = 1; prize <= Math.min(3, guestCount); prize++) {
    console.log('Premio', prize)
  }
}

setChairs(3) // igual pone 12 sillas
setChairs(20) // pone 20 sillas
printPrizes(2) // solo 2 invitados, así que 2 premios
printPrizes(50) // se detiene en 3 premios
```

Esta es la misma idea con regalos para los primeros 5 invitados:

```viz
trace-give-gifts
```

**Qué acaba de pasar:** el bucle entregó un regalo en cada vuelta, y se detuvo en cuanto `i < 5` fue falso, aunque quedaban invitados esperando. Con 20 invitados, siguieron siendo 5 regalos. Un bucle que nunca puede correr más de 5 veces es **O(1)**, por larga que se haga la lista de invitados.

Practica con estos:

| Forma del código                               | Big O |
| ---------------------------------------------- | ----- |
| Un bucle que corre n + 25 veces                | O(n)  |
| Un bucle hasta Math.max(n, 12)                 | O(n)  |
| Un bucle hasta Math.min(n, 3)                  | O(1)  |
| Un bucle que salta de 2 en 2                   | O(n)  |
| Un bucle sobre el array con `includes` adentro | O(n²) |

**Error común:** confundir `Math.max` con `Math.min`. `max` pone un piso, así que el bucle sigue creciendo con n: O(n). `min` pone un techo, así que el bucle nunca puede pasar de ahí: O(1). Pregúntate: "¿Este bucle se puede alargar cuando n crece?"

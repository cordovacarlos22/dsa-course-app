---
title: 'O(n): tiempo lineal'
order: 4
minutes: 5
---

> **Meta:** reconocer código O(n): trabajo que crece al mismo ritmo que la entrada.

## Un paso por elemento

Una cafetería quiere el total de las órdenes de hoy. La forma más simple es sumar cada orden una vez:

```js-run
function totalSales(orders) {
  let total = 0
  for (const order of orders) {
    total += order
  }
  return total
}

console.log('Total:', totalSales([4.5, 3, 6.25, 2.75]))
```

El bucle se ejecuta **una vez por orden**. 4 órdenes → 4 sumas. 1,000 órdenes → 1,000 sumas. Cuando la entrada se duplica, el trabajo se duplica.

Eso es **O(n)**, también llamado **tiempo lineal**, donde `n` es el número de elementos.

## Veámoslo crecer

Contemos las sumas en días cada vez más grandes:

```js-run
function countAdditions(orders) {
  let additions = 0
  for (const order of orders) {
    additions++
  }
  return additions
}

for (const n of [5, 50, 500, 5000]) {
  const orders = Array.from({ length: n }, () => 3)
  console.log(n, 'órdenes →', countAdditions(orders), 'sumas')
}
```

En una gráfica, O(n) es una **línea recta**: el trabajo es **proporcional** a la entrada. Cuando escuches "proporcional" en una entrevista, piensa en O(n).

## Cómo reconocer O(n)

Busca un solo bucle que toque cada elemento un número fijo de veces:

- sumar, contar o imprimir cada elemento,
- encontrar el valor más grande o el más pequeño,
- buscar en un array desordenado (peor caso: el elemento no está).

Los métodos de JavaScript también cuentan: `array.includes(x)`, `array.indexOf(x)` y `array.map(fn)` recorren el array, así que son O(n).

En resumen:

- Una pasada por la entrada → **O(n)**, tiempo lineal.
- El doble de entrada → el doble de trabajo. En una gráfica es una línea recta.
- Los bucles escondidos (`includes`, `indexOf`, `map`…) también son O(n).

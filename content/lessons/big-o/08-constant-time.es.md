---
title: 'O(1): tiempo constante'
order: 8
minutes: 5
---

> **Meta:** reconocer código O(1), el Big O más eficiente que existe.

## Trabajo al que no le importa el tamaño de la entrada

Algunas operaciones toman la misma cantidad de pasos sin importar qué tan grande sea la entrada:

```js-run
function firstAndLast(items) {
  return [items[0], items[items.length - 1]]
}

const small = ['a', 'b', 'c']
const huge = Array.from({ length: 1000000 }, (_, i) => i)

console.log(firstAndLast(small))
console.log(firstAndLast(huge))
```

Leer `items[0]` o `items[items.length - 1]` salta directo al lugar correcto. No importa si el array tiene 3 elementos o un millón: el trabajo es el mismo.

Eso es **O(1)**, también llamado **tiempo constante**.

## Más ejemplos de O(1)

```js-run
const prices = { coffee: 3, tea: 2.5, juice: 4 }

function priceWithTax(price) {
  return price * 1.08 // un número fijo de pasos
}

console.log(prices.tea) // buscar la clave de un objeto
console.log(priceWithTax(10)) // matemática simple
console.log([5, 9, 2].length) // leer el largo
```

- Leer un elemento de un array por **índice** (`arr[5]`)
- Leer o asignar una **clave** de un objeto (`prices.tea`)
- Hacer cuentas con unos pocos valores (`price * 1.08`)
- `push` y `pop` al final de un array

Unos pocos pasos o una docena de pasos sigue siendo O(1): recuerda la regla 1, elimina las constantes. O(3) se escribe **O(1)**.

## El mejor Big O

En una gráfica, O(1) es una **línea plana** abajo de todo. Nada crece más lento. Cuando escuches "tiempo constante" en una entrevista, significa O(1), y es lo mejor que puedes lograr.

Pero cuidado: una sola línea de código no es automáticamente O(1). `array.includes(x)` es una línea, pero recorre todo el array: O(n).

En resumen:

- Trabajo que no crece con la entrada → **O(1)**, tiempo constante.
- Acceso por índice, claves de objetos, matemática simple, push/pop.
- Una línea no significa O(1): busca bucles escondidos.

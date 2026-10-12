---
title: Elimina los términos no dominantes
order: 10
minutes: 6
---

> **Meta:** simplificar expresiones como O(n² + n) con la segunda regla: quedarse solo con el término que crece más rápido.

## Un bucle anidado y luego otro bucle

Eliminar los **términos no dominantes** es la segunda forma de simplificar Big O. Toma el bucle anidado de la lección anterior y agrégale un bucle normal después:

```js-run
function printAll(n) {
  let lines = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      lines = lines + 1 // print i, j
    }
  }
  for (let k = 0; k < n; k++) {
    lines = lines + 1 // print k
  }
  return lines
}

console.log(printAll(10)) // 100 from the nested loop + 10 from the last one
```

Con 10, el bucle anidado hace de `0 0` a `9 9` (100 pasos), y el último bucle hace de 0 a 9 (10 pasos). El bucle anidado es O(n²), el último es O(n), así que juntos son **O(n² + n)**. Mira lo que aporta cada parte cuando n crece:

```viz
dominant-term
```

Piensa en n = 100: n² es **10,000**, mientras que la n extra solo agrega **100**. Casi no cambia el número de operaciones. Con n = 1,000, la parte n es una rebanada mínima del total. **n²** es el **término dominante**, y la n sola es un **término no dominante**. Así que simplemente lo quitamos:

**O(n² + n) → O(n²)**

## Los términos pequeños no importan

```viz
big-o-growth-chart
```

La misma idea sirve para cualquier combinación: quédate con el término que crece más rápido y quita el resto.

| Contaste     | Escríbelo así | Por qué                                                |
| ------------ | ------------- | ------------------------------------------------------ |
| n + 10       | O(n)          | 10 es una constante: nunca crece                       |
| 1,000n + 50  | O(n)          | quita el 50 y luego la constante 1,000                 |
| n² + 5n + 8  | O(n²)         | con n = 1,000: 1,000,000 contra solo 5,008 del resto   |
| n² + n³      | O(n³)         | n³ crece más rápido que n², así que n³ es el dominante |
| 2n² + 7n + 3 | O(n²)         | quita 7n y 3, y luego la constante 2                   |

Mira n² + 5n + 8 con n = 1,000: es 1,000,000 + 5,000 + 8. La diferencia entre 1,005,008 y 1,000,000 es mínima, y eso solo con n = 1,000. Pon mil millones y la parte 5n + 8 no significa nada.

Una buena forma de imaginarlo: mira la gráfica desde muy, muy lejos, como si fuera desde el espacio. Desde ahí solo se ve la curva que crece más rápido; todo lo demás es una mancha plana abajo.

Este es un ejemplo paso a paso:

1. Empieza con O(2n² + 7n + 3).
2. Quita los términos no dominantes 7n y 3: O(2n²).
3. Quita la constante 2: **O(n²)**.

Usa las dos reglas juntas: elimina los términos no dominantes y luego las constantes. Cuando no estés seguro, pon un número grande como n = 1,000 y mira qué parte queda en pie.

Cuidado con las constantes grandes: O(n + 1,000,000) sigue siendo simplemente **O(n)**. Por grande que sea, un número fijo no crece, y cuando n es lo bastante grande, la parte n siempre gana.

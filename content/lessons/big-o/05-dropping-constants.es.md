---
title: Eliminar constantes
order: 5
minutes: 5
---

> **Meta:** simplificar expresiones de Big O como O(2n) y O(500) con la primera regla: eliminar las constantes.

## Dos pasadas por el mismo array

Quieres la temperatura más baja y la más alta del mes. Una forma es recorrer el array dos veces: una para el mínimo y otra para el máximo.

```js-run
function lowAndHigh(temperatures) {
  let steps = 0

  let low = temperatures[0]
  for (const t of temperatures) {
    steps++
    if (t < low) low = t
  }

  let high = temperatures[0]
  for (const t of temperatures) {
    steps++
    if (t > high) high = t
  }

  return { low, high, steps }
}

console.log(lowAndHigh([18, 22, 15, 30, 25]))
```

5 temperaturas, 10 pasos: dos bucles de `n` pasos cada uno, o sea **n + n = 2n**. Es tentador escribir O(2n).

## Regla 1: eliminar las constantes

Big O describe la **forma** del crecimiento, no la cuenta exacta. `2n`, `3n` y `100n` son todas líneas rectas: si la entrada se duplica, el trabajo se duplica, sin importar el número de adelante.

Así que **eliminamos la constante** y escribimos **O(n)**.

La misma regla sirve para cualquier número fijo de operaciones. Una función que siempre hace 5, 50 o 500 pasos, sin importar la entrada, se escribe **O(1)**, nunca O(5) ni O(500).

| Contaste | Se escribe |
| -------- | ---------- |
| 2n       | O(n)       |
| 100n     | O(n)       |
| n / 2    | O(n)       |
| 500      | O(1)       |
| 3n²      | O(n²)      |

## ¡Pero la versión más rápida sigue siendo más rápida!

Es cierto. Encontrar los dos valores en **una** sola pasada hace `n` pasos en lugar de `2n`:

```js-run
function lowAndHighOnePass(temperatures) {
  let low = temperatures[0]
  let high = temperatures[0]
  let steps = 0
  for (const t of temperatures) {
    steps++
    if (t < low) low = t
    if (t > high) high = t
  }
  return { low, high, steps }
}

console.log(lowAndHighOnePass([18, 22, 15, 30, 25]))
```

Las dos versiones son O(n). Big O te dice que crecen de la misma forma. Las constantes importan en la práctica, pero son una mejora más pequeña, de segundo nivel. Big O primero te da el panorama completo.

## Resumen

- **Elimina las constantes:** O(2n) → O(n), O(500) → O(1), O(3n²) → O(n²).
- Big O se queda con la forma del crecimiento, no con el número exacto de pasos.
- Dos bucles separados sobre el mismo array siguen siendo O(n).

## Compruébalo tú mismo

1. ¿Cómo escribes O(4n + 4n) en Big O?
2. Una función siempre hace exactamente 12 operaciones. ¿Cuál es su Big O?
3. ¿La versión de una sola pasada es mejor que O(n)?

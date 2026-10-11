---
title: Eliminar los términos no dominantes
order: 7
minutes: 5
---

> **Meta:** simplificar expresiones como O(n² + n) con la segunda regla: quedarte solo con el término que crece más rápido.

## Un bucle anidado y luego un bucle simple

Una maestra imprime una tabla de "quién se sentó junto a quién" para la clase y luego una lista simple de asistencia:

```js-run
function grid(students) {
  let steps = 0
  for (const a of students) {
    for (const b of students) {
      steps++ // una celda de la tabla
    }
  }
  for (const student of students) {
    steps++ // una línea de la lista de asistencia
  }
  return steps
}

console.log(grid(['Ana', 'Bo', 'Cai', 'Dee']), 'pasos para 4 estudiantes')
```

La tabla toma **n²** pasos y la lista toma **n** pasos: **n² + n** en total. ¿Entonces es O(n² + n)?

## Regla 2: eliminar los términos no dominantes

Mira cuánto aporta cada parte a medida que crece la clase:

```js-run
for (const n of [10, 100, 1000]) {
  const squared = n * n
  const total = squared + n
  const share = ((squared / total) * 100).toFixed(1)
  console.log('n =', n, '→ n² =', squared, '+ n =', n, '→ n² es el', share + '% del trabajo')
}
```

A medida que `n` crece, la parte n² es casi todo el trabajo, y la `n` extra casi no importa. n² es el **término dominante**; n es **no dominante**. Así que la eliminamos:

**O(n² + n) → O(n²)**

La misma idea sirve para cualquier combinación. Quédate con el término que crece más rápido:

| Contaste     | Se escribe |
| ------------ | ---------- |
| n² + n       | O(n²)      |
| n + 1000     | O(n)       |
| n³ + n² + 5  | O(n³)      |
| 2n² + 7n + 3 | O(n²)      |

Recuerda las dos reglas juntas: primero elimina las constantes y luego los términos no dominantes.

## Resumen

- **Elimina los términos no dominantes:** quédate solo con la parte que crece más rápido.
- O(n² + n) → O(n²), O(n + 1000) → O(n).
- Junto con la regla 1: O(2n² + 7n + 3) → O(n²).

## Compruébalo tú mismo

1. Simplifica O(n² + 50n).
2. Simplifica O(n + 1,000,000). (Cuidado: ¡el número grande sigue siendo una constante!)
3. Una función tiene un bucle anidado y luego dos bucles simples sobre el mismo array. ¿Cuál es su Big O?

---
title: Elimina los términos no dominantes
order: 8
minutes: 4
---

> **Meta:** simplificar O(n² + n) a O(n²) con la segunda regla.

## Un bucle anidado y luego otro bucle

```viz
dominant-term
```

Saludar a todos (n²) y luego dar la bienvenida a todos (n): **n² + n** pasos. Mira cómo la parte n se encoge casi a nada cuando la fiesta crece. n² es el **término dominante**.

## Quédate solo con la parte que crece más rápido

```viz
big-o-growth-chart
```

Con entradas grandes, solo importa la parte que crece más rápido. Por eso **eliminamos los términos no dominantes**:

| Contaste     | Escríbelo así |
| ------------ | ------------- |
| n² + n       | O(n²)         |
| n + 1,000    | O(n)          |
| 2n² + 7n + 3 | O(n²)         |

Usa las dos reglas juntas: elimina las constantes y luego los términos no dominantes.

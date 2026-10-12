---
title: Elimina los términos no dominantes
order: 8
minutes: 5
---

> **Meta:** simplificar expresiones como O(n² + n) con la segunda regla: quedarse solo con el término que crece más rápido.

## Un bucle anidado y luego otro bucle

Imagina una función que primero hace que cada invitado salude a todos los demás (n² pasos) y luego da la bienvenida a cada invitado una vez (n pasos). En total: **n² + n**. ¿Eso es O(n² + n)? Mira lo que aporta cada parte cuando la fiesta crece:

```viz
dominant-term
```

Con n = 100, n² es 10,000 y n solo suma 100 más: más o menos el 1% del trabajo. Con n = 1,000 la parte n baja al 0.1%. Cuando n crece, n² hace casi todo el trabajo y la n extra casi no cambia nada. A n² lo llamamos el **término dominante** y a n, un **término no dominante**.

Así que lo quitamos: **O(n² + n) → O(n²)**. Esa es la segunda regla: **elimina los términos no dominantes**.

## Quédate con la parte que crece más rápido

```viz
big-o-growth-chart
```

La misma idea sirve para cualquier combinación: encuentra el término que crece más rápido en la gráfica y quédate solo con ese.

| Contaste     | Escríbelo así | Por qué                                              |
| ------------ | ------------- | ---------------------------------------------------- |
| n + 10       | O(n)          | 10 es una constante: no crece                        |
| 1,000n + 50  | O(n)          | quita el término 50 y luego la constante 1,000       |
| n² + 5n + 8  | O(n²)         | con n = 1,000: 1,000,000 contra solo 5,008 del resto |
| 2n² + 7n + 3 | O(n²)         | quita 7n y 3, y luego la constante 2                 |

Usa las dos reglas juntas: elimina los términos no dominantes y luego las constantes. Un truco que ayuda: pon un número grande, como n = 1,000, y mira qué parte queda en pie.

Cuidado con las constantes grandes: O(n + 1,000,000) sigue siendo simplemente O(n). Por grande que sea, un número fijo no crece, y cuando n es lo bastante grande, la parte n siempre gana.

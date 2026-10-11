---
title: Entradas distintas, letras distintas
order: 11
minutes: 4
---

> **Meta:** escribir O(a + b) y O(a · b) para código con dos entradas. ¡Una trampa clásica de entrevista!

## Invitados y ayudantes

```viz
two-inputs
```

La fiesta tiene **invitados** y **ayudantes**: dos listas que pueden tener tamaños muy distintos. Usa una letra por entrada: **a** invitados y **b** ayudantes.

| Forma del código                                         | Big O    |
| -------------------------------------------------------- | -------- |
| Bucle sobre invitados y luego bucle sobre ayudantes      | O(a + b) |
| Bucle sobre ayudantes dentro de un bucle sobre invitados | O(a · b) |

## No los llames n a los dos

```viz
trace-welcome-and-goodbye
```

Aquí los dos bucles recorren la **misma** lista, así que n + n = 2n = O(n). Pero si el segundo bucle recorriera a los ayudantes, no podrías llamar n a los dos tamaños: podría haber 4 invitados y 1,000 ayudantes. Por eso es O(a + b), y no se puede simplificar más.

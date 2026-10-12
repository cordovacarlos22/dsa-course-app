---
title: Entradas distintas, letras distintas
order: 11
minutes: 5
---

> **Meta:** escribir O(a + b) y O(a · b) para código con dos entradas. ¡Una trampa clásica de entrevista!

## Invitados y ayudantes

Hasta ahora cada función tenía una sola entrada, la lista de invitados, y a su tamaño le llamábamos n. Pero la fiesta también tiene **ayudantes**, y la lista de ayudantes puede tener un tamaño completamente distinto:

```viz
two-inputs
```

Usa **una letra por entrada**: **a** invitados y **b** ayudantes.

- Un bucle sobre los invitados y luego un bucle sobre los ayudantes: a pasos + b pasos = **O(a + b)**. Los bucles uno después del otro se **suman**.
- Un bucle sobre los ayudantes **dentro** de un bucle sobre los invitados (cada invitado le agradece a cada ayudante): a × b pasos = **O(a · b)**. Los bucles uno dentro del otro se **multiplican**.

## No los llames n a los dos

```viz
trace-welcome-and-goodbye
```

Esta es la trampa de entrevista. Ves dos bucles seguidos y piensas: "Cada bucle es O(n), entonces O(n + n) = O(2n), elimino la constante, O(n)." Eso es exactamente correcto para esta animación, porque **los dos bucles recorren la misma lista**.

Pero si el segundo bucle recorriera a los ayudantes, estaría mal. ¿Y si hay 4 invitados y 1,000 ayudantes? ¿O un millón de invitados y 3 ayudantes? Llamar n a los dos tamaños esconde que pueden ser muy distintos. Por eso la respuesta es **O(a + b)**, y no se puede simplificar más: ninguno de los dos términos es una constante, y no sabes cuál es más grande.

Lo mismo pasa con los bucles anidados: sobre la misma lista es O(n²), pero sobre dos listas distintas es O(a · b).

| Forma del código                                         | Big O    |
| -------------------------------------------------------- | -------- |
| Dos bucles seguidos sobre la misma lista                 | O(n)     |
| Bucle sobre invitados y luego bucle sobre ayudantes      | O(a + b) |
| Dos bucles anidados sobre la misma lista                 | O(n²)    |
| Bucle sobre ayudantes dentro de un bucle sobre invitados | O(a · b) |

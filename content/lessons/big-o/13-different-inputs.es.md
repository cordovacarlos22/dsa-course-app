---
title: Términos distintos para entradas distintas
order: 13
minutes: 6
---

> **Meta:** escribir O(a + b) y O(a · b) para código con dos entradas. ¡Una "trampa" clásica de entrevista!

## Dos entradas

¿Te acuerdas de `printTwice`, con un bucle después de otro? Cada bucle corría n veces, así que era O(2n), y quitamos la constante para llegar a O(n). Este es el giro de la entrevista: en lugar de pasar **un** número n, pasamos **dos** números distintos, a y b. El primer bucle corre a veces y el segundo corre b veces:

```js-run
function printBoth(a, b) {
  for (let i = 0; i < a; i++) {
    console.log('first loop:', i)
  }
  for (let j = 0; j < b; j++) {
    console.log('second loop:', j)
  }
}

printBoth(2, 4)
```

La respuesta automática, si no has visto esto antes, es así: "Un bucle solo es O(n), y este otro bucle solo es O(n). Los sumo: O(2n). Quito la constante: O(n)."

**Eso no es correcto.** No puedes decir que a es igual a n **y** que b es igual a n: son dos entradas distintas. ¿Y si a es 1 y b es un millón? Son bucles muy distintos. Así que el primer bucle es **O(a)**, el segundo es **O(b)**, y juntos son **O(a + b)**. Hasta ahí se puede simplificar.

Esta es la misma idea con una fiesta que tiene invitados (a) y ayudantes (b):

```viz
two-inputs
```

Y si los bucles estuvieran **anidados** (cada invitado le agradece a cada ayudante), sería **O(a · b)**: un bucle sobre b dentro de un bucle sobre a corre a × b veces.

## No los llames n a los dos

```viz
trace-welcome-and-goodbye
```

Compáralo con esta animación: aquí los dos bucles recorren la **misma** lista, así que n + n = 2n de verdad es O(n). La regla es sencilla: **usa una letra distinta para cada entrada**. Solo cuando dos bucles recorren la misma entrada puedes usar la misma letra.

| Forma del código                                         | Big O    |
| -------------------------------------------------------- | -------- |
| Dos bucles seguidos sobre la misma lista                 | O(n)     |
| Bucle sobre invitados y luego bucle sobre ayudantes      | O(a + b) |
| Dos bucles anidados sobre la misma lista                 | O(n²)    |
| Bucle sobre ayudantes dentro de un bucle sobre invitados | O(a · b) |

¿Por qué no se puede simplificar O(a + b)? Porque ninguno de los dos términos es una constante, y no sabes cuál es más grande. Si hay 4 invitados y 1,000 ayudantes, los ayudantes deciden el trabajo; con un millón de invitados y 3 ayudantes, lo deciden los invitados. Big O conserva los dos, así que la respuesta es correcta sin importar cuál entrada resulte grande.

En una entrevista es buena costumbre decirlo en voz alta: "Llamemos a al número de invitados y b al número de ayudantes. El primer bucle es O(a), el segundo es O(b), así que toda la función es O(a + b)."

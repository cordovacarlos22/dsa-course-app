---
title: Elimina las constantes
order: 6
minutes: 6
---

> **Meta:** simplificar expresiones como O(2n) con la primera regla: eliminar las constantes.

## Dos bucles seguidos

¿Y si el código recorre la lista dos veces? Primero una bienvenida para cada invitado y después una despedida para cada invitado:

```viz
trace-welcome-and-goodbye
```

El primer bucle imprime n mensajes y el segundo imprime n más: **n + n = 2n**. Así que es tentador escribir **O(2n)**. Pero así no se escribe Big O.

## La misma forma, así que quita el número

```viz
same-shape
```

Mira las líneas n, 2n y 3n. Todas son **líneas rectas**. 2n está más inclinada que n, pero crecen igual: duplica los invitados y las dos se duplican. Big O describe la **forma** del crecimiento, así que ignora el número de adelante. Esa es la primera regla: **elimina las constantes**.

| Contaste      | Escríbelo así |
| ------------- | ------------- |
| 2n            | O(n)          |
| 100n          | O(n)          |
| n / 2         | O(n)          |
| 500 (siempre) | O(1)          |
| 13n²          | O(n²)         |

La cuarta fila es importante: un código que siempre da 500 pasos, sin importar la entrada, no crece nada. Se escribe O(1), nunca O(500). n² es la línea curva de la animación; la vas a conocer bien en la siguiente lección.

## Por qué podemos hacerlo

```viz
big-o-growth-chart
```

Esta es la definición oficial, en palabras simples: un código es **O(f(n))** si, una vez que n es lo bastante grande, su número de operaciones **nunca es mayor que alguna constante por f(n)**.

Entonces 2n es O(n), porque 2n nunca es mayor que 2 × n. Y 5n + 3 también es O(n): una vez que n es al menos 3, 5n + 3 nunca es mayor que 6 × n. La constante puede ser el número que quieras; lo que importa es la forma que f(n) dibuja en la gráfica.

¿Quiere decir que las constantes nunca importan? No. Una versión que recorre la lista una vez sigue siendo más rápida que una que la recorre dos veces, y en código real eso puede contar. Pero es una mejora de segundo nivel. Big O se fija primero en el panorama general: ¿el trabajo es plano, una línea recta o una curva que se dispara?

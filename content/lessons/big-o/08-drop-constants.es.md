---
title: Elimina las constantes
order: 8
minutes: 7
---

> **Meta:** simplificar expresiones como O(2n) con la primera regla: eliminar las constantes.

## Dos bucles seguidos

Big O tiene algunas reglas que simplifican la notación y nos hacen la vida más fácil. La primera se llama **eliminar las constantes** (también vas a escuchar "quitar las constantes").

Toma `printNumbers` de la lección anterior y agrégale un segundo bucle que haga lo mismo, usando `j` en lugar de `i`:

```js-run
function printTwice(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  for (let j = 0; j < n; j++) {
    console.log(j)
  }
}

printTwice(3)
```

Con 3, imprime 0, 1, 2 del primer bucle y luego 0, 1, 2 otra vez del segundo. Los dos bucles corren n veces, así que el código corre **n + n = 2n** veces. Esta es la misma forma con la lista de invitados, un bucle de bienvenidas y luego uno de despedidas:

```viz
trace-welcome-and-goodbye
```

Tiene sentido llamarlo **O(2n)**. Pero aquí entra la simplificación: no importa si es 2n, 3n o 100n. Si hay una constante, **la eliminamos**, y este código es **O(n)**.

## La misma forma, así que quita el número

```viz
same-shape
```

¿Por qué se vale? Mira las líneas n, 2n y 3n. Todas son **líneas rectas**. 2n está más inclinada, pero si duplicas la entrada, las dos se duplican. Big O describe la **forma** del crecimiento, no qué tan inclinada está.

Imagina la gráfica estirándose hasta valores enormes de n, y aléjate mucho. Desde tan lejos, 13n², n² y 1,000n² se ven casi iguales, y lo mismo pasa con n, 2n y 100n. Las constantes simplemente no cambian el panorama general:

| Contaste      | Escríbelo así |
| ------------- | ------------- |
| 2n            | O(n)          |
| 100n          | O(n)          |
| n / 2         | O(n)          |
| 500 (siempre) | O(1)          |
| 13n²          | O(n²)         |

La fila de O(500) merece una segunda mirada: quiere decir "500 operaciones cada vez, sea cual sea n". Eso es una línea plana, así que lo simplificamos a **O(1)**, tiempo constante.

## Por qué se vale

```viz
big-o-growth-chart
```

Esta regla sale directamente de la definición: un código es O(f(n)) si sus operaciones son tarde o temprano **menores que una constante por f(n)**. 2n nunca es mayor que 2 × n, y 100n nunca es mayor que 100 × n, así que los dos son O(n). La constante ya viene "incluida" en la definición, así que volver a escribirla no agrega nada.

Intenta simplificar estas:

- O(100 × n) → **O(n)**
- O(25) → **O(1)**
- O(n + n + n + n) → O(4n) → **O(n)**

¿Quiere decir que las constantes nunca importan? No. Una versión que recorre la lista una vez sigue siendo más rápida que una que la recorre dos veces, y en código real eso puede contar. Pero es una mejora de segundo nivel. Big O se fija primero en el panorama general: ¿el trabajo es plano, una línea recta o una curva que se dispara?

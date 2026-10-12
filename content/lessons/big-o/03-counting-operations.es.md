---
title: Contando operaciones
order: 3
minutes: 7
---

> **Meta:** contar las operaciones simples de una función en lugar de medir su tiempo, y ver por qué el conteo exacto no importa.

## Cuenta la fórmula

Si los segundos cambian de una máquina a otra, ¿qué no cambia? El **número de operaciones simples** que tiene que hacer la computadora. Una operación simple es un paso pequeño: una suma, una multiplicación, una división, una comparación, darle un valor a una variable. Cinco operaciones son cinco operaciones en una laptop rápida o en un teléfono viejo.

Contemos primero la versión con la fórmula:

```viz
trace-sum-formula
```

`n * (n + 1) / 2` tiene una suma, una multiplicación y una división: **3 operaciones**. Los números 1 y 2 no son operaciones; solo son valores. Y esto es lo importante: no importa si n es 2 o 1,000,000,000. Siempre son **3 operaciones**. Elige **n = 1,000,000** en la animación y mira cómo el contador se queda en 3.

## Cuenta el bucle

Ahora la versión con el bucle. Su `+` ya no es una sola operación, porque está **dentro de un bucle**:

```viz
trace-sum-loop
```

Vamos línea por línea:

- `total = total + i` es una suma **y** una asignación, y corre una vez por número: n sumas y n asignaciones. Si n es 5, son 5 de cada una; si n es mil millones, mil millones de cada una.
- `i++` es la forma corta de `i = i + 1`: otra suma y otra asignación, otra vez n veces.
- `i <= n` es una comparación, que se revisa n veces.
- `let total = 0` y `let i = 1` pasan una **sola vez**, al principio.

Súmalo todo y obtienes unas **5n + 2** operaciones. Con n = 10 son 52 operaciones; con n = 1,000, son 5,002. Elige **n = 10** en la animación para verlo.

| n     | Bucle (5n + 2) | Fórmula |
| ----- | -------------- | ------- |
| 5     | 27             | 3       |
| 10    | 52             | 3       |
| 1,000 | 5,002          | 3       |

También podrías contarlo de otra manera. ¿La comparación que finalmente termina el bucle es una operación más? ¿`i++` es una operación o dos? Cada persona puede llegar a un total un poco distinto, y no pasa nada.

## Contar "a ojo"

```viz
linear-boxes
```

La buena noticia: **el número exacto no importa**. Sea 5n + 2, 3n o 2n, lo que importa es la **tendencia general**: cuando n crece, el número de operaciones crece **más o menos en proporción a n**. Duplica n y duplicas el trabajo. Ese es el panorama general, y el panorama general es lo que le importa a Big O.

Lo mismo pasa con la lista de invitados. Contar a los invitados uno por uno con un bucle cuesta unas 5 operaciones por invitado:

```viz
trace-count-guests
```

Pero JavaScript ya sabe el tamaño de un array, así que `guests.length` da la misma respuesta en **1 paso**, haya 4 invitados o 4 millones. La misma respuesta, un crecimiento completamente distinto.

Así que a partir de ahora no vamos a contar cada operación. Big O es una forma de **contar a ojo**: contar más o menos, y luego quedarse solo con cómo crece la cuenta. Las siguientes lecciones te muestran cómo.

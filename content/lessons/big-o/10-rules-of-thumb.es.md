---
title: Reglas prácticas
order: 10
minutes: 5
---

> **Meta:** encontrar el Big O de una función dándole un costo a cada línea.

## El costo de cada línea

```viz
trace-party-summary
```

Avanza paso a paso y mira cómo aparecen las etiquetas:

- Leer por índice (`guests[0]`) o por clave: **O(1)**.
- Operaciones con números (`guests.length + 2`): **O(1)**.
- Darle un valor a una variable (`let x = 0`): **O(1)**.
- Un bucle: **(cuántas veces corre) × (el trabajo de adentro)**.

Suma los costos y luego usa las dos reglas para simplificar.

## Los bucles multiplican

```viz
trace-greet-everyone
```

El bucle de afuera corre n veces. El trabajo de adentro es **otro bucle** de n pasos. Así que el costo es n × n = **O(n²)**. Si el trabajo de adentro fuera O(1), sería n × 1 = **O(n)**.

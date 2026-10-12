---
title: Reglas prácticas
order: 10
minutes: 6
---

> **Meta:** encontrar el Big O de una función completa dándole un costo a cada línea.

## El costo de cada línea

No necesitas contar cada operación para encontrar el Big O de una función. Unas pocas reglas prácticas te llevan más rápido. Avanza paso a paso por esta función y mira cómo aparece una etiqueta de costo junto a cada línea:

```viz
trace-party-summary
```

- **Las operaciones con números son O(1).** `guests.length + 2` tarda lo mismo con números pequeños o enormes.
- **Darle un valor a una variable es O(1).** `let longNames = 0`.
- **Leer por índice o por clave es O(1).** `guests[0]`, `party.host`.
- **Un bucle cuesta (cuántas veces corre) × (el trabajo de adentro).** Este bucle corre n veces y el trabajo de adentro es O(1), así que el bucle es n × O(1) = **O(n)**.

Suma los costos: O(1) + O(1) + O(1) + O(n) + O(1). Luego usa las dos reglas que ya conoces: elimina las constantes y los términos no dominantes. Lo que queda es **O(n)**.

## Los bucles multiplican

```viz
trace-greet-everyone
```

La misma regla explica los bucles anidados. El bucle de afuera corre n veces. Esta vez el trabajo de adentro no es O(1): es **otro bucle** de n pasos. Así que el costo es n × n = **O(n²)**. Un bucle dentro de un bucle dentro de otro bucle sería n × n × n = O(n³).

Cada vez que veas un bucle, hazte dos preguntas: _¿cuántas veces corre?_ y _¿cuánto trabajo hay adentro, cada vez?_ Luego multiplica.

## Un bucle con límite

No todos los bucles crecen con la entrada. Aquí, solo los primeros 5 invitados reciben un regalo:

```viz
trace-give-gifts
```

Elige **20 invitados**: siguen siendo 5 regalos. El bucle se detiene con lo que pase primero, el final de la lista o el 5. **Nunca corre más de 5 veces**, por larga que sea la lista. Un máximo fijo es una constante, así que este bucle es **O(1)**.

Ahora al revés: imprime una tarjeta con el nombre de cada invitado, y siempre imprime al menos 5 tarjetas (en blanco si hay menos invitados). Ese bucle corre 5 veces en una fiesta pequeña pero n veces en una grande, así que crece con n: **O(n)**. Cuando veas un límite, pregúntate: _¿el bucle se detiene en un número fijo o sigue creciendo con n?_

Practica simplificando:

| Contaste            | Big O |
| ------------------- | ----- |
| n + 3 + 4           | O(n)  |
| como máximo 5 pasos | O(1)  |
| n × n + 10          | O(n²) |
| 3n                  | O(n)  |

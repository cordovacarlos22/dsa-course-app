---
title: Reglas prácticas
order: 12
minutes: 8
---

> **Meta:** encontrar rápido el Big O de una función completa, dándole un costo a cada línea.

## El costo de cada línea

Analizar código se puede complicar si te fijas en cada detalle. Estas reglas prácticas no siempre funcionan, pero son un excelente punto de partida. Avanza paso a paso por esta función y mira cómo aparece una etiqueta de costo junto a cada línea:

```viz
trace-party-summary
```

1. **Las operaciones aritméticas son constantes.** Sumar, restar, multiplicar o dividir tarda más o menos lo mismo sin importar los números: 2 + 2 y 1,000,000 + 2 cuestan lo mismo. O(1).
2. **Asignar una variable es constante.** `x = 1000` tarda lo mismo que `x = 20000`. O(1).
3. **Acceder a un elemento por índice (en un array) o por clave (en un objeto) es constante.** `guests[0]` o `party.host`: O(1).
4. **En un bucle, el costo es el largo del bucle por el costo de lo que pasa adentro.** Este bucle corre n veces y hace trabajo O(1) cada vez, así que es n × O(1) = **O(n)**.

Suma los costos: O(1) + O(1) + O(1) + O(n) + O(1). Luego aplica las dos reglas que ya conoces (eliminar las constantes y los términos no dominantes) y obtienes **O(n)**. No necesitas memorizar estas reglas; las vas a usar tanto que se te van a quedar.

## Los bucles multiplican

```viz
trace-greet-everyone
```

La regla 4 también explica los bucles anidados. El bucle de afuera corre n veces, y esta vez el trabajo de adentro no es O(1): es **otro bucle** de n pasos. Así que el costo es n × n = **O(n²)**. Un bucle dentro de un bucle dentro de otro bucle sería n × n × n = O(n³).

Cada vez que veas un bucle, hazte dos preguntas: _¿cuántas veces corre?_ y _¿cuánto trabajo hay adentro, cada vez?_ Luego multiplica.

## Al menos 5, como máximo 5

Cuántas veces corre un bucle no siempre es obvio. Compara estas dos funciones:

```js-run
function printAtLeast5(n) {
  for (let i = 1; i <= Math.max(5, n); i++) {
    console.log(i)
  }
}

function printAtMost5(n) {
  for (let i = 1; i <= Math.min(5, n); i++) {
    console.log(i)
  }
}

printAtLeast5(3) // still prints 1 to 5
printAtLeast5(8) // prints 1 to 8
printAtMost5(3) // prints 1 to 3
printAtMost5(8) // stops at 5
```

`printAtLeast5` recorre hasta el mayor entre 5 y n. Con entradas muy pequeñas siempre imprime 5 números, pero solo nos importa lo que pasa cuando n crece: con n = 10 millones, imprime 10 millones de números, y el 5 no importa. Así que es **O(n)**.

`printAtMost5` recorre hasta el menor entre 5 y n. Con n = 2 corre dos veces, pero en cuanto n pasa de 5, **siempre** corre 5 veces: n = 1,000 o n = un millón, siguen siendo 5. Un máximo fijo es una constante, así que es **O(1)**. Esta es la misma idea con regalos para los primeros 5 invitados:

```viz
trace-give-gifts
```

Practica con estos:

| Forma del código                             | Big O |
| -------------------------------------------- | ----- |
| Un bucle de 1 a n que imprime cada número    | O(n)  |
| Un bucle hasta Math.max(n, 10)               | O(n)  |
| Un bucle hasta Math.min(n, 10)               | O(1)  |
| Un bucle sobre un array con un `if` adentro  | O(n)  |
| Un bucle dentro de otro sobre el mismo array | O(n²) |

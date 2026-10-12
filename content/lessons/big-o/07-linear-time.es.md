---
title: 'O(n): tiempo lineal'
order: 7
minutes: 6
---

> **Meta:** reconocer código O(n): trabajo que crece en proporción a la entrada.

## Imprime de 0 a n − 1

Nuestra primera notación de Big O es **O(n)**. No es la más eficiente ni la menos eficiente; empezamos con ella porque es la más fácil de entender.

Esta es una función con un bucle `for` que corre n veces e imprime `i` cada vez:

```viz
trace-print-numbers
```

Ejecútala con el número 10:

```js-run
function printNumbers(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
}

printNumbers(10)
```

Imprime del 0 al 9: **diez cosas**. Eso es O(n) en una frase: le pasamos a la función el número n, y **corrió n veces**. Pásale 10 y corre 10 veces. Pásale un millón y corre un millón de veces.

Si contaras las operaciones con exactitud, te saldría algo como 4n + 1: una comparación, una impresión y un `i++` (dos operaciones) por cada número, más `let i = 0` una vez. Pero ya sabes que la cuenta exacta no importa: crece en proporción a n, así que es O(n).

## Una línea recta

```viz
linear-boxes
```

Pongámoslo en una gráfica. Un eje es **n**, el tamaño de la entrada. El otro eje es el **número de operaciones**. O(n) es **siempre una línea recta**.

Eso es porque O(n) es **proporcional**: el número de operaciones es directamente proporcional a n. Duplica n y duplicas las operaciones; multiplica n por 10 y haces 10 veces el trabajo. Por eso O(n) también se llama **tiempo lineal**, y por eso "proporcional" es la palabra que vas a escuchar para él en las entrevistas.

A medida que avance el módulo, vamos a agregar las otras notaciones a esta misma gráfica, para que puedas compararlas entre sí.

## La misma idea con invitados

```viz
trace-welcome-all
```

`welcomeAll` imprime un mensaje de bienvenida por invitado. 3 invitados, 3 mensajes; 6 invitados, 6 mensajes. La misma forma: O(n).

Fíjate en que **n** no siempre es un número que le pasas. En `printNumbers`, n es el número mismo; en `welcomeAll`, n es el **tamaño del array**, el número de invitados. En los dos casos, n es "el tamaño de la entrada", y el trabajo crece con él.

Para reconocer O(n) en el código, busca **un bucle que recorra la entrada una vez**, haciendo una cantidad de trabajo pequeña y fija por cada elemento. Por ejemplo:

- recorrer un array para imprimir, contar o sumar sus elementos,
- encontrar el número más grande o el nombre más largo,
- buscar en una lista desordenada, como `isInvited` (en el peor caso, el nombre no está).

Un bucle que puede detenerse antes sigue contando como O(n), porque Big O es el peor caso. Y cuidado con los **bucles escondidos**: `guests.includes('Zoe')` y `guests.indexOf('Zoe')` son una sola línea cada uno, pero por dentro revisan los elementos uno por uno, así que también son O(n).

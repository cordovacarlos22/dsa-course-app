---
title: 'O(n): tiempo lineal'
order: 7
minutes: 9
---

> **Meta:** reconocer código O(n): trabajo que crece en proporción a la entrada.

## Imprime de 0 a n − 1

Nuestra primera notación de Big O es **O(n)**, que se lee "O de n". No es la más eficiente ni la menos eficiente; empezamos con ella porque es la más fácil de entender. **O(n)** significa que el trabajo crece **al mismo paso que la entrada**: si la entrada son n elementos (o el número n), el código hace unas n unidades de trabajo. Un elemento más, una unidad de trabajo más.

El código O(n) más simple es un bucle que corre una vez por cada número hasta n. Esta es una función, `printNumbers`, con un bucle `for` que corre n veces e imprime `i` cada vez. Antes de verla, predice: si le pasas 3, ¿cuántas líneas va a imprimir?

```viz
trace-print-numbers
```

**Qué acaba de pasar:** con n = 3, el bucle empezó en `i = 0` e imprimió 0, 1 y 2. Cuando `i` llegó a 3, la revisión `i < n` falló y el bucle se detuvo: 3 líneas para n = 3. Elige n = 10 y obtienes 10 líneas. El número de líneas siempre es exactamente n.

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

**Error común:** esperar que `printNumbers(10)` imprima del 1 al 10. El bucle empieza en 0 y se detiene **antes** de n, así que imprime del 0 al 9. Siguen siendo diez números, que es justo lo que promete O(n): n vueltas del bucle.

## Una línea recta

Pongámoslo en una gráfica. Un eje es **n**, el tamaño de la entrada. El otro eje es el **número de operaciones**. O(n) es **siempre una línea recta**.

Eso es porque O(n) es **proporcional**: el número de operaciones es directamente proporcional a n. Duplica n y duplicas las operaciones; multiplica n por 10 y haces 10 veces el trabajo. Por eso O(n) también se llama **tiempo lineal** ("lineal" quiere decir "en línea"), y por eso "proporcional" es la palabra que vas a escuchar para él en las entrevistas.

```viz
linear-boxes
```

**Qué acaba de pasar:** cada persona agregó un paso. 4 invitados tomaron 4 pasos, 8 invitados tomaron 8, y 16 tomaron 16. Cada punto cayó sobre la misma línea recta, porque cada persona nueva cuesta el mismo trabajo que la anterior. A medida que avance el módulo, vamos a agregar las otras notaciones a esta misma gráfica, para que puedas compararlas entre sí.

Lo proporcional tiene una prueba sencilla: divide el trabajo entre n. Si el resultado se queda más o menos igual cuando n crece, el crecimiento es lineal. Ejecútalo:

```js-run
function countSteps(n) {
  let steps = 0
  for (let i = 0; i < n; i++) {
    steps++
  }
  return steps
}

const sizes = [1000, 2000, 3000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const steps = countSteps(n)
  console.log('n =', n, '| pasos =', steps, '| pasos ÷ n =', steps / n)
}
```

La proporción se queda en 1: cada elemento cuesta un paso. Un bucle con 4 operaciones por elemento mostraría una proporción de 4, igual para cada n, y seguiría siendo una línea recta.

**Error común:** pensar que O(n) significa lento. Cuando un trabajo necesita ver cada elemento al menos una vez, como encontrar el número más grande de una lista desordenada, O(n) es lo mejor que se puede hacer. No puedes saber cuál número es el más grande sin verlos todos.

## La misma idea con invitados

Fíjate en que **n** no siempre es un número que le pasas. En `printNumbers`, n es el número mismo. Pero casi siempre, n es **el tamaño de la entrada**: el largo de un array, el número de caracteres de un texto, el número de invitados. Sea cual sea la entrada, n mide cuánto hay de ella, y el trabajo crece con él.

Este es O(n) con un array. `welcomeAll` imprime un mensaje de bienvenida por cada nombre:

```viz
trace-welcome-all
```

**Qué acaba de pasar:** con 3 invitados, el bucle imprimió 3 mensajes; con 6 invitados, 6 mensajes. El bucle recorrió el array una vez, haciendo un trabajo pequeño y fijo por cada nombre. La misma forma que `printNumbers`: O(n), donde n es el número de invitados.

Para reconocer O(n) en el código, busca **un bucle que recorra la entrada una vez**, haciendo una cantidad de trabajo pequeña y fija por cada elemento. Por ejemplo:

- recorrer un array para imprimir, contar o sumar sus elementos,
- encontrar el número más grande o el nombre más largo,
- buscar en una lista desordenada, como `isInvited` (en el peor caso, el nombre no está).

Y cuidado con los **bucles escondidos**. `guests.includes('Zoe')` y `guests.indexOf('Zoe')` son una sola línea cada uno, pero por dentro revisan los elementos uno por uno, así que también son O(n):

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Un bucle, un mensaje por nombre: O(n).
for (let i = 0; i < guests.length; i++) {
  console.log('¡Hola, ' + guests[i] + '!')
}

// Una línea cada uno, pero cada uno revisa a los invitados uno por uno: también O(n).
console.log(guests.includes('Zoe'))
console.log(guests.indexOf('Dev'))
```

**Error común:** decir que un bucle es O(1) porque puede detenerse antes. `isInvited` se detiene en cuanto encuentra el nombre, así que a veces hace una sola revisión. Pero Big O es el peor caso, y en el peor caso el nombre no está y se revisa a todos los invitados. Un bucle que puede detenerse antes sigue contando como **O(n)**.

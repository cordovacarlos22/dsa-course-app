---
title: 'O(n): tiempo lineal'
order: 5
minutes: 5
---

> **Meta:** reconocer código O(n): trabajo que crece al mismo ritmo que la entrada.

## Un paso por invitado

Empecemos con el Big O más fácil de imaginar. `welcomeAll` imprime un mensaje de bienvenida para cada invitado:

```viz
trace-welcome-all
```

El bucle corre **una vez por invitado**. Con 3 invitados imprime 3 mensajes; elige **6 invitados** e imprime 6. Si n es el número de invitados, el trabajo son n pasos. Eso es **O(n)**, que se lee "O de n".

No importa cuáles sean los nombres ni qué tan largos sean: lo que decide la cantidad de trabajo es cuántos invitados hay.

## Una línea recta

```viz
linear-boxes
```

Pon el número de invitados de un lado de una gráfica y el número de pasos del otro, y O(n) dibuja una **línea recta**. Cada vez que duplicas los invitados, los pasos también se duplican. Por eso O(n) se llama **tiempo lineal**.

Hay una palabra que vas a escuchar en las entrevistas para esto: **proporcional**. "El tiempo es proporcional al tamaño de la entrada" quiere decir O(n). No es tan bueno como quedarse plano, pero es justo: más invitados, proporcionalmente más trabajo.

## Cómo reconocer O(n)

```viz
trace-is-invited
```

Busca **un bucle** que recorra la entrada una vez, haciendo una cantidad de trabajo pequeña y fija por cada elemento. Por ejemplo:

- sumar o contar algo de cada invitado,
- encontrar el nombre más largo o el número más grande,
- buscar en una lista desordenada, como `isInvited` (peor caso: el nombre no está).

Un bucle que puede detenerse antes, como `isInvited`, sigue contando como O(n): Big O es el peor caso, y en el peor caso el nombre no está y se revisa a todos los invitados.

Cuidado con los **bucles escondidos**. `guests.includes('Zoe')` y `guests.indexOf('Zoe')` son una sola línea cada uno, pero por dentro hacen exactamente lo que muestra la animación: revisar a los invitados uno por uno. Así que también son O(n).

Prueba a cambiar este código. Agregues los invitados que agregues, el bucle visita a cada uno una vez:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

let letters = 0
for (let i = 0; i < guests.length; i++) {
  letters = letters + guests[i].length
}
console.log('Letters in all the names:', letters)
```

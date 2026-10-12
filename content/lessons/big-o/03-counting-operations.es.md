---
title: Contando operaciones
order: 3
minutes: 6
---

> **Meta:** contar las operaciones de una función y ver por qué el número exacto no importa.

## ¿Qué cuenta como una operación?

Si vamos a contar pasos, tenemos que ponernos de acuerdo en qué es un paso. Una **operación simple** es una cosa pequeña que hace la computadora:

- darle un valor a una variable (`count = 0`),
- una operación matemática (`count + 1`),
- una comparación (`i < guests.length`, `guests[i].length <= 3`).

Mira cada operación de esta función, una por una:

```viz
trace-count-short-names
```

Fíjate en los dos tipos de líneas. `let count = 0` corre **una sola vez**, sin importar cuántos invitados haya. Las líneas dentro del bucle corren **una vez por invitado**, así que entre más invitados, más veces corren. Reprodúcelo con **4 invitados**, luego elige **8** y **16** y compara los totales.

## ¿Un paso o n pasos?

Otra forma de verlo. Esta función cuenta a los invitados uno por uno:

```viz
trace-count-guests
```

Cada invitado cuesta las mismas 5 operaciones: una comparación, una suma y una asignación para `count = count + 1`, y otra suma y otra asignación para `i++`. Súmale las 3 operaciones que pasan una sola vez y obtienes **5n + 3**. Con 4 invitados son 23 operaciones; con 16 invitados, 83.

Pero JavaScript ya lleva la cuenta del tamaño de un array. `guests.length` da la misma respuesta en **1 paso**, haya 4 invitados o 4 millones:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']
console.log('Guests:', guests.length)
```

La misma respuesta, pero un crecimiento muy distinto: uno crece con n y el otro no crece nada. Esa diferencia es justo lo que captura Big O.

## Contar "a ojo"

```viz
linear-boxes
```

¿De verdad eran 5n + 3? Podrías decir que `i++` es una operación y no dos, y obtener 4n + 3. Otra persona podría contar 3n + 2. La buena noticia: **no importa**.

Todas esas tienen la misma forma. Duplica los invitados y el trabajo se duplica; los puntos quedan en línea recta. Big O es una forma de **contar a ojo**: contamos más o menos y luego nos quedamos solo con el panorama general de cómo crece la cuenta. En las siguientes lecciones vas a aprender las reglas para pasar de "5n + 3" a ese panorama general.

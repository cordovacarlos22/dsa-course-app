---
title: Por qué un cronómetro no es suficiente
order: 2
minutes: 4
---

> **Meta:** ver por qué contamos pasos en lugar de medir el código en segundos.

## Midámoslo

```viz
stopwatch-race
```

El mismo código, medido en dos computadoras. Los segundos cambian de una máquina a otra, y hasta de una ejecución a otra. El número de **pasos** nunca cambia.

Pruébalo en tu computadora. Presiona **Ejecutar** varias veces y mira cómo cambia el tiempo:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

const start = performance.now()
for (let i = 0; i < guests.length; i++) {
  const message = 'Welcome, ' + guests[i] + '!'
}
const time = performance.now() - start

console.log('Time:', time.toFixed(3), 'ms')
console.log('Steps:', guests.length)
```

## Mejor cuenta los pasos

```viz
trace-welcome-all
```

Los pasos dependen solo del **código** y del **número de invitados** (lo llamamos **n**). Eso es lo que cuenta Big O. Elige **6 invitados**: el doble de invitados, el doble de mensajes.

---
title: Por qué un cronómetro no es suficiente
order: 2
minutes: 6
---

> **Meta:** ver por qué medir el tiempo del código da respuestas poco confiables, y por qué contar pasos funciona mejor.

## Midámoslo

La forma más obvia de comparar dos versiones del mismo código es medir cuánto tardan. Este es ese experimento en dos computadoras:

```viz
stopwatch-race
```

JavaScript trae un cronómetro: `performance.now()` te da la hora actual en milisegundos. Guárdala antes de que corra el código, vuelve a mirarla después y réstalas. Presiona **Ejecutar** varias veces:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay', 'Gus', 'Hana']

const start = performance.now()
for (let i = 0; i < guests.length; i++) {
  const message = 'Welcome, ' + guests[i] + '!'
}
const time = performance.now() - start

console.log('Time:', time.toFixed(4), 'ms')
console.log('Steps:', guests.length)
```

Seguramente te salió un tiempo distinto en cada ejecución, aunque nada cambió. Ese es el primero de tres problemas con los cronómetros:

1. **La misma computadora da tiempos distintos.** Otras apps, el navegador y las optimizaciones de JavaScript cambian un poco en cada ejecución.
2. **Computadoras distintas dan tiempos distintos.** Una laptop nueva y un teléfono viejo corren el mismo código a velocidades muy diferentes. ¿Cuál es el tiempo real?
3. **El código rápido es demasiado rápido para medirlo.** Con pocos invitados, las dos versiones terminan en unos 0 ms, así que el cronómetro no puede decir cuál es mejor, aunque una de verdad lo sea.

Y ahora imagina un código que tarda una hora en correr. No quieres esperar una hora (¡dos veces!) solo para comparar dos ideas.

## Mejor cuenta los pasos

```viz
trace-welcome-all
```

Medir el tiempo no es inútil. Los desarrolladores lo hacen todo el tiempo para confirmar que un cambio de verdad ayudó. Pero para **hablar** del código necesitamos una medida que no dependa de la máquina, del día ni de cuántas pestañas tienes abiertas.

Mira el contador de la animación: `welcomeAll` envía **un mensaje por invitado**. 3 invitados → 3 mensajes, 6 invitados → 6 mensajes, en una laptop rápida o en un teléfono lento, hoy o el próximo año. El número de pasos depende solo de dos cosas: el **código** y el **tamaño de la entrada**. Al tamaño de la entrada lo llamamos **n** (aquí, el número de invitados).

Eso es lo que hace Big O. En lugar de medir el tiempo, cuenta pasos y hace una sola pregunta: _cuando n crece, ¿cómo crece el número de pasos?_

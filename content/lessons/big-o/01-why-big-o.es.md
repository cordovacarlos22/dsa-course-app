---
title: ¿Por qué Big O?
order: 1
minutes: 12
---

> **Meta:** entender por qué necesitamos una forma de comparar código y qué te va a enseñar este módulo.

## Big O es algo grande

Llegamos al primer gran tema del curso: la **notación Big O**. Es "grande" por lo mucho que importa, no porque sea largo o difícil. Casi todas las lecciones después de este módulo vuelven a él: cada estructura de datos y cada algoritmo que construyamos va a llevar una etiqueta de Big O, así que este es el marco que vamos a usar para hablar de código durante el resto del curso.

En una frase, **Big O** describe **cómo crece el trabajo que hace un código cuando crece su entrada**. No cuántos segundos tarda en tu laptop, sino la _forma_ del crecimiento: ¿el trabajo se queda igual cuando la entrada se duplica, se duplica con ella o se dispara? Esa forma es la que te deja comparar dos soluciones antes de ejecutarlas.

Una advertencia amistosa: en este módulo hay un poco de matemáticas, y una palabra que quizá no escuchas desde hace años (o nunca): **logaritmo**. No te asustes y sigue adelante. Las matemáticas solo están aquí para darnos un lenguaje común. El resto del curso no es tan matemático.

Al terminar este módulo vas a poder:

- explicar **por qué** necesitamos algo como Big O,
- describir **qué** es Big O,
- **simplificar** expresiones de Big O,
- definir la **complejidad temporal** y la **complejidad espacial**,
- encontrar la complejidad temporal y espacial de un código,
- explicar qué es un **logaritmo**.

Este es un adelanto de hacia dónde vamos:

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** cada línea de la gráfica es una forma distinta en la que puede crecer el trabajo cuando crece la entrada. La línea plana nunca crece, la línea recta crece de manera pareja, y la curva empinada se dispara tan rápido que deja atrás a las demás. Al terminar este módulo vas a conocer cada una por su nombre y vas a poder decir cuál sigue un código.

Los números hacen clara la diferencia. Ejecuta esto para comparar un trabajo que crece como n con uno que crece como n × n:

```js-run
const sizes = [10, 100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n, '| pasos con n:', n, '| pasos con n × n:', n * n)
}
```

**Error común:** intentar memorizar las formas antes de entenderlas. No vas a necesitar tarjetas de memoria. Cada forma tiene su propia lección, con código que puedes ejecutar, y al final vas a poder deducirlas por tu cuenta.

## Muchas formas de resolver el mismo problema

Casi todos los problemas de este curso tienen muchas soluciones que funcionan: no solo con otros nombres de variables o un `while` en vez de un `for`, sino con ideas completamente distintas. Toma "invertir un texto". Una solución recorre el texto de atrás hacia adelante con un bucle y arma un texto nuevo letra por letra. Otra no tiene ningún bucle propio: separa el texto en letras, las invierte con un método incluido y las vuelve a unir. Hay gente que ha publicado diez o más formas distintas de invertir un texto en JavaScript. Todas funcionan. Entonces, ¿cuál es la **mejor**?

Esa es la pregunta que responde Big O. Es un sistema para **comparar** código: para hablar de cómo se desempeña una solución junto a otra, con las mismas palabras cada vez.

Esta es la misma situación con nuestra fiesta. Estás en la puerta con la lista de invitados, e `isInvited` revisa los nombres uno por uno y se detiene en cuanto encuentra el nombre:

```viz
trace-is-invited
```

**Qué acaba de pasar:** prueba los tres nombres de arriba. Encontrar a 'Ana' toma 1 revisión, a 'Dev' toma 4, y 'Zoe', que no está en la lista, toma las 6. Fíjate en ese contador: es la cantidad de trabajo que hizo el código. La misma función hizo cantidades de trabajo muy distintas según su entrada.

Estas son las dos formas de invertir un texto del inicio de este paso. Presiona **Ejecutar**:

```js-run
function reverseWithLoop(text) {
  let reversed = ''
  for (let i = text.length - 1; i >= 0; i--) {
    reversed = reversed + text[i]
  }
  return reversed
}

function reverseWithMethods(text) {
  return text.split('').reverse().join('')
}

console.log(reverseWithLoop('hello'), reverseWithMethods('hello'))
```

**Por dentro:** `reverseWithMethods` parece un solo paso, pero son tres recorridos de las letras. `split('')` recorre el texto y arma un array con un elemento por letra. `reverse()` recorre ese array, intercambiando letras desde los dos extremos hacia el centro. Y `join('')` lo recorre una vez más para unir las letras en un texto nuevo. Son tres bucles escondidos, y cada uno crece con el largo del texto. Los métodos incluidos no son magia: alguien escribió el bucle por ti.

**Error común:** juzgar el código por lo corto que es. `reverseWithMethods` es una sola línea, pero `split`, `reverse` y `join` recorren cada letra por dentro. Menos líneas no significa menos trabajo.

## Una versión que nunca se detiene antes

Dos códigos pueden dar exactamente las mismas respuestas y aun así hacer cantidades de trabajo muy distintas. Ese es el caso de la siguiente función. Responde la misma pregunta que `isInvited`, "¿este nombre está en la lista?", pero nunca se detiene antes: incluso después de encontrar el nombre, sigue leyendo hasta el final de la lista.

¿Cómo explicarías cuál es mejor, sin decir "se siente más rápida"? En lugar de palabras vagas como "genial" o "horrible", queremos una **etiqueta**: una calificación que se pueda comparar, como la etiqueta de consumo de gasolina de un carro, que te deja comparar carros sin manejarlos. Esa etiqueta es Big O. Esta es la segunda versión:

```viz
trace-is-invited-all
```

**Qué acaba de pasar:** `isInvitedAll` puso `found = true` cuando vio el nombre… y aun así siguió leyendo. Elige **buscar a 'Ana'**: Ana va primero en la lista, y el código igual revisa los 6 nombres. `isInvited` se habría detenido después de una revisión.

Antes de ejecutarlo, predice cuántas revisiones hará cada versión para 'Ana', que va primero en la lista, y para 'Zoe', que no está en la lista. Luego ejecuta las dos versiones; cada una cuenta sus revisiones mientras avanza:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

function isInvited(name) {
  let checks = 0
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i] === name) {
      return 'encontrado después de ' + checks + ' revisiones'
    }
  }
  return 'no encontrado después de ' + checks + ' revisiones'
}

function isInvitedAll(name) {
  let checks = 0
  let found = false
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i] === name) {
      found = true
    }
  }
  if (found) {
    return 'encontrado después de ' + checks + ' revisiones'
  }
  return 'no encontrado después de ' + checks + ' revisiones'
}

console.log('isInvited:   ', isInvited('Ana'))
console.log('isInvitedAll:', isInvitedAll('Ana'))
console.log('isInvited:   ', isInvited('Zoe'))
console.log('isInvitedAll:', isInvitedAll('Zoe'))
```

Para 'Ana', es 1 revisión contra 6: `isInvited` se detuvo en cuanto pudo. Para 'Zoe', las dos hicieron 6 revisiones, porque cuando el nombre no está, hasta la versión que se detiene antes tiene que leer toda la lista. Así que detenerse antes ayuda con algunas entradas, nunca estorba, y en el peor caso las dos versiones hacen el mismo trabajo. Vas a ver esa idea otra vez en la lección del mejor caso, el caso promedio y el peor caso.

**Error común:** decidir que no importa porque la lista es corta. Con 6 invitados nunca notarías la diferencia. Con 6 millones de nombres en una base de datos, una versión puede responder al instante y la otra lee cada nombre, cada vez.

## ¿Importa, si ya funciona?

Una pregunta justa: si mi código funciona, ¿por qué me importa cuál versión es la mejor? A veces no importa. En un proyecto pequeño, la solución que logras hacer funcionar es la mejor solución. El código que funciona siempre va primero.

Pero en otras situaciones el rendimiento importa mucho, y sí existe una mejor solución:

- **Muchos datos.** En una empresa que maneja cientos de millones de registros, una versión de una función puede terminar una **hora** antes que otra, en cada corrida.
- **Intercambios.** Casi nunca es "esta siempre es genial y esa siempre es terrible". Una idea puede ser buenísima con entradas enormes y otra más constante pero más lenta al principio. Big O te da las palabras para hablar de eso.
- **Encontrar código lento.** Cuando tu código funciona pero la página va lenta o el navegador se congela, Big O te ayuda a detectar las partes ineficientes.
- **Entrevistas.** Vas a escuchar "¿Cuál es el Big O de tu solución?" o "Aquí hay tres funciones. ¿Cuál es el Big O de cada una?"

Las entrevistas importan, pero la meta real es entender tu código y poder hablar de él con claridad. Y hay una razón más por la que no basta con medir el código con un cronómetro:

```viz
stopwatch-race
```

**Qué acaba de pasar:** el mismo código corrió en una laptop rápida y en un teléfono viejo. Los tiempos fueron muy distintos, y cambiaron otra vez en una segunda corrida, aunque nada cambió en el código. Pero el número de pasos fue el mismo cada vez: solo cambió cuando cambió el número de invitados. Por eso Big O cuenta pasos, no segundos. Lo vas a explorar en la siguiente lección.

**Error común:** preocuparte por la velocidad antes de que el código funcione. Primero hazlo correcto, y luego pregúntate "¿cuál es su Big O, y puedo hacerlo mejor?" Una respuesta rápida pero equivocada sigue estando equivocada.

## Tiempo y espacio

Imagina dos códigos en una balanza: el código 1 y el código 2. Hacen el mismo trabajo, pero están escritos de forma distinta. Quizá el código 1 es más fácil de leer; quizá el código 2 tiene otras ventajas. Big O es la forma matemática de decidir cuál se ejecuta de manera más eficiente.

El código no se puede pesar, así que imagina un cronómetro. El código 1 corre en 15 segundos; el código 2 tarda mucho más. Con esa medida, el código 1 es mejor. Eso es la **complejidad temporal**. Pero en realidad no la medimos en segundos: la medimos en **número de operaciones**. Corre el mismo código en una computadora más rápida y termina antes, pero hace exactamente el mismo número de operaciones. Así que su complejidad temporal es la misma en cualquier computadora.

Big O también mide la **complejidad espacial**: cuánta **memoria** usa el código. Digamos que el código 1 termina en 15 segundos pero usa mucha memoria, mientras que el código 2 tarda un minuto completo pero usa muy poca. Si lo que más te importa es la memoria, el código 2 es el mejor.

```viz
memory-boxes
```

**Qué acaba de pasar:** contar a los invitados necesitó una sola caja de memoria, el contador, ya fueran 3 invitados o 6, y seguiría siendo una sola caja con 6 millones. Hacer un gafete para cada nombre de la lista necesitó una caja nueva por nombre, así que la memoria creció con la lista. Los mismos invitados, dos trabajos, y dos cantidades muy distintas de memoria extra.

Estos son los dos trabajos en código:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Una caja extra, sin importar cuántos invitados haya:
let count = 0
for (let i = 0; i < guests.length; i++) {
  count = count + 1
}
console.log('Invitados:', count)

// Un gafete nuevo por cada nombre:
const nameTags = []
for (let i = 0; i < guests.length; i++) {
  nameTags.push('Hola, me llamo ' + guests[i])
}
console.log(nameTags)
```

Nos vamos a enfocar sobre todo en el tiempo, pero el espacio también sale en las entrevistas: _"Muy bien, lo optimizaste en tiempo. ¿Y si nos importa más la memoria? ¿Cómo lo escribirías?"_ Así que vas a aprender las dos.

**Error común:** pensar que la complejidad temporal se mide en segundos. Los segundos dependen de la computadora. La complejidad temporal cuenta **operaciones**, que solo dependen del código y del tamaño de su entrada.

---
title: ¿Por qué Big O?
order: 1
minutes: 9
---

> **Meta:** entender por qué necesitamos una forma de comparar código y qué te va a enseñar este módulo.

## Big O es algo grande

```viz
big-o-growth-chart
```

Bienvenido al primer gran tema del curso: la **notación Big O**. Es "grande" por lo mucho que importa, no porque sea largo o difícil. Casi todas las lecciones después de este módulo vuelven a él: cada estructura de datos y cada algoritmo que construyamos va a llevar una etiqueta de Big O, así que este es el marco que vamos a usar para hablar de código durante el resto del curso.

Una advertencia amistosa: en este módulo hay un poco de matemáticas, y una palabra que quizá no escuchas desde hace años (o nunca): **logaritmo**. No te asustes y sigue adelante. Las matemáticas solo están aquí para darnos un lenguaje común. El resto del curso no es tan matemático.

Al terminar este módulo vas a poder:

- explicar **por qué** necesitamos algo como Big O,
- describir **qué** es Big O,
- **simplificar** expresiones de Big O,
- definir la **complejidad temporal** y la **complejidad espacial**,
- encontrar la complejidad temporal y espacial de un código,
- explicar qué es un **logaritmo**.

La gráfica de arriba es un adelanto: cada línea es una forma distinta en la que puede crecer el trabajo cuando crece la entrada. Al final vas a conocer cada una por su nombre.

## Muchas formas de resolver el mismo problema

Casi todos los problemas de este curso tienen muchas soluciones que funcionan: no solo con otros nombres de variables, sino con ideas completamente distintas. Toma "invertir un texto". Estas son dos formas de hacerlo. Presiona **Ejecutar**:

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

Hay gente que ha publicado diez o más formas distintas de invertir un texto en JavaScript. Todas funcionan. Entonces, ¿cuál es la **mejor**?

Esta es la misma situación con nuestra fiesta. Estás en la puerta con la lista de invitados, e `isInvited` revisa los nombres uno por uno y se detiene en cuanto encuentra el nombre:

```viz
trace-is-invited
```

Prueba los tres nombres de arriba. Encontrar a 'Ana' toma 1 revisión, a 'Dev' toma 4, y 'Zoe', que no está invitada, toma las 6. Fíjate en ese contador: es la cantidad de trabajo que hizo el código.

## Una versión que nunca se detiene antes

Esta es una segunda versión. Da exactamente las mismas respuestas:

```viz
trace-is-invited-all
```

`isInvitedAll` pone `found = true` cuando ve el nombre… y aun así sigue leyendo. Elige **buscar a 'Ana'**: Ana es la primera invitada, y el código igual revisa los 6 nombres.

Las dos funciones son correctas, y con 6 invitados nunca notarías la diferencia. Pero una hace menos trabajo. ¿Cómo explicarías cuál es mejor, sin decir "se siente más rápida"? En lugar de palabras vagas como "genial" o "horrible", queremos una **etiqueta**: una calificación que se pueda comparar, como la etiqueta de consumo de gasolina de un carro, que te deja comparar carros sin manejarlos. Esa etiqueta es Big O.

## ¿Importa, si ya funciona?

```viz
stopwatch-race
```

Una pregunta justa: si mi código funciona, ¿por qué me importa cuál versión es la mejor? A veces no importa. En un proyecto pequeño, la solución que logras hacer funcionar es la mejor solución.

Pero en otras situaciones importa mucho:

- **Muchos datos.** En una empresa que maneja cientos de millones de registros, una versión de una función puede ahorrar una **hora** cada vez que se ejecuta.
- **Intercambios.** Casi nunca es "esta siempre es genial y esa siempre es terrible". Una idea puede ser buenísima con entradas enormes y otra más constante. Big O te da las palabras para hablar de eso.
- **Encontrar código lento.** Cuando tu código funciona pero la página va lenta o el navegador se congela, Big O te ayuda a detectar las partes ineficientes.
- **Entrevistas.** Vas a escuchar "¿Cuál es el Big O de tu solución?" o "Aquí hay tres funciones. ¿Cuál es el Big O de cada una?"

Las entrevistas importan, pero la meta real es entender tu código y poder hablar de él con claridad.

## Tiempo y espacio

```viz
memory-boxes
```

Imagina dos códigos en una balanza: el código 1 y el código 2. Hacen el mismo trabajo, pero están escritos de forma distinta. Quizá el código 1 es más fácil de leer; quizá el código 2 tiene otras ventajas. Big O es la forma matemática de decidir cuál se ejecuta de manera más eficiente.

El código no se puede pesar, así que imagina un cronómetro. El código 1 corre en 15 segundos; el código 2 tarda mucho más. Con esa medida, el código 1 es mejor. Eso es la **complejidad temporal**. Pero en realidad no la medimos en segundos: la medimos en **número de operaciones**. Corre el mismo código en una computadora más rápida y termina antes, pero hace exactamente el mismo número de operaciones. Así que su complejidad temporal es la misma en cualquier computadora.

Big O también mide la **complejidad espacial**: cuánta **memoria** usa el código. Digamos que el código 1 termina en 15 segundos pero usa mucha memoria, mientras que el código 2 tarda un minuto completo pero usa muy poca. Si lo que más te importa es la memoria, el código 2 es el mejor.

Nos vamos a enfocar sobre todo en el tiempo, pero el espacio también sale en las entrevistas: _"Muy bien, lo optimizaste en tiempo. ¿Y si nos importa más la memoria? ¿Cómo lo escribirías?"_ Así que vas a aprender las dos.

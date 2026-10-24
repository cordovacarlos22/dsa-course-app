---
title: Te damos la bienvenida al curso
order: 1
minutes: 10
---

> **Meta:** saber qué son las estructuras de datos y los algoritmos, cómo funciona cada lección y qué vas a poder hacer al final.

## ¿Para quién es este curso?

Las estructuras de datos y algoritmos, o **DSA** por sus siglas en inglés, son la caja de herramientas que usa cualquier persona que programa, lo sepa o no. Una **estructura de datos** es una forma de organizar los datos para que algunos trabajos con ellos sean rápidos: un array guarda los elementos en orden, un objeto encuentra un valor por su clave, y una lista enlazada (que vas a construir tú) hace que agregar al inicio sea barato. Un **algoritmo** es una lista de pasos que resuelve un trabajo: revisar si un nombre está en una lista, ordenar esa lista o encontrar la ruta más corta entre dos lugares en un mapa.

Ya usas las dos cosas todos los días. La app de contactos busca en una lista mientras escribes, una app de música ordena las canciones por título, y una app de mapas corre un algoritmo de camino más corto cada vez que le pides direcciones. Saber cómo funcionan estas herramientas, y cuánto cuesta cada una, es lo que te deja elegir la correcta en vez de la primera que se te ocurre. Y es justo lo que evalúan las **entrevistas técnicas**.

Este curso es para ti si:

- aprendiste a programar por tu cuenta y nunca tuviste una clase formal de ciencias de la computación,
- estudias ciencias de la computación y quieres que DSA por fin te _haga clic_,
- estás cambiando de carrera hacia el mundo tech y necesitas bases sólidas, rápido,
- o tienes una entrevista técnica cerca y quieres llegar con confianza.

Solo necesitas JavaScript básico: variables, funciones, bucles y arrays. No necesitas experiencia con estructuras de datos ni algoritmos: aprenderlos es justo para lo que existe el curso. Las clases las vemos en el módulo de Clases y punteros, justo antes de que construyas tu primera estructura de datos.

Aquí tienes un ejemplo chiquito de las dos ideas a la vez. El array es la estructura de datos; el bucle que encuentra el nombre más largo es el algoritmo. Presiona **Ejecutar**:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev'] // una estructura de datos: un array

// un algoritmo: los pasos para encontrar el nombre más largo
let longest = guests[0]
for (let i = 1; i < guests.length; i++) {
  if (guests[i].length > longest.length) {
    longest = guests[i]
  }
}
console.log('El nombre más largo es', longest)
```

Esos cuatro invitados van a aparecer mucho. Casi todos los ejemplos del curso pasan en una fiesta: una lista de invitados, una fila en la puerta, gafetes con nombres. Una sola historia hace más fácil enfocarte en la idea nueva en vez de en un ejemplo nuevo.

**Por qué importa la herramienta correcta.** Muchas veces el mismo trabajo se puede hacer con distintas estructuras de datos, y no cuestan lo mismo. Imagina que en la puerta te preguntan: "¿Dev está en la lista?". Con un array, la única forma de saberlo es revisar los nombres uno por uno hasta encontrar a Dev o quedarte sin nombres. Con un objeto que tiene una clave por cada nombre, pides la clave `Dev` directamente: una sola consulta, sin importar qué tan larga sea la lista. Ejecuta las dos formas y compara cuántas revisiones hace cada una:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev']

// Forma 1: un array. Revisa los nombres uno por uno.
let checks = 0
let isOnList = false
for (let i = 0; i < guests.length; i++) {
  checks++
  if (guests[i] === 'Dev') {
    isOnList = true
    break
  }
}
console.log('Array: ¿Dev está en la lista?', isOnList, '| revisiones:', checks)

// Forma 2: un objeto con una clave por cada nombre. Pide la clave directamente.
const guestBook = { Ana: true, Ben: true, Cleo: true, Dev: true }
console.log('Objeto: ¿Dev está en la lista?', guestBook['Dev'] === true, '| revisiones: 1')
```

El array necesitó 4 revisiones, porque Dev iba al final. Con 4,000 nombres y Dev todavía al final, necesitaría 4,000. El objeto respondió con una sola consulta en los dos casos. Eso no hace que los objetos sean mejores que los arrays: un array guarda los nombres **en orden**, y un objeto no. Saber para qué es buena cada herramienta, y cuánto cuesta cada trabajo con ella, es todo el juego. El módulo de Big O de arrays y objetos mide exactamente esto.

**Error común:** pensar que DSA es solo para entrevistas, o solo para "gente de matemáticas". Es para cualquiera que escriba código que tenga que manejar muchos datos, y las matemáticas que vas a necesitar caben en una página. Cada idea se enseña con pasos pequeños e imágenes.

## Cómo funciona una lección

Cada lección es una serie corta de **pasos**, y solo pasas al siguiente después de demostrar que entendiste este. Es a propósito: leer algo se siente como aprender, pero **usarlo** enseguida (responder una pregunta, escribir unas líneas) es lo que hace que se quede. Cada paso sigue el mismo orden:

1. **La teoría:** unos párrafos cortos que explican la idea en lenguaje sencillo, con las palabras clave en **negritas**.
2. **Una animación** que controlas paso a paso, para que _veas_ moverse un algoritmo en lugar de imaginarlo.
3. **Qué acaba de pasar:** un recorrido por lo que mostró la animación.
4. **Código que puedes ejecutar** aquí mismo, en la página.
5. **Un error común** que conviene evitar, cuando el tema tiene uno.
6. **Una comprobación rápida al final:** una pregunta de opción múltiple, una pequeña tarea de código o una caja de **"Explícalo con tus palabras"**, donde escribes la idea con tus propias palabras, la comparas con una respuesta modelo y marcas los puntos que cubriste. El botón **Siguiente** se desbloquea cuando la pasas. ¿Te atascaste? Un intento fallido te muestra una pista, y después de 3 intentos puedes ver la respuesta.

Esta es una animación del módulo de Big O. Presiona el botón de reproducir, o avanza con las flechas. No te preocupes por las palabras que usa; van a tener sentido más adelante:

```viz
search-cases
```

**Qué acaba de pasar:** la animación revisó una lista de invitados un nombre a la vez, buscando un nombre. Cuando el nombre estaba primero, tomó una revisión. Cuando el nombre no estaba, tuvo que revisar a todos los invitados. Esa diferencia, cuánto trabajo hace el mismo código con distintas entradas, es de lo que trata el módulo de Big O.

Ahora probemos ejecutar código. Cambia el nombre y presiona **Ejecutar**:

```js-run
const name = 'Ada'
console.log('¡Hola ' + name + '! Te damos la bienvenida al curso.')
```

Después de presionar Ejecutar, la caja **repite** lo que pasó: tu código aparece con números de línea, y la salida aparece una línea a la vez, cada una con una etiqueta de la línea de código que la imprimió. Presiona **Repetir** para verlo otra vez, **Paso** para avanzar una línea a la vez, **Mostrar todo** para verlo completo, o **Editar** para cambiar el código y volver a ejecutarlo. La lección de cómo ejecutar código lo muestra todo con detalle.

Eso es todo: sin configuración, sin instalar nada. Vas a escribir mucho código así.

Después de las lecciones, cada módulo tiene un **cuestionario** para comprobar lo que aprendiste, además de **ejercicios** para practicar: ejercicios **Constrúyelo**, donde escribes tú la estructura de datos o el algoritmo del módulo, y **Problemas de entrevista** al estilo de LeetCode. Puedes tomarte el tiempo, como en una entrevista real. Pronto también tendrás un **tutor de IA** para hacerle preguntas, pedirle pistas cuando te atasques y recibir comentarios sobre tu código.

**Error común:** presionar reproducir en una animación y dejar de mirar. Las animaciones avanzan un paso pequeño a la vez a propósito. Lee cada texto, y si algo te sorprendió, regresa un paso y míralo otra vez.

## El camino por delante

El curso empieza con **algoritmos y formas de pensar**, no con estructuras de datos. Puede parecer al revés, pero es lo que hace más fácil todo lo que viene después. Big O te da las palabras para comparar dos códigos cualesquiera. Un método para resolver problemas te da un plan cuando ves un problema que nunca has resuelto. Así, cuando construyas una estructura de datos, ya sabes cómo juzgarla y cómo atacar su código.

Es porque cada tema **se apoya** en los anteriores. Aquí tienes unos ejemplos de lo que ya vas a necesitar cuando llegues a un tema:

| Para aprender…          | vas a usar…                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| Listas enlazadas        | clases, punteros, y Big O para comparar sus métodos                           |
| Merge sort y quick sort | recursión, y Big O para ver por qué les ganan a los ordenamientos más simples |
| Tablas hash             | arrays, y el Big O de los objetos                                             |
| Algoritmos de grafos    | pilas, colas, heaps y tablas hash                                             |
| Programación dinámica   | recursión, y objetos o arrays que guardan respuestas que ya calculaste        |

Por eso también merge sort y quick sort llegan después de los ordenamientos más simples: casi siempre son mucho más eficientes, pero son más difíciles de escribir, y los dos se construyen con recursión.

Este es el mapa, en orden:

| Sección                     | Qué vas a aprender                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fundamentos**             | Big O (cómo medir si tu código es eficiente) y el Big O de arrays y objetos                                                                                                                             |
| **Resolución de problemas** | Un método de 5 pasos para cualquier problema, patrones comunes (contador de frecuencias, dos punteros, ventana deslizante, dividir y conquistar) y recursión                                            |
| **Búsqueda y ordenamiento** | Búsqueda lineal y binaria, y luego seis ordenamientos: bubble, selection, insertion, merge, quick y radix                                                                                               |
| **Estructuras de datos**    | Clases y punteros, y luego listas enlazadas, listas doblemente enlazadas, pilas y colas, árboles binarios de búsqueda, recorridos de árboles (en anchura y en profundidad), heaps, tablas hash y grafos |
| **Algoritmos de grafos**    | Recorrer todos los nodos de un grafo (en anchura y en profundidad) y el camino más corto de Dijkstra                                                                                                    |
| **Programación dinámica**   | Resolver problemas grandes reutilizando las respuestas de problemas más pequeños                                                                                                                        |
| **Práctica de entrevistas** | Los problemas con arrays que más preguntan en las entrevistas                                                                                                                                           |

Es mucho, y algunos temas asustan de lejos. Por eso cada uno está dividido en pasos pequeños, con una animación cada vez que una imagen ayuda más que las palabras.

### Al terminar el curso

- Vas a analizar la **complejidad temporal y espacial** de cualquier código con Big O.
- Vas a tener un **método** para resolver problemas que nunca has visto.
- Vas a **construir** desde cero listas enlazadas, pilas, colas, árboles, tablas hash, grafos y heaps.
- Vas a **entender** el ordenamiento, la recursión y la programación dinámica en lugar de memorizarlos.
- Vas a **resolver** problemas estilo LeetCode y explicar tu razonamiento en voz alta en tus entrevistas.

**Error común:** saltar directo al tema más difícil porque es el que más mencionan las entrevistas. Los grafos y la programación dinámica se apoyan en todo lo anterior: Big O, la recursión y las estructuras de datos. Ir en orden es el camino rápido.

## Conoce a tu instructor

¡Hola, soy Carlos! Soy ingeniero de software y aprendí todo esto por el camino largo: terminé mi carrera de Ingeniería en Computación mientras trabajaba tiempo completo como chofer de tráiler e instructor de choferes, estudiando entre turnos. Entrenar a choferes nuevos me enseñó que cualquier habilidad difícil se vuelve fácil cuando la divides en pasos pequeños y claros. Así funciona cada lección de este curso, y voy a estar contigo todo el camino.

Construí este curso como me hubiera gustado aprender DSA: con imágenes que se mueven, código que puedes ejecutar sin instalar nada, y una comprobación después de cada paso para que siempre sepas dónde estás. Si algo no te hace clic, no es señal de que esto no sea para ti. Casi siempre significa que faltó un paso, así que regresa un paso, vuelve a ver la animación y pregúntale al tutor.

En resumen:

- **DSA** = estructuras de datos (formas de organizar los datos) más algoritmos (pasos que resuelven un trabajo).
- El mismo trabajo puede costar muy distinto con distintas herramientas, como un array revisado nombre por nombre contra un objeto que responde con una sola consulta.
- Las lecciones son pasos cortos: la teoría, una animación, código ejecutable (que puedes ver repetirse línea por línea) y una comprobación al final de cada paso: una pregunta, una tarea de código o una explicación con tus palabras.
- Cada módulo termina con un cuestionario y ejercicios: Constrúyelo y problemas de entrevista.
- Empezamos por los fundamentos (Big O) y un método para resolver problemas, porque todo lo demás se construye sobre ellos. Las clases y los punteros llegan justo antes de las estructuras de datos que los usan.

Al final del módulo, el **cuestionario del Módulo 1**, en la página del módulo, repasa todo junto.

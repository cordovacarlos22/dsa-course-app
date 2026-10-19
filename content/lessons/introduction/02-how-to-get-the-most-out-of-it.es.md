---
title: Cómo sacarle el máximo provecho a este curso
order: 2
minutes: 6
---

> **Meta:** entender por qué el curso empieza con Big O, por qué las clases y los punteros van antes de las estructuras de datos, y armar una rutina de estudio que funcione.

## "¿Puedo saltar directo al código?"

Puedes. Si solo quieres escribir código, ve directo a la sección de Estructuras de datos. Pero dos temas cortos hacen que todo lo que hay ahí sea más fácil: Big O, que viene ahora, y las clases y los punteros, que abren esa sección. Te explico por qué.

### Por qué Big O va primero

Imagina que estás construyendo una app y lo más importante que hace es **quitar el último elemento** de una lista, miles de veces por segundo. Podrías guardar la lista como una **lista enlazada simple** o como una **lista doblemente enlazada**. ¿Cuál eliges?

Resulta que la lista doblemente enlazada es _mucho_ más rápida en esa tarea. Verás por qué en el módulo de Listas Doblemente Enlazadas. Lo que importa ahora es _cómo_ las vamos a comparar: con **Big O**, el lenguaje que usan los programadores para hablar de eficiencia.

Hay tres razones para aprenderlo primero:

1. **Todos los temas lo usan.** Para cada estructura de datos y algoritmo del curso nos vamos a preguntar: "¿Cuál es su Big O?"
2. **Te ayuda a elegir.** Escoger la estructura de datos correcta para un trabajo significa comparar su Big O.
3. **En las entrevistas siempre lo preguntan.** En una entrevista técnica, casi seguro te van a pedir el Big O de tu solución.

## Por qué importan las clases y los punteros

Cada estructura de datos de este curso se construye como una **clase**. Una lista enlazada, por ejemplo, es una clase `LinkedList` con métodos como `push` y `pop`. Por eso necesitas lo básico de las clases antes de construir una, y por eso la sección de Estructuras de datos empieza con un módulo corto de Clases y punteros.

Los **punteros** son la otra idea clave, y confunden a mucha gente. Un error común: mirar el diagrama de una lista enlazada y llamar "head" a la primera caja y "tail" a la última. En realidad, `head` y `tail` **no** son las cajas (los nodos). Son **variables que apuntan a** nodos.

Ejecuta este pequeño ejemplo. Creamos un nodo, hacemos que `head` y `tail` apunten a él y luego agregamos un segundo nodo al final:

```js-run
const firstNode = { value: 4, next: null }
let head = firstNode
let tail = firstNode
console.log('¿head y tail apuntan al mismo nodo?', head === tail)

// Agregamos un nodo nuevo al final de la cadena:
const newNode = { value: 7, next: null }
tail.next = newNode // 1. el último nodo actual apunta al nuevo
tail = newNode // 2. tail se mueve al nodo nuevo

console.log('head apunta al nodo con', head.value)
console.log('tail apunta al nodo con', tail.value)
console.log('el nodo después de head tiene', head.next.value)
```

Fíjate que `head` nunca se movió: sigue apuntando al primer nodo. Solo se movió `tail`, porque `tail` es un puntero, y los punteros se pueden mover a otro nodo. Vas a aprender exactamente cómo funciona esto en el módulo de Clases y punteros.

## Tu rutina de estudio

La forma más rápida de aprender DSA es **practicar justo después de aprender**:

1. Lee la lección y juega con cada animación y cada caja de código. Cambia el código y ejecútalo otra vez.
2. Al final del módulo, haz el **cuestionario**.
3. Luego haz los **ejercicios con tiempo**. Escribe el código tú mismo, aunque al principio te parezca lento.

No dejes toda la práctica para el final del curso. Un poco de práctica después de cada módulo se te queda mucho mejor que mucha práctica meses después.

En resumen:

- **Big O** es cómo comparamos código. Todos los temas lo usan, te ayuda a elegir estructuras de datos y en las entrevistas lo preguntan.
- Cada estructura de datos es una **clase**.
- `head` y `tail` son **punteros** a nodos, no los nodos en sí.
- Practica justo después de cada módulo.

Cuando termines este módulo, el **cuestionario del Módulo 1** te espera en la página del módulo.

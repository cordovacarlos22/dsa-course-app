---
title: Por qué necesitas un método
order: 1
minutes: 9
---

> **Meta:** saber qué es un algoritmo, por qué resolver problemas nuevos es una habilidad que se aprende, y conocer los 5 pasos que vas a usar el resto del curso.

## ¿Qué es un algoritmo?

"Algoritmo" es una de esas palabras que oyes por todos lados. Una app de música tiene un algoritmo que elige tu siguiente canción, una app de mapas tiene uno que elige tu ruta, y cada red social tiene uno que decide qué publicaciones ves primero. La palabra suena elegante, pero su significado es sencillo: un **algoritmo** es una **lista de pasos que hace un trabajo**. Eso es todo.

Así que los pasos para encontrar los primeros 100 números primos son un algoritmo. También lo son los pasos que sigue una red social para ordenar millones de publicaciones, construidos por equipos grandes durante muchos años. Y también lo es un bucle de tres líneas: `isInvited`, del módulo de Big O, que revisa la lista de invitados nombre por nombre, también es un algoritmo. Casi cualquier tarea se puede resolver con **muchos algoritmos distintos**, y Big O es la forma de compararlos.

Casi todo lo que haces al programar involucra un algoritmo, desde una pequeña función de ayuda hasta una app completa. En este curso nos enfocamos en un tipo más específico: problemas que puedes resolver con una función, de los que salen en las **entrevistas de programación** y en el código de todos los días. La buena noticia es que lo que aprendes con problemas pequeños te sirve para los grandes.

```viz
trace-is-invited
```

**Qué acaba de pasar:** `isInvited` siguió un conjunto fijo de pasos: empezar con el primer nombre de la lista, compararlo, pasar al siguiente, y detenerse cuando encuentra el nombre o se le acaba la lista. Esos pasos son el algoritmo. Otro algoritmo podría ordenar la lista primero y luego saltar como en la búsqueda binaria: la misma tarea, pasos distintos y un Big O distinto.

Aquí tienes otro algoritmo que puedes ejecutar. Encuentra los primeros 10 **números primos** (números mayores que 1 que solo se pueden dividir exactamente entre 1 y entre sí mismos):

```js-run
function isPrime(number) {
  if (number < 2) return false
  for (let i = 2; i < number; i++) {
    if (number % i === 0) return false // se divide exacto: no es primo
  }
  return true
}

const primes = []
let candidate = 2
while (primes.length < 10) {
  if (isPrime(candidate)) primes.push(candidate)
  candidate++
}
console.log(primes)
```

Esta es una forma de hacerlo, no la única. Por ejemplo, `isPrime` no necesita probar todos los números menores que `number`: podría detenerse mucho antes y llegar a la misma respuesta con menos pasos. Vas a ver esa idea una y otra vez en este curso. Casi nunca hay un solo algoritmo para una tarea, y parte del trabajo es elegir uno bueno.

**Error común:** pensar que un algoritmo tiene que ser algo grande e ingenioso. Un bucle que cuenta los nombres cortos de una lista de invitados es un algoritmo. La habilidad está en elegir buenos pasos, no pasos complicados.

## Resolver problemas es una habilidad

Aprender la sintaxis de un lenguaje toma tiempo, pero es la parte fácil. Puedes seguir un tutorial, copiar un patrón o reconstruir una app paso a paso. Lo difícil llega cuando te enfrentas a un problema **que nunca has visto** y nadie te da los pasos. Eso es exactamente una entrevista de programación: un problema nuevo, un reloj, y alguien mirando cómo piensas.

Es fácil creer que algunas personas simplemente nacen buenas para esto. Es cierto que a algunas les cuesta menos, como con cualquier cosa. Pero resolver problemas **se puede aprender**. Es común que alguien se congele por completo en su primera entrevista de práctica y que, un par de semanas después, resuelva con calma un problema nuevo igual de difícil. Su talento no cambió en dos semanas. Lo que cambió es que ahora tenía un plan que seguir.

Así que hay dos formas de mejorar:

1. **Tener un plan para resolver problemas.** Una lista de pasos que seguir cuando te atascas, para que nunca te quedes viendo una pantalla en blanco. Eso es este módulo.
2. **Dominar los patrones comunes.** Muchos problemas de entrevista pertenecen a familias, y cada familia tiene una receta que puedes usar una y otra vez: contadores de frecuencia, punteros múltiples, ventanas deslizantes y más. Eso es el siguiente módulo.

Las dos sirven mucho más allá de las entrevistas. Cada funcionalidad que vayas a construir empieza como un problema que todavía no has resuelto, así que un método para problemas nuevos es un método para toda tu carrera.

**Error común:** memorizar cientos de soluciones en vez de aprender a encontrar una. Una respuesta memorizada se rompe en cuanto quien te entrevista cambia un detalle. Un método sigue funcionando.

## Los 5 pasos

Este es el plan. No es magia, no es infalible y no va a resolver el problema por ti. Lo que hace es darte algo concreto que hacer después, cada vez, para que te mantengas tranquilo y sigas avanzando. Muchas de estas ideas vienen de un libro clásico sobre resolver problemas, _How to Solve It_ ("Cómo plantear y resolver problemas"), que escribió el matemático **George Pólya** en 1945. Lo escribió para problemas de matemáticas, pero funciona igual de bien para el código.

Los cinco pasos son:

1. **Entender el problema**
2. **Explorar ejemplos concretos**
3. **Dividirlo en pasos**
4. **Resolverlo, o simplificarlo**
5. **Revisar y refactorizar**

```viz
five-steps
```

**Qué acaba de pasar:** los cinco pasos se encendieron uno a la vez, en el orden en que los vas a usar. Los dos primeros tratan de entender: qué entra, qué sale y cuáles son los casos raros. El tercero es un plan. Solo el cuarto paso escribe el código de verdad, y el quinto lo mejora.

Cada paso tiene su propia lección en este módulo, y vamos a usar los mismos dos ejemplos todo el tiempo: sumar dos números y contar los caracteres de un string. En la última lección vas a juntar los cinco pasos como lo harías en una entrevista. Y los vas a seguir usando después de este módulo: en el módulo de Listas enlazadas, cada método que construyas sigue estos mismos cinco pasos.

**Error común:** saltar directo al paso 4. Escribir código de inmediato se siente rápido, pero el código que escribes antes de entender el problema es el más lento de todos: terminas reescribiéndolo.

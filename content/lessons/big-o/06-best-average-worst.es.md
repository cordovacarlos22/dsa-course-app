---
title: Mejor caso, caso promedio y peor caso
order: 6
minutes: 12
---

> **Meta:** saber qué describen Ω, Θ y O, y por qué Big O siempre significa el peor caso.

## ¿Dónde está el elemento?

Cuando trabajas con esta notación, aparecen una y otra vez tres letras griegas: **omega (Ω)**, **theta (Θ)** y **ómicron (O)**. Ya conoces a ómicron por su nombre de todos los días, **O**: la O de Big O. Es la que más vas a ver.

¿Por qué tres? Porque el mismo código puede hacer cantidades de trabajo muy distintas según su entrada. Imagina un array de números, del 1 al 7, y un bucle que lo recorre hasta encontrar el número que buscas. El código nunca cambia, pero **dónde** está el número decide qué tan larga es la caminata:

- Buscar el 1 toma la menor cantidad de vueltas: es el primer elemento. Ese es el **mejor caso**: la entrada que hace que el código trabaje lo menos posible.
- Buscar el 7 obliga al bucle a recorrer todos los elementos. Ese es el **peor caso**: la entrada que hace que el código trabaje lo más posible.
- Algo más o menos en el medio, como el 4, es el **caso promedio**: lo que puedes esperar casi siempre.

Cada caso tiene su propia letra:

| Caso     | Letra     | También se llama | En palabras simples                                             |
| -------- | --------- | ---------------- | --------------------------------------------------------------- |
| Mejor    | Ω (omega) | límite inferior  | lo más rápido que puede correr el código, en la mejor situación |
| Promedio | Θ (theta) | límite ajustado  | lo que puedes esperar en general                                |
| Peor     | O (big O) | límite superior  | lo más lento que puede correr el código, en la peor situación   |

Un **límite** es un tope. El límite inferior dice "no puede ir más rápido que esto"; el límite superior dice "no puede ir más lento que esto". Esta es la misma idea con nuestra lista de invitados:

```viz
search-cases
```

**Qué acaba de pasar:** `isInvited` leyó la lista desde el principio cada vez. Cuando el nombre estaba primero, lo encontró en 1 revisión: el mejor caso, Ω. Cuando el nombre estaba en el medio, tomó más o menos la mitad de la lista: el caso promedio, Θ. Cuando el nombre no estaba en la lista, revisó a todos los invitados: el peor caso, O.

Ahora con los números del 1 al 7. Cada llamada cuenta cuántos pasos da el bucle:

```js-run
const numbers = [1, 2, 3, 4, 5, 6, 7]

function stepsToFind(target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i + 1
    }
  }
  return numbers.length
}

console.log('Buscar el 1:', stepsToFind(1), 'paso') // mejor caso
console.log('Buscar el 4:', stepsToFind(4), 'pasos') // caso promedio
console.log('Buscar el 7:', stepsToFind(7), 'pasos') // peor caso
```

**Error común:** pensar que "mejor caso" significa "el mejor algoritmo". Los tres casos describen **un solo** código con distintas entradas. Para comparar dos algoritmos, comparas el mismo caso de cada uno, casi siempre el peor.

## Big O es el peor caso

Así que **Big O siempre es el peor caso**. Vas a escuchar seguido preguntas como "Muy bien, ¿y cuál es el Big O en el mejor caso?". Técnicamente eso no existe: el mejor caso es **omega** y el caso promedio es **theta**. Cuando medimos Big O, siempre medimos el peor caso.

¿Por qué enfocarse en el peor caso? Porque es una **promesa**: sea cual sea la entrada, el código nunca va a ser más lento que esto. Una búsqueda que casi siempre es rápida pero a veces lee un millón de elementos **va a** leer un millón de elementos algún día, para una persona real. Planear para el peor caso significa no tener sorpresas. También es el caso más fácil de acordar. El caso promedio depende de qué entradas son probables, y eso cambia de una app a otra. El peor caso solo depende del código.

Mira cómo pasa el peor caso:

```viz
trace-is-invited
```

**Qué acaba de pasar:** elige **buscar a 'Zoe'**. 'Zoe' no está en la lista, así que se revisó a todos los invitados antes de que la función pudiera regresar `false`. Ese es el peor caso de `isInvited`, y son n revisiones para n invitados, así que `isInvited` es **O(n)**.

Estos son los tres casos de `isInvited`, escritos con esta notación:

- **Mejor caso, Ω(1):** el nombre es el primero de la lista. Una revisión, sin importar qué tan larga sea la lista.
- **Caso promedio, Θ(n):** en promedio el nombre está en algún punto del medio, así que unas n / 2 revisiones. Quita el ½ y crece como n.
- **Peor caso, O(n):** el nombre no está, así que se revisa a los n invitados.

Puedes comprobar el promedio tú. Esto busca cada nombre de la lista, uno a la vez, y saca el promedio de las revisiones:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli', 'Fay']

function checksToFind(name) {
  for (let i = 0; i < guests.length; i++) {
    if (guests[i] === name) {
      return i + 1
    }
  }
  return guests.length
}

let totalChecks = 0
for (let i = 0; i < guests.length; i++) {
  totalChecks = totalChecks + checksToFind(guests[i])
}
console.log('Mejor caso:', checksToFind('Ana'), 'revisión')
console.log('Promedio para un nombre de la lista:', totalChecks / guests.length, 'revisiones') // unas n / 2
console.log('Peor caso:', checksToFind('Zoe'), 'revisiones')
```

Con 6 invitados, el promedio es 3.5 revisiones: más o menos la mitad de la lista. Duplica a los invitados y el promedio también se duplica, y por eso el caso promedio sigue siendo Θ(n).

Eso no quiere decir que los otros casos no sirvan. Cuando analices código, piensa en los tres: el mejor caso, lo que pasa normalmente y el peor caso. Pero cuando alguien te pregunte "el Big O", dale el peor caso.

**Por dentro:** los métodos que ya trae JavaScript también tienen mejor y peor caso. Las reglas del propio lenguaje para `includes` e `indexOf` describen un bucle: empezar en el índice 0, comparar cada elemento con el valor que buscas y parar en la primera coincidencia. Así que `guests.includes('Ana')` es Ω(1) cuando Ana está primero en la lista, y O(n) cuando el nombre no está, igual que `isInvited`. Cada vez que llames un método sobre una lista, hazle las mismas dos preguntas que le harías a tu propio bucle: ¿puede parar antes?, y ¿cuál es la peor entrada?

**Error común:** responder "O(1)" porque el nombre que probaste estaba primero en la lista. Ese es el mejor caso, Ω(1). El Big O de `isInvited` es O(n), porque algunas entradas lo obligan a leer cada nombre.

## Cuando los tres casos coinciden

`isInvited` tiene una entrada con suerte porque puede detenerse antes: cuando el nombre va primero, termina. Pero hay código que no tiene ninguna entrada con suerte. Para contar los nombres cortos de la lista de invitados, un bucle tiene que mirar **cada** nombre, porque un nombre corto podría estar en cualquier lugar, incluso al final. Así que nunca se detiene antes, y cada lista de n nombres cuesta más o menos lo mismo: n revisiones.

Cuando el mejor caso y el peor caso crecen igual, ya no queda nada entre ellos: el límite inferior (Ω) y el límite superior (O) se juntan en una sola descripción exacta. Para eso es **Θ**, y por eso se le llama **límite ajustado**. `countShortNames` es **Θ(n)**: su mejor caso, su caso promedio y su peor caso son n revisiones. Vas a ver Θ usado así en muchos libros: no solo para el caso promedio, sino cada vez que el mejor y el peor caso crecen igual.

```viz
trace-count-short-names
```

**Qué acaba de pasar:** el bucle visitó cada nombre de la lista, corto o no. Un nombre corto costó una operación extra (sumarle 1 a `count`), pero ningún nombre dejó que el bucle se detuviera antes. Con 4 nombres, luego 8, luego 16, el total creció con la lista cada vez: no hay una lista con suerte que termine antes.

Antes de ejecutar esto, predice: ¿con qué lista revisa menos nombres `countShortNames`, con la que tiene puros nombres cortos o con la que no tiene ninguno?

```js-run
function countShortNames(guests) {
  let count = 0
  let checks = 0
  for (let i = 0; i < guests.length; i++) {
    checks++
    if (guests[i].length <= 3) {
      count = count + 1
    }
  }
  return 'nombres cortos: ' + count + ', revisiones: ' + checks
}

console.log(countShortNames(['Ana', 'Ben', 'Dev', 'Eli', 'Fay', 'Gus'])) // todos los nombres son cortos
console.log(countShortNames(['Cleo', 'Hana', 'Ivan', 'Jade', 'Lola', 'Omar'])) // ningún nombre es corto
```

Con ninguna: las dos listas cuestan 6 revisiones. Los nombres cambiaron cuántos cortos había, pero no cuánto trabajo hizo el bucle. Así se ve un bucle Θ(n).

**Error común:** pensar que todo bucle tiene un mejor caso Ω(1). Un bucle solo tiene una entrada con suerte si puede detenerse antes, con un `return` o un `break` adentro. Si siempre corre hasta el final, su mejor caso es igual de lento que el peor.

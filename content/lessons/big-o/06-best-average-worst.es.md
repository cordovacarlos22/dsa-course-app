---
title: Mejor caso, caso promedio y peor caso
order: 6
minutes: 6
---

> **Meta:** saber qué describen Ω, Θ y O, y por qué Big O siempre significa el peor caso.

## ¿Dónde está el elemento?

Cuando trabajas con esta notación, aparecen una y otra vez tres letras griegas: **omega (Ω)**, **theta (Θ)** y **ómicron (O)**. Ómicron es más conocida como **O**, la de Big O, y es la que más vas a ver.

Para ver por qué hay tres, imagina un array de números y un bucle que lo recorre hasta encontrar el número que buscas:

```js-run
const numbers = [1, 2, 3, 4, 5, 6, 7]

function stepsToFind(target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) return i + 1
  }
  return numbers.length
}

console.log('Find 1:', stepsToFind(1), 'step') // best case
console.log('Find 4:', stepsToFind(4), 'steps') // average case
console.log('Find 7:', stepsToFind(7), 'steps') // worst case
```

Buscar el 1 toma la menor cantidad de vueltas: es el primer elemento. Ese es el **mejor caso**. Buscar el 7 obliga al bucle a recorrer todos los elementos: el **peor caso**. Algo más o menos en el medio, como el 4, es el **caso promedio**. Esta es la misma idea con nuestra lista de invitados:

```viz
search-cases
```

| Caso     | Letra     | También se llama | En palabras simples                                             |
| -------- | --------- | ---------------- | --------------------------------------------------------------- |
| Mejor    | Ω (omega) | límite inferior  | lo más rápido que puede correr el código, en la mejor situación |
| Promedio | Θ (theta) | límite ajustado  | lo que puedes esperar en general                                |
| Peor     | O (big O) | límite superior  | lo más lento que puede correr el código, en la peor situación   |

## Big O es el peor caso

```viz
trace-is-invited
```

Así que **Big O siempre es el peor caso**. Es muy común escuchar a la gente decir "OK, ese es tu Big O del peor caso, pero ¿cuál es tu Big O del mejor caso?". Técnicamente eso no existe: el mejor caso es **omega** y el caso promedio es **theta**. Cuando medimos Big O, siempre medimos el peor caso.

Elige **buscar a 'Zoe'** arriba: no está en la lista, así que se revisa a todos los invitados. Ese es el peor caso de `isInvited`, y son n revisiones, así que `isInvited` es **O(n)**.

Estos son los tres casos de `isInvited`, escritos con esta notación:

- **Mejor caso, Ω(1):** el nombre es el primero de la lista. Una revisión, sin importar qué tan larga sea la lista.
- **Caso promedio, Θ(n):** en promedio el nombre está en algún punto del medio, así que unas n / 2 revisiones. Quita el ½ y crece como n.
- **Peor caso, O(n):** el nombre no está, así que se revisa a los n invitados.

¿Por qué enfocarse en el peor caso? Porque es una **promesa**: sea cual sea la entrada, el código nunca va a ser más lento que esto. Una búsqueda que casi siempre es rápida pero a veces lee un millón de elementos **va a** leer un millón de elementos algún día, para un usuario real. Planear para el peor caso significa no tener sorpresas.

Eso no quiere decir que los otros casos no sirvan. Cuando analices código, piensa en los tres: el mejor caso, lo que pasa normalmente y el peor caso. Pero cuando alguien te pregunte "el Big O", dale el peor caso.

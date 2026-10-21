---
title: 'Paso 5: Revisar y refactorizar'
order: 6
minutes: 12
---

> **Meta:** mejorar una solución que ya funciona haciéndote las preguntas de refactorización, y distinguir entre hacer el código más claro y hacerlo más rápido.

## Todavía no terminas

Tu código funciona. Es tentador parar ahí, cerrar la laptop y seguir con otra cosa, y a veces es lo correcto: con una fecha límite mañana, lo que más importa es que funcione. Pero el paso 5, **revisar y refactorizar**, es el que te convierte en mejor desarrollador. Saltártelo es perder una oportunidad de aprender.

Revisar quiere decir examinar tu solución de verdad, línea por línea. ¿Qué te gusta de ella, y qué no? ¿Es fácil de leer? ¿Es eficiente? Esas dos metas, **eficiencia** y **legibilidad**, a veces jalan en direcciones distintas, y el buen código encuentra un equilibrio entre las dos. **Refactorizar** quiere decir cambiar cómo está escrito el código sin cambiar lo que hace. Estas son las preguntas que debes hacerte:

1. **¿De verdad funciona?** Vuelve a correr tus ejemplos.
2. **¿Hay otro camino para llegar?** Casi nunca hay una sola solución.
3. **¿Es fácil de leer?** ¿Alguien más podría seguirlo rápido?
4. **¿Dónde más podría servir?** La respuesta, o la idea detrás de ella, podría resolver otro problema. Cada problema que resuelves te da intuición para el siguiente.
5. **¿Puede ser más rápido, o usar menos memoria?** Su Big O en tiempo y en espacio.
6. **¿Qué más podría quedar más limpio?** El estilo, los nombres, y las convenciones del lenguaje y de tu equipo.
7. **¿Cómo lo resolvieron otras personas?**

```viz
five-steps-look-back
```

**Qué acaba de pasar:** las siete preguntas aparecieron una por una. Fíjate en que solo una trata de la velocidad. Las demás tratan de que sea correcto, claro, y de aprender. En una entrevista, hazlas en voz alta cuando termines, aunque no te dé tiempo de actuar sobre todas. La última es una gran pregunta para el entrevistador: casi siempre ha visto el mismo problema resuelto de muchas formas, y "¿qué otras soluciones has visto?" te puede enseñar mucho. Trabajando solo, busca otras soluciones en internet, incluso en otro lenguaje. Compararlas con la tuya es una de las formas más rápidas de aprender ideas nuevas.

**Error común:** pensar que refactorizar quiere decir "hacerlo más corto". Un código más corto que nadie puede leer no es mejor. La meta es código correcto, claro y lo bastante rápido.

## Código más claro

Revisemos nuestro `countCharacters`. Funciona, pero algunas cosas podrían leerse mejor.

**La actualización de la cuenta.** Cinco líneas para "súmale 1, o empieza en 1" es mucho. Una línea hace el mismo trabajo: `result[character] = (result[character] || 0) + 1`. El operador `||` te da su lado derecho cuando el lado izquierdo es "falsy", y `undefined` es falsy. Así que una clave nueva empieza desde `0` y se vuelve `1`, y una clave que ya tiene cuenta la conserva y recibe 1 más.

**La función de ayuda.** La revisión ya vive en su propia función, `isLetterOrDigit`. Eso ya es una refactorización: ahora el bucle casi se lee como una oración. "Para cada carácter, si es una letra o un dígito, cuéntalo."

**Sintaxis moderna.** Usa `const` para los valores que nunca cambian y `let` para los que sí, y evita el viejo `var`. También vas a ver otro tipo de bucle, `for...of`, que te da cada carácter directamente, sin índice:

```js
for (const character of text) {
  // character es cada carácter, uno a la vez
}
```

Hace el mismo trabajo que nuestro bucle con índice (una pasada, O(n)), así que elegir entre los dos es cuestión de estilo. En este curso seguimos escribiendo bucles `for (let i = 0; …)`, porque así siempre ves exactamente en qué posición estás.

```js-run
function isLetterOrDigit(character) {
  const allowed = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return allowed.includes(character)
}

function countCharacters(text) {
  const result = {}
  for (let i = 0; i < text.length; i++) {
    const character = text[i].toLowerCase()
    if (isLetterOrDigit(character)) {
      result[character] = (result[character] || 0) + 1
    }
  }
  return result
}

console.log(countCharacters('Hi Ana!'))
console.log(countCharacters('Party at 8!'))
```

**Qué acaba de pasar:** los resultados son los mismos que antes, con menos líneas que siguen siendo fáciles de leer. Y sabemos que son los mismos porque volvimos a correr los ejemplos, que es la pregunta 1 de la lista.

**Error común:** refactorizar sin volver a correr los ejemplos. Una "refactorización" que cambia el resultado no es una refactorización; es un bug nuevo.

## Código más rápido: códigos de caracteres

Ahora la pregunta 5: el rendimiento. Nuestro `isLetterOrDigit` busca en una lista de 36 caracteres. Una expresión regular sería más corta de escribir, pero qué tan rápido corre depende del patrón y del motor de JavaScript, y para una revisión tan simple puede ser más lenta de lo que esperas. Debajo de cada carácter hay una idea más sencilla: **su número**.

Las computadoras guardan cada carácter como un número, llamado su **código de carácter**. `'a'.charCodeAt(0)` da `97`, `'b'` es `98`, y así. Lo útil es que los caracteres parecidos están juntos, en bloques: los dígitos del `'0'` al `'9'` son los códigos **48–57**, las mayúsculas de la `'A'` a la `'Z'` son **65–90**, y las minúsculas de la `'a'` a la `'z'` son **97–122**. Así que "¿es una letra o un dígito?" se vuelve tres comparaciones entre números, de las operaciones más simples y rápidas que puede hacer una computadora.

```viz
char-code-ranges
```

**Qué acaba de pasar:** cada carácter cayó en la recta numérica en su código. `'a'`, `'Z'` y `'7'` cayeron dentro de un bloque verde; el espacio y el `!` cayeron fuera. Los interesantes están en los bordes: `'['` es 91, uno después de `'Z'`, y el acento grave es 96, uno antes de `'a'`. Equivócate en una sola comparación (`<` en vez de `<=`) y los bordes son justo donde aparece el bug.

Aquí está la función refactorizada, más una forma de compararla con una expresión regular. No adivines cuál es más rápida: **mídelo**, igual que en la lección de medir tiempos del módulo de Big O.

```js-run
function isLetterOrDigit(character) {
  const code = character.charCodeAt(0)
  if (code >= 48 && code <= 57) return true // 0–9
  if (code >= 65 && code <= 90) return true // A–Z
  if (code >= 97 && code <= 122) return true // a–z
  return false
}

console.log(isLetterOrDigit('a'), isLetterOrDigit('Z'), isLetterOrDigit('7'))
console.log(isLetterOrDigit(' '), isLetterOrDigit('!'), isLetterOrDigit('['))

let text = ''
for (let i = 0; i < 100000; i++) {
  text += 'Hi Ana! 8'[i % 9]
}

let start = performance.now()
let found = 0
for (let i = 0; i < text.length; i++) {
  if (isLetterOrDigit(text[i])) found++
}
console.log('códigos de caracteres:', (performance.now() - start).toFixed(1), 'ms')

start = performance.now()
found = 0
for (let i = 0; i < text.length; i++) {
  if (/[a-z0-9]/i.test(text[i])) found++
}
console.log('expresión regular:', (performance.now() - start).toFixed(1), 'ms')
```

Tus tiempos van a variar de una ejecución a otra y de un navegador a otro. Y fíjate en lo que _no_ cambia: las dos versiones hacen una cantidad constante de trabajo por carácter, así que `countCharacters` es **O(n)** de cualquier forma. Una revisión más rápida reduce la constante, no el Big O.

Una cosa más para pensar: ¿es mejor pasar todo el string a minúsculas primero, o revisar primero cada carácter y pasar a minúsculas solo las letras y dígitos? Depende de las entradas. Si están llenas de espacios y símbolos, revisar primero se ahorra trabajo. ¿Y el espacio en memoria? El objeto nunca puede tener más de 36 claves (26 letras y 10 dígitos), sin importar qué tan largo sea el string. Así que `countCharacters` es **O(n) en tiempo y O(1) en espacio**.

**Error común:** creer que una función de ayuda más rápida cambia el Big O. Aquí cambia la constante, lo cual es una mejora real, pero `countCharacters` era O(n) antes y sigue siendo O(n).

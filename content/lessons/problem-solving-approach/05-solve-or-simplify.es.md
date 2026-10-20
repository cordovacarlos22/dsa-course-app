---
title: 'Paso 4: Resolver o simplificar'
order: 5
minutes: 11
---

> **Meta:** cuando no puedes resolver todo el problema, resolver primero una versión más simple y luego agregar de nuevo la parte difícil.

## Resuélvelo, o resuelve un problema más simple

Entiendes el problema, y tienes ejemplos y un plan. El paso 4 es **resolverlo**: si el plan se siente sólido, escribe el código. Pero muchas veces vas a sentirte bien con casi todo, quizá un 80%, y atascado en una o dos partes. Ahí entra la segunda mitad del paso: **si no puedes resolver el problema, resuelve un problema más simple**.

Simplificar no quiere decir cambiarte a otro problema más fácil. Quiere decir **ignorar por un momento la parte que te está dando problemas**, para avanzar en todo lo demás. Así se hace:

1. **Encuentra la dificultad principal:** la parte que no sabes hacer.
2. **Ignórala por ahora.**
3. **Escribe una solución simplificada:** todo menos esa parte.
4. **Vuelve a agregar la dificultad.**

¿Por qué vale la pena? En una entrevista, atascarte en una parte difícil y no escribir nada se ve mucho peor que escribir todo lo que puedes y decir "regreso a esta parte después". Y hay una segunda razón: mientras escribes la versión más simple, muchas veces **descubres cómo hacer la parte difícil**. Ver código real funcionando hace más fácil imaginar la pieza que falta.

```viz
five-steps-solve
```

**Qué acaba de pasar:** los cuatro movimientos de simplificar aparecieron en orden: encontrar la parte difícil, dejarla a un lado, resolver el resto y traerla de vuelta. La palabra importante es _por ahora_. No abandonas la parte difícil: la pospones.

**Error común:** simplificar cambiando el problema. Resolver "sumar dos números pequeños" cuando el problema trata de números enormes no es simplificar; es resolver otra cosa. Quédate con el problema real, y deja a un lado solo la pieza difícil.

## El charCount simple

Qué es lo difícil de `charCount` depende de quién lo resuelva. Si los bucles todavía te cuestan, el bucle podría ser la parte difícil. Entonces podrías manejar el primer carácter a mano, luego el segundo, notar el patrón y, solo entonces, convertirlo en un bucle. Si los objetos se sienten nuevos, podrías empezar con el bucle e imprimir cada carácter. En un pizarrón, podrías olvidar cómo se pasa un string a minúsculas en JavaScript (es `toLowerCase()`). Dilo en voz alta, y déjalo para después.

Para la mayoría, lo más difícil es **revisar si un carácter es una letra o un dígito**. Así que ignoremos eso, ignoremos también las minúsculas, y escribamos todo lo demás. El objeto empieza vacío. Para cada carácter: si ya es clave, súmale 1; si no, ponlo en 1.

```js-run
function charCount(str) {
  const result = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (result[char] > 0) {
      result[char]++
    } else {
      result[char] = 1
    }
  }
  return result
}

console.log(charCount('banana'))
console.log(charCount('Hi Ana!'))
```

`result[char] > 0` es como revisamos si el carácter ya es clave: una clave que no existe da `undefined`, y `undefined > 0` es `false`.

```viz
trace-char-count
```

**Qué acaba de pasar:** el trace leyó un carácter a la vez. Un carácter nuevo recibió una cuenta de 1, y uno que ya había visto recibió 1 más. Con `'banana'`, la respuesta ya es correcta: `{ b: 1, a: 3, n: 2 }`. Con `'Hi Ana!'` todavía no: `'H'` y `'A'` se cuentan aparte de `'h'` y `'a'`, y también se cuentan el espacio y el `!`. Pero mira cuánto ya funciona: el objeto, el bucle, la cuenta y el return. Ya llevamos casi todo el camino.

**Error común:** escribir `result[char]++` sin revisar antes. En una clave que todavía no existe, eso es `undefined + 1`, que da `NaN`:

```js-run
const counts = {}
counts.a++
console.log(counts.a) // NaN: no había ninguna cuenta a la cual sumarle 1
```

## Agrega de nuevo las partes difíciles

Ahora trae de vuelta las dificultades, una a la vez, y vuelve a correr los ejemplos después de cada cambio. Las minúsculas son un cambio pequeño: lee cada carácter como `str[i].toLowerCase()`. Así `'H'` y `'h'` se vuelven la misma clave.

Revisar si es letra o dígito es la dificultad real, y hay varias formas de hacerlo. Podrías escribir un string con todos los caracteres permitidos y revisar si **incluye** el carácter. Podrías usar una **expresión regular**, un pequeño lenguaje de patrones para texto: `/[a-z0-9]/` coincide con una letra minúscula o un dígito. O podrías usar los números que hay detrás de cada carácter, que es la siguiente lección. La lista de caracteres permitidos es la más fácil de leer, así que empecemos por ahí. Fíjate en que no cambia nada de lo que ya escribimos: solo envuelve la cuenta en un `if`.

```viz
solution-layers
```

**Qué acaba de pasar:** la versión simple se quedó, y cada capa agregó un poco. La capa 2 cambió una línea para pasar cada carácter a minúscula, y `'a'` llegó a 2. La capa 3 envolvió la cuenta en un `if`, y desaparecieron el espacio y el `!`. No se tiró nada.

```js-run
function isAlphaNumeric(char) {
  const allowed = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return allowed.includes(char)
}

function charCount(str) {
  const result = {}
  for (let i = 0; i < str.length; i++) {
    const char = str[i].toLowerCase()
    if (isAlphaNumeric(char)) {
      if (result[char] > 0) {
        result[char]++
      } else {
        result[char] = 1
      }
    }
  }
  return result
}

console.log(charCount('Hi Ana!'))
console.log(charCount('Party at 8!'))
```

`allowed.includes(char)` es una búsqueda, pero sobre una lista fija de 36 caracteres, así que tarda lo mismo sin importar la entrada: O(1) por cada carácter. La función completa es una sola pasada por el string, así que es **O(n)**.

Si te atascas con esa revisión en una entrevista, dilo en voz alta: "Aquí necesito revisar si el carácter es una letra o un dígito. Podría usar una expresión regular o una lista de caracteres. ¿Tienes alguna preferencia?" Pedir una pista así está perfectamente bien. Llegar al 90% y hacer una pregunta precisa sobre el último 10% demuestra una verdadera habilidad para resolver problemas.

**Error común:** borrar código que funciona para empezar de cero cuando te atascas. La versión simple es tu base: de aquí en adelante, solo le agregas.

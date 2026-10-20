---
title: El método en una entrevista
order: 7
minutes: 9
---

> **Meta:** juntar los 5 pasos como los usarías en una entrevista: en voz alta, un paso a la vez.

## Los 5 pasos, una vez más

Este es el método completo otra vez, como lo vas a usar de aquí en adelante, ya sea frente a un pizarrón con gente mirando o solo en casa construyendo una app:

1. **Entender el problema.** Explícalo con tus palabras, encuentra qué entra y qué sale, revisa que te alcance, y ponle nombre a las cosas.
2. **Explorar ejemplos concretos.** Simples, más complejos, vacíos, inválidos. Los pasos 1 y 2 en realidad tratan los dos de entender: qué entra, qué sale, y qué debe pasar con los errores y las entradas raras.
3. **Dividirlo en pasos.** Escribe los pasos como comentarios, y decide un rumbo antes de escribir una línea. Lanzarte sin un plan es como terminas atascado en un solo enfoque, entras en pánico, lo borras todo y empiezas de nuevo.
4. **Resolver, o simplificar.** Si una parte es demasiado difícil, déjala a un lado, resuelve el resto y luego tráela de vuelta.
5. **Revisar y refactorizar.** Comprueba el resultado, hazlo más claro, hazlo más rápido, y averigua cómo lo resolvieron otros.

```viz
five-steps
```

**Qué acaba de pasar:** este es el mapa del inicio del módulo, ahora con una lección completa detrás de cada paso. En una entrevista, nunca te saltes los pasos 1 y 2. Toman unos minutos, y son los que más se salta la gente cuando está nerviosa.

El método no es solo para entrevistas. Cada vez que te enfrentes a algo nuevo, como ordenar los resultados de búsqueda de una app o encontrar un bug difícil, los mismos pasos funcionan. El resto del curso también se apoya en ellos: en el módulo de Listas enlazadas, cada método que construyas (`push`, `pop`, `insert`…) sigue estos cinco pasos.

**Error común:** tratar los pasos como un ritual estricto. Son una guía. En un problema fácil, los pasos 1 a 3 pueden tomar treinta segundos, y está bien. Lo que importa es que nunca te los saltes por completo.

## Piensa en voz alta

En una entrevista, el método solo ayuda si el entrevistador puede verlo. No puede leerte la mente, así que **di lo que estás haciendo** e invítalo al proceso. Así podría sonar en cada paso:

| Paso                 | Lo que podrías decir                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Entender             | "Con mis palabras: cuento cada letra y cada dígito. La entrada es un string y la salida es un objeto, ¿cierto?"                     |
| Ejemplos             | "Déjame escribir algunos ejemplos. ¿Qué debería regresar un string vacío? ¿Las mayúsculas cuentan aparte?"                          |
| Dividir en pasos     | "Este es mi plan: crear un objeto, recorrer el string, contar las letras y los dígitos, regresar el objeto."                        |
| Resolver/simplificar | "Todavía no estoy seguro de cómo revisar las letras, así que primero escribo todo lo demás y luego regreso a eso."                  |
| Revisar              | "Ya funciona. Este if/else podría ser una línea, y la revisión podría usar códigos de caracteres. ¿Qué otras soluciones has visto?" |

Algunos hábitos más ayudan. **Escribe tus ejemplos donde el entrevistador pueda verlos**, y prueba tu código con ellos al final. Cuando te atasques, **di exactamente en qué te atascaste**: una pregunta precisa consigue una pista útil, y el silencio no consigue nada. Y si se acaba el tiempo, **explícale el resto de tu plan**.

¿Practicas solo? Haz lo mismo de todos modos. Explicar tus pasos en voz alta, aunque sea a nadie, hace evidentes los huecos en tu razonamiento.

**Error común:** quedarte callado cuando el problema se pone difícil. Justo ahí es cuando más ayuda hablar, porque el entrevistador solo puede ayudarte con lo que escucha.

## Tu turno: los cinco pasos

Usemos el método completo con un problema nuevo: **"Escribe una función que regrese la palabra más larga de una frase."**

1. **Entender:** la entrada es un string de palabras separadas por espacios, y la salida es una palabra, un string. Nuestra pregunta: ¿qué pasa si dos palabras miden lo mismo? Decidimos que gana **la primera**. Nombres: `longestWord(sentence)`.
2. **Ejemplos:** `longestWord('Hi Ana')` → `'Ana'`. `longestWord('party at eight')` → `'party'`, porque empata con `'eight'` y va primero. Un string vacío → `''`.
3. **Dividir en pasos:** separar la frase en palabras; recordar la palabra más larga hasta ahora; recorrer las palabras, y reemplazar la más larga solo cuando una palabra sea _más_ larga; regresarla.
4. **Resolver:** esa es la comprobación de este paso. Si separar strings es nuevo para ti, `split(' ')` convierte un string en un array de palabras:

```js-run
console.log('party at eight'.split(' ')) // ['party', 'at', 'eight']
console.log(''.split(' ')) // ['']: una "palabra" vacía
```

5. **Revisar:** es una sola pasada por las palabras, así que es O(n), donde n es el largo de la frase. ¿Se lee con claridad? ¿Se sigue cumpliendo la regla del empate del paso 1?

Ese es todo el módulo. Lo que sigue es **Patrones para resolver problemas**: recetas para familias completas de problemas, como contar cosas con un objeto o recorrer un array con dos punteros. Cada patrón sigue empezando con estos mismos cinco pasos.

**Error común:** comparar con `>=` en vez de `>`. Entonces una palabra posterior que empata reemplaza a la anterior, y se rompe la regla del empate que decidiste en el paso 1. Por eso los ejemplos incluyen un empate: es el ejemplo que atrapa este bug.

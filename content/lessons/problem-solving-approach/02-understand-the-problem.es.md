---
title: 'Paso 1: Entender el problema'
order: 2
minutes: 10
---

> **Meta:** hacerte cinco preguntas sobre un problema antes de escribir código, y ver cuánto revelan sobre algo tan simple como sumar dos números.

## Ve más despacio antes de empezar

Cuando te dan un problema nuevo, sobre todo con el reloj corriendo, las ganas son de empezar a escribir de inmediato. El corazón se acelera, y ver código en la pantalla se siente como avanzar. Pero escribir rápido en la dirección equivocada no es avanzar. El primer paso es tomarte un minuto y asegurarte de **entender el problema**.

Suena obvio, pero hay una forma concreta de hacerlo. Hazte estas cinco preguntas, a ti mismo o en voz alta al entrevistador:

1. **¿Puedo explicarlo con mis propias palabras?** Si solo puedes repetirlo, todavía no lo entiendes.
2. **¿Qué entra?** Las entradas: de qué tipo, qué tan grandes, cuántas.
3. **¿Qué sale?** La salida: qué debe regresar la función, y con qué forma.
4. **¿Con eso me alcanza para la respuesta?** ¿Las entradas te dan todo lo que necesitas para obtener la salida? Quizá no lo sepas hasta que empieces a resolverlo, y está bien, pero pregúntalo de todos modos.
5. **¿Cómo voy a llamar a las cosas?** Nombres para la función, sus entradas y su resultado.

```viz
five-steps-understand
```

**Qué acaba de pasar:** cada pregunta agregó una línea a la lista. Ninguna necesita código, y juntas toman un minuto o dos. En una entrevista también demuestran que piensas antes de escribir, que es justo lo que los entrevistadores quieren ver.

Probémoslas con el problema más simple que existe: **"Escribe una función que sume dos números."** Explicado con nuestras palabras: "dados dos números, regresar su total", o simplemente "implementar la suma". Fácil. Lo interesante empieza con las siguientes preguntas.

**Error común:** "explicar" el problema repitiéndolo palabra por palabra. Cambia las palabras: así descubres si de verdad lo entendiste.

## Las entradas: ¿qué números?

"Dos números" suena claro hasta que preguntas de qué tipo. ¿Solo enteros, o también decimales? ¿Qué tan grandes pueden ser? ¿Siempre exactamente dos, o alguien podría querer sumar diez? Cada respuesta puede cambiar el código, así que vale la pena preguntar cada una.

El tamaño importa más de lo que crees. En JavaScript, todos los números se guardan de la misma forma, en una cantidad fija de memoria (64 bits). Eso tiene consecuencias. Los decimales no siempre son exactos. Los enteros solo son exactos hasta `Number.MAX_SAFE_INTEGER`, que es 9,007,199,254,740,991. Arriba de eso, JavaScript empieza a redondear, y después de más o menos 1.8 × 10³⁰⁸ se rinde y regresa `Infinity`. Ejecuta esto:

```js-run
console.log(0.1 + 0.2) // ¡no es exactamente 0.3!
console.log(Number.MAX_SAFE_INTEGER)
console.log(9007199254740992 + 1) // el + 1 se pierde
console.log(1e308 + 1e308) // demasiado grande: Infinity
```

**Qué acaba de pasar:** el mismo `+` que usas todos los días dio tres respuestas sorprendentes. `0.1 + 0.2` no es exactamente `0.3`, sumarle 1 a un número enorme no hizo nada, y dos números muy grandes sumaron `Infinity`. Así que "sumar dos números" se vuelve un problema mucho más difícil si los números pueden ser enormes. Una forma de resolverlo es guardar cada número como un **string** de dígitos y sumarlos dígito por dígito, como aprendiste en papel. JavaScript también tiene un tipo especial para enteros enormes, `BigInt`, pero en una entrevista preguntarías antes de usarlo.

¿Y cuántas entradas? Sumar diez números es algo perfectamente razonable. Una función que solo acepta dos es una decisión, y es mejor tomarla a propósito que por accidente.

Nada de esto quiere decir que debas preocuparte por cada entrada. Quiere decir que debes **preguntar**. Muchas veces el entrevistador te dirá "supón que son enteros de tamaño normal". Pero ahora los dos lo saben, y demostraste que sabes que ese límite existe.

**Error común:** suponer que "números" quiere decir enteros pequeños. Quien escribió el problema puede tener en mente algo muy distinto.

## Salidas, entradas que faltan y nombres

Ahora las salidas. ¿`addNumbers` debe regresar un número? Si las dos entradas son decimales, ¿debe regresar un decimal? Si sumamos números enormes como strings, ¿debe regresar un string? Otra vez: pregunta.

La cuarta pregunta, **¿con eso me alcanza para la respuesta?**, atrapa la información que falta. ¿Qué pasa si alguien llama `addNumbers(5)` con un solo número? No hay con qué sumarlo. ¿El número que falta cuenta como 0? ¿`addNumbers` debe regresar `undefined`, o detenerse con un error? No hay respuesta correcta hasta que alguien decide. Esto es lo que hace una primera versión por sí sola:

```js-run
function addNumbers(first, second) {
  return first + second
}

console.log(addNumbers(2, 3)) // 5
console.log(addNumbers(5)) // NaN: 5 + undefined
console.log(addNumbers('2', 3)) // '23': se cuela un string y + los une
```

**Qué acaba de pasar:** `addNumbers(5)` regresó `NaN` ("no es un número"), porque `second` es `undefined` y `5 + undefined` no es un número. Y `addNumbers('2', 3)` regresó el string `'23'`, porque cuando un lado de `+` es un string, JavaScript une texto en vez de sumar. El código corre, pero no como nadie quería. Esos son justo los casos que las preguntas buscan atrapar.

Por último, los **nombres**: dale nombres claros a las piezas importantes antes de escribir el código. Aquí es fácil: la función es `addNumbers`, las entradas son `first` y `second`, y lo que regresa es el `result`. En problemas más grandes, los buenos nombres son la mitad del trabajo. Hacen que el plan sea más fácil de escribir, el código más fácil de leer y tu explicación más fácil de seguir.

En una entrevista, la respuesta a muchas de estas preguntas será "no te preocupes por eso" o "supón que la entrada es válida". Está bien. Igual demostraste que piensas en los casos límite, y averiguaste exactamente qué tienes que manejar.

**Error común:** tratar estas preguntas como un trámite y luego ignorar las respuestas. Cada respuesta es una decisión que tu código tiene que respetar, como la de la comprobación de este paso.

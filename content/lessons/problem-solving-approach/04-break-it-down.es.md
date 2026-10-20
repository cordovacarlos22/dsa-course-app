---
title: 'Paso 3: Dividirlo en pasos'
order: 4
minutes: 9
---

> **Meta:** escribir los pasos de tu solución como comentarios antes de escribir el código.

## Planea antes de escribir

Ya entiendes el problema y tienes tus ejemplos. El tercer paso todavía va **antes** del código de verdad: **dividirlo en pasos**. Escribe los pasos que va a seguir tu solución, como comentarios cortos. No es pseudocódigo completo, y no necesita sintaxis válida. Unas cuantas líneas con palabras sencillas bastan: las partes principales de la solución, no cada línea.

¿Para qué, si podrías empezar a programar de una vez? Porque te **obliga a pensar en la lógica antes que en la sintaxis**. Escribir código quiere decir hacer malabares con dos cosas a la vez: qué hacer, y cómo decirlo en JavaScript. Un plan te quita la primera de encima. También te ayuda a **descubrir lo que todavía no entiendes**. El paso que no puedes poner en palabras es justo el que te habría hecho atascarte a la mitad del código.

En una entrevista, el plan hace un trabajo más: **muestra cómo piensas**. Mucho de lo que buscan los entrevistadores es cómo te comunicas. Escribir código en silencio, con el ceño fruncido, no les dice nada. Decir "estos son los pasos que voy a seguir" les deja seguirte, y a veces te van a dar un empujón si un paso va por mal camino. Hasta puedes preguntarles directamente: "¿Te parece razonable este enfoque?"

```viz
five-steps-break-down
```

**Qué acaba de pasar:** la lista del paso 3 tiene tres puntos, y son tres razones para planear: los comentarios como guía, la lógica antes que la sintaxis, y encontrar los huecos a tiempo. El plan es corto a propósito. Si se vuelve tan largo como el código, deja de ahorrarte tiempo.

**Error común:** escribir pseudocódigo tan detallado que en realidad es código escrito en español. Quédate con los pasos principales; los detalles van en el código.

## charCount, paso a paso

Dividamos `charCount` en pasos. Recuerda las decisiones de nuestros ejemplos: contar solo letras y dígitos, en minúsculas, y regresar un objeto. Dos pasos son fáciles: necesitamos un **objeto para llenar**, y lo **regresamos cuando terminemos**. Todo lo demás pasa en medio, así que casi toda la lógica vive en un **bucle sobre el string**.

¿Qué le pasa a cada carácter? Hay tres casos. Si es una letra o un dígito que **ya es clave** en el objeto, súmale 1 a su cuenta. Si es una letra o un dígito que **todavía no es clave**, agrégalo con una cuenta de 1. Si es **cualquier otra cosa**, como un espacio o un `!`, no hagas nada. Ese es todo el plan:

```js
function charCount(str) {
  // crear un objeto para regresar
  // recorrer el string, un carácter a la vez
  //   una letra o dígito que ya es clave: sumarle 1
  //   una letra o dígito que todavía no es clave: ponerlo en 1
  //   cualquier otra cosa (un espacio, '!'): no hacer nada
  // regresar el objeto
}
```

Todavía falta una decisión: cuándo pasar a minúsculas. Podríamos pasar todo el string a minúsculas antes del bucle, o cada carácter al leerlo. Las dos funcionan. Pasaremos a minúscula cada carácter cuando el bucle lo lea.

```viz
steps-to-code
```

**Qué acaba de pasar:** cada comentario recibió su código, uno a la vez, hasta que el plan se convirtió en una función. Un paso tenía una parte que todavía no sabíamos escribir: revisar si un carácter es una letra o un dígito. En vez de detenernos ahí, le pusimos nombre a ese paso, `isAlphaNumeric`, y seguimos. Lo vamos a escribir en las siguientes dos lecciones.

No tienes que escribir toda la función para avanzar. Este es el plan con solo las partes fáciles completadas. Ya se puede ejecutar:

```js-run
function charCount(str) {
  // crear un objeto para regresar
  const result = {}
  // recorrer el string, un carácter a la vez
  // (sigue después)
  // regresar el objeto
  return result
}

console.log(charCount('banana')) // {} por ahora, ¡pero corre!
```

**Error común:** dejar fuera los casos en los que no haces nada. "Cualquier otra cosa: saltarla" es un paso real, y olvidarlo en el plan es como los espacios terminan contándose por accidente.

## Cuando se acaba el tiempo

Los problemas de entrevista muchas veces son demasiado largos para terminarlos en el tiempo que tienes, y a veces es a propósito. Los entrevistadores quieren ver **cómo** trabajas, no solo si llegas a la última línea. Aquí es donde un plan escrito vale la pena.

Imagina que se te acaba el tiempo a la mitad del bucle. Sin un plan, el entrevistador ve media función y tiene que adivinar a dónde ibas. Con el plan escrito arriba, puede ver cada paso que estabas por dar. Muchas veces esa es la diferencia entre "no terminó" y "claramente sabía cómo resolverlo". Es común que un candidato avance aunque no haya terminado el problema, porque su proceso era fácil de seguir.

El plan también te protege de ti mismo. Si empiezas a programar sin uno, es fácil quedarte atascado en un solo enfoque, entrar en pánico cuando no funciona y borrarlo todo. Con un plan, puedes dar un paso atrás, mirar los pasos y encontrar dónde se descompuso algo, en vez de empezar de cero.

Planear no cambia el Big O de tu solución: el plan de `charCount` ya te dice que es un solo bucle sobre el string, así que va a ser O(n). Saberlo antes de escribir una sola línea es otra ventaja del plan.

Pruébalo ahora: la función de la comprobación de este paso tiene un plan pero nada de código. Convierte cada comentario en código.

**Error común:** borrar el plan en cuanto empiezas a programar. Deja los comentarios hasta el final. Te ayudan a revisar que cada paso esté hecho, y puedes limpiarlos cuando revises tu solución.

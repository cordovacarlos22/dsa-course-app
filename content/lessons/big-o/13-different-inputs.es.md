---
title: Términos distintos para entradas distintas
order: 13
minutes: 9
---

> **Meta:** escribir O(a + b) y O(a · b) para código con dos entradas. ¡Una "trampa" clásica de entrevista!

## Dos entradas

Hasta ahora, cada función tenía **una** entrada, y a su tamaño le decíamos n. Pero muchas funciones reciben dos: dos listas para comparar, una lista de invitados y una de ayudantes, dos textos. Cada entrada puede tener cualquier tamaño, y los tamaños no tienen por qué coincidir. Así que cada entrada recibe **su propia letra** en Big O. Cuando una función recibe dos entradas, normalmente a sus tamaños les decimos **a** y **b**.

¿Recuerdas `printTwice`, con un bucle después de otro? Cada bucle corría n veces, así que era O(2n), y quitamos la constante para obtener O(n). Este es el giro de entrevista: en lugar de pasar **un** número n, pasamos **dos** números distintos, a y b. El primer bucle corre a veces y el segundo corre b veces.

La respuesta automática, si nunca has visto esto, suena así: "Un bucle es O(n), y este otro bucle también es O(n). Súmalos: O(2n). Quita la constante: O(n)." **Eso no es correcto.** No puedes decir que a es igual a n **y** que b es igual a n: son dos entradas distintas. Imagina a = 1 y b = 1,000,000: un bucle casi no corre, y el otro corre un millón de veces. Así que el primer bucle es **O(a)**, el segundo es **O(b)**, y juntos son **O(a + b)**. Hasta ahí se simplifica.

Esta es la misma idea con una fiesta que tiene invitados (a) y ayudantes (b):

```viz
two-inputs
```

**Qué acaba de pasar:** la fiesta tenía 4 invitados y 2 ayudantes: dos listas distintas. El primer bucle le dio la bienvenida a cada invitado (a pasos), y luego un segundo bucle recorrió a los ayudantes (b pasos más), para un total de **O(a + b)**. En la última escena, cada invitado le dio las gracias a cada ayudante: un bucle sobre los ayudantes **dentro** de un bucle sobre los invitados. Eso son a × b pasos: **O(a · b)**.

Esta es `printBoth`, la versión con números:

```js-run
function printBoth(a, b) {
  for (let i = 0; i < a; i++) {
    console.log('primer bucle:', i)
  }
  for (let j = 0; j < b; j++) {
    console.log('segundo bucle:', j)
  }
}

printBoth(2, 4) // 2 + 4 = 6 líneas: O(a + b)
```

Y estas son las dos formas con contadores, una después de la otra y una dentro de la otra:

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev'] // a = 4
const helpers = ['Kai', 'Lu'] // b = 2

let inARow = 0
for (let i = 0; i < guests.length; i++) {
  inARow++ // darle la bienvenida a un invitado
}
for (let j = 0; j < helpers.length; j++) {
  inARow++ // darle instrucciones a un ayudante
}

let nested = 0
for (let i = 0; i < guests.length; i++) {
  for (let j = 0; j < helpers.length; j++) {
    nested++ // este invitado le da las gracias a este ayudante
  }
}

console.log('Seguidos:', inARow, 'pasos (a + b)') // 6
console.log('Anidados:', nested, 'pasos (a · b)') // 8
```

**Error común:** la respuesta automática misma: decir que los dos bucles son O(n) y terminar con O(n). Dos bucles sobre entradas **distintas** nunca se juntan en una sola letra. Escribe una letra por entrada, y luego suma (bucles seguidos) o multiplica (un bucle dentro del otro).

## No les digas n a las dos

¿Cuándo **sí** puedes usar la misma letra? Solo cuando dos bucles recorren la **misma** entrada. Entonces sus tamaños de verdad son el mismo número, y se aplican las reglas que ya conoces: dos bucles seguidos sobre la misma lista son n + n = 2n, que es O(n); uno dentro del otro es n × n, que es O(n²). Así que la regla es simple: **usa una letra distinta para cada entrada**.

```viz
trace-welcome-and-goodbye
```

**Qué acaba de pasar:** los dos bucles recorrieron la **misma** lista de invitados. El bucle de bienvenidas corrió una vez por invitado, y luego el de despedidas corrió otra vez una vez por invitado: n + n = 2n. Como es una sola entrada, n de verdad es el mismo número en los dos bucles, así que 2n es O(n).

| Forma del código                                    | Big O    |
| --------------------------------------------------- | -------- |
| Dos bucles seguidos sobre la misma lista            | O(n)     |
| Bucle sobre invitados y luego sobre ayudantes       | O(a + b) |
| Dos bucles anidados sobre la misma lista            | O(n²)    |
| Bucle sobre ayudantes dentro de uno sobre invitados | O(a · b) |

¿Por qué O(a + b) no se puede simplificar? Porque ninguno de los dos términos es una constante, y no sabes cuál es más grande. Si hay 4 invitados y 1,000 ayudantes, los ayudantes deciden el trabajo; con un millón de invitados y 3 ayudantes, lo deciden los invitados. Big O se queda con los dos, para que la respuesta sea correcta sin importar cuál entrada resulte grande. Ejecuta los dos casos:

```js-run
function stepsInARow(a, b) {
  return a + b
}
function stepsNested(a, b) {
  return a * b
}

console.log('4 invitados, 1,000 ayudantes:', stepsInARow(4, 1000), 'seguidos,', stepsNested(4, 1000), 'anidados')
console.log('1,000,000 invitados, 3 ayudantes:', stepsInARow(1000000, 3), 'seguidos,', stepsNested(1000000, 3), 'anidados')
```

En el primer caso, b hace casi todo el trabajo; en el segundo, lo hace a. No se puede quitar ninguna de las dos letras, porque el código funciona para las dos fiestas.

En una entrevista, es buena costumbre decirlo en voz alta: "Digamos que el número de invitados es a y el número de ayudantes es b. El primer bucle es O(a), el segundo es O(b), así que la función completa es O(a + b)."

**Error común:** quitar una entrada porque "seguro es pequeña". Quizá casi siempre hay pocos ayudantes, pero Big O describe el peor caso, y nada en el código impide que la lista de ayudantes sea enorme. A menos que el problema prometa un límite, quédate con las dos letras.

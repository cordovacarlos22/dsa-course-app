---
title: Big O de los objetos
order: 2
minutes: 11
---

> **Meta:** saber por qué agregar, leer, cambiar y quitar una clave son O(1), y por qué buscar un valor es O(n).

## Objetos: etiquetas en vez de posiciones

Un **objeto** guarda sus datos como **pares clave–valor**. La **clave** es una etiqueta, como `'Dev'`. El **valor** es lo que esa etiqueta señala, como `'yes'`. Una clave junto con su valor se llama **propiedad**. Las claves son strings (JavaScript convierte otras claves, como los números, en strings), y los valores pueden ser cualquier cosa: strings, números, booleanos, arrays, incluso otros objetos.

La gran diferencia con un array es que un objeto **no tiene orden**. No hay índice, ni primera propiedad, ni última. A un objeto no le preguntas "¿qué hay en la posición 2?"; le preguntas "¿qué hay bajo la clave `'Dev'`?". Quizá notes que JavaScript normalmente imprime las claves en el orden en que las agregaste, pero eso es solo la forma de mostrarlas. Nada de lo que puedes hacer con un objeto depende de la posición de una clave.

Entonces, ¿cuándo conviene usar un objeto? Cuando el orden de los datos **no importa**, y cuando quieres que leer, agregar y borrar datos siga siendo **rápido** sin importar qué tan grande sea el objeto. Una lista de invitados donde buscas a la gente por nombre, la configuración de una app, o la cuenta de cuántas veces aparece cada palabra en un texto encajan perfecto.

```viz
object-access
```

**Qué acaba de pasar:** `rsvps['Dev']` fue directo a la tarjeta de Dev, sin mirar antes a Ana, Ben ni Cleo. Leer a Eli, la clave que se agregó al final, costó exactamente lo mismo. Incluso con un millón de invitados, leer una clave es un solo paso. Leer una clave es **O(1)**, tiempo constante: el mejor Big O que existe, y el mismo que leer un array por su índice.

Hay dos formas de escribir una búsqueda por clave, y hacen lo mismo:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }

console.log(rsvps.Dev) // notación de punto
console.log(rsvps['Dev']) // notación de corchetes: la misma búsqueda

// Los corchetes te dejan usar una clave guardada en una variable
const guest = 'Cleo'
console.log(rsvps[guest])

// Una clave que no existe da undefined (sigue siendo un paso)
console.log(rsvps['Zoe'])
console.log(rsvps[0]) // no hay posiciones, así que no hay "primera" propiedad
```

Usa el **punto** cuando conoces la clave al escribir el código. Usa **corchetes** cuando la clave está en una variable, o tiene caracteres que el punto no acepta, como un espacio.

**Error común:** escribir `rsvps[0]` para obtener la "primera" respuesta. Un objeto no tiene posiciones, así que JavaScript busca una clave llamada `'0'`, no encuentra nada y devuelve `undefined`.

## Agregar, cambiar y quitar: O(1)

¿Cómo puede un objeto encontrar cualquier clave en un paso, sin índice? La respuesta completa llega en el módulo de **tablas hash**, donde vas a construir esto tú. Por ahora, esta es la idea. La memoria de una computadora es una fila larga de casillas numeradas, y no puede buscar directamente una casilla "llamada Dev". Entonces JavaScript pasa la clave por una función pequeña y rápida llamada **función hash**, que convierte `'Dev'` en un número de casilla. La misma clave da el mismo número, siempre. Piensa en un guardarropa: entregas tu abrigo y te dan un boleto con un número, y después el boleto te lleva directo a tu abrigo sin buscar en todo el perchero.

El mismo truco funciona para cada operación básica:

- **Insertar:** convierte la clave nueva en una casilla y guarda ahí el valor.
- **Acceder:** convierte la clave en su casilla y léela.
- **Actualizar:** es simplemente acceder y escribir un valor nuevo.
- **Eliminar:** convierte la clave en su casilla y vacíala.

Y como un objeto no tiene orden, **dónde** agregas una clave no importa. No hay principio, medio ni final, así que no hay nada que reindexar ni ninguna cascada.

```viz
object-insert-remove
```

**Qué acaba de pasar:** agregar a Fay, cambiar la respuesta de Ben y borrar a Cleo tocaron **una tarjeta** cada uno. Ninguna otra tarjeta se movió ni cambió. Compáralo con `unshift` y `shift` en un array, que tenían que reindexar cada elemento. Insertar, actualizar y eliminar una clave son **O(1)**.

Pruébalo:

```js-run
const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe' }

rsvps.Fay = 'yes' // insertar: una clave nueva
rsvps.Ben = 'yes' // actualizar: misma sintaxis, la clave ya existe
delete rsvps.Cleo // eliminar

console.log(rsvps)
```

Fíjate en que insertar y actualizar usan la misma sintaxis. Si la clave todavía no existe, se crea; si ya existe, su valor se reemplaza.

Una nota honesta: aquí O(1) describe cómo se comportan los objetos en la práctica, en promedio. En el módulo de tablas hash vas a ver los casos raros en los que dos claves caen en la misma casilla, y cómo los resuelven las tablas hash. Para el código de todos los días, trata estas operaciones como tiempo constante.

**Error común:** pensar que `delete` funciona como `shift`. Quitar una clave nunca mueve a las demás claves, porque no tienen posiciones que mover.

## Buscar un valor: O(n)

Esta es la única operación que no es rápida. **Buscar** no quiere decir leer una clave: ya vimos que eso es O(1). Quiere decir revisar si algún **valor** está guardado en alguna parte del objeto. ¿Alguien respondió `'maybe'`? ¿La respuesta de alguien es `'late'`?

La función hash solo funciona en una dirección: convierte una clave en una casilla. Nada convierte un valor en una casilla. Así que para encontrar un valor, la única forma es recorrer las propiedades una por una y revisar cada valor, igual que al buscar en un array desordenado.

```viz
trace-has-answer
```

**Qué acaba de pasar:** `hasAnswer` obtuvo la lista de nombres con `Object.keys` (lo vas a estudiar en la siguiente lección) y luego leyó la respuesta de cada invitado hasta encontrar una que coincidiera. Buscar `'maybe'` se detuvo en Cleo, la tercera invitada. Buscar `'late'` tuvo que revisar a todos los invitados antes de poder devolver `false`. Conforme crece la cantidad de propiedades, el peor caso crece con ella: buscar un valor es **O(n)**.

```js-run
function hasAnswer(rsvps, answer) {
  const names = Object.keys(rsvps)
  for (let i = 0; i < names.length; i++) {
    if (rsvps[names[i]] === answer) return true
  }
  return false
}

const rsvps = { Ana: 'yes', Ben: 'no', Cleo: 'maybe', Dev: 'yes', Eli: 'no' }
console.log(hasAnswer(rsvps, 'maybe')) // true, después de 3 revisiones
console.log(hasAnswer(rsvps, 'late')) // false, después de revisar a los 5
```

En la práctica, casi nunca necesitas buscar un valor en un objeto. Si te descubres haciéndolo una y otra vez, es señal de que los datos deberían guardarse de otra forma, con lo que buscas como **clave**. Vas a usar exactamente ese truco en el módulo de patrones para resolver problemas.

Este es el Big O de los objetos en una tabla:

| Operación                          | Big O |
| ---------------------------------- | ----- |
| Insertar una clave                 | O(1)  |
| Eliminar una clave                 | O(1)  |
| Acceder a (o actualizar) una clave | O(1)  |
| Buscar un valor                    | O(n)  |

Cuando no necesitas ningún orden, los objetos son una excelente opción: son rápidos en casi todo. El precio es que no tienen ningún orden. Los arrays, como vas a ver otra vez al final de este módulo, son lo contrario: su orden es útil, pero puede volver lentas algunas operaciones.

**Error común:** confundir "buscar" con "acceder". `rsvps['Dev']` es acceder, O(1). "¿Quién respondió maybe?" es buscar, O(n).

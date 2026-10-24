---
title: Elimina los términos no dominantes
order: 10
minutes: 12
---

> **Meta:** simplificar expresiones como O(n² + n) con la segunda regla: quedarse solo con el término que crece más rápido.

## Un bucle anidado y luego otro bucle

Eliminar los **términos no dominantes** es la segunda forma de simplificar Big O. Primero, dos palabras. Un **término** es una pieza de una expresión unida a las demás con `+`: en n² + 5n + 8, los términos son n², 5n y 8. El **término dominante** es el que crece más rápido cuando crece n; todos los demás son **no dominantes**. La regla dice: quédate con el término dominante y quita los demás.

¿Por qué se vale? Por la misma razón por la que quitamos las constantes: Big O solo describe la forma del crecimiento con entradas **grandes**. Cuando n es grande, el término que crece más rápido hace casi todo el trabajo, y los demás se encogen hasta ser un error de redondeo a su lado.

Este es un código con dos términos. Toma el bucle anidado de la lección anterior y agrégale un bucle normal después:

```js-run
function printAll(n) {
  let lines = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      lines = lines + 1 // imprimir i, j
    }
  }
  for (let k = 0; k < n; k++) {
    lines = lines + 1 // imprimir k
  }
  return lines
}

console.log(printAll(10)) // 100 del bucle anidado + 10 del último
```

Con 10, el bucle anidado hace de `0 0` a `9 9` (100 pasos), y el último bucle hace de 0 a 9 (10 pasos). El bucle anidado es O(n²), el último es O(n), así que juntos son **O(n² + n)**. Mira lo que aporta cada parte cuando n crece:

```viz
dominant-term
```

**Qué acaba de pasar:** con n = 2, la parte n era una buena parte del trabajo: 2 de 6 pasos. Con n = 10 eran 10 de 110. Con n = 100, n² era **10,000** mientras que la n extra solo agregaba **100**, menos del 1% del total. Con n = 1,000, la parte n era una rebanada mínima. **n²** es el **término dominante**, y la n sola es un **término no dominante**. Así que simplemente lo quitamos:

**O(n² + n) → O(n²)**

También puedes ver cómo se encoge la parte de la n con números:

```js-run
const sizes = [10, 100, 1000, 10000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const allSteps = n * n + n
  const share = (100 * n) / allSteps
  console.log('n =', n, '| n² + n =', allSteps, '| la parte n es el', share.toFixed(2) + '%')
}
```

**Error común:** dejar la respuesta como O(n² + n) porque se siente más precisa. Big O no intenta ser preciso: describe la forma con entradas grandes, y ahí n² + n y n² tienen la misma forma. La respuesta simplificada es la que se espera.

## Los términos pequeños no importan

La misma idea funciona con cualquier mezcla: quédate con el término que crece más rápido y quita los demás. Para encontrar el término dominante, compara cómo crece cada término, del más lento al más rápido: una constante (como 8) nunca crece, luego log n, luego n, luego n log n, luego n², luego n³. Gana el término que va más adelante en esa lista.

| Contaste     | Escríbelo así | Por qué                                                        |
| ------------ | ------------- | -------------------------------------------------------------- |
| n + 10       | O(n)          | 10 es una constante: nunca crece                               |
| 1,000n + 50  | O(n)          | quita el 50 y luego la constante 1,000                         |
| n² + 5n + 8  | O(n²)         | con n = 1,000: 1,000,000 contra solo 5,008 del resto           |
| n² + n³      | O(n³)         | n³ crece más rápido que n², así que n³ es el término dominante |
| 2n² + 7n + 3 | O(n²)         | quita 7n y 3, y luego la constante 2                           |

Mira n² + 5n + 8 con n = 1,000: eso es 1,000,000 + 5,000 + 8. La diferencia entre 1,005,008 y 1,000,000 es mínima, y eso solo con n = 1,000. Pon mil millones y la parte 5n + 8 no significa nada.

Otra forma de verlo: estira el eje de n de la gráfica hasta valores enormes. Entre más a la derecha vas, más se eleva la curva que crece más rápido sobre las demás, hasta que todo lo demás parece una línea plana abajo.

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** mientras la gráfica se estiraba hacia la derecha, O(n²) subió tanto por encima de las demás que O(n), O(log n) y O(1) quedaron apretadas en una franja delgada abajo. Si un código tuviera los cuatro tipos de trabajo, desde lejos solo se seguiría viendo la parte n². Esa es la parte con la que se queda Big O.

Este es un ejemplo resuelto paso a paso:

1. Empieza con O(2n² + 7n + 3).
2. Quita los términos no dominantes 7n y 3: O(2n²).
3. Quita la constante 2: **O(n²)**.

Usa las dos reglas juntas: quita los términos no dominantes y luego las constantes. Cuando tengas dudas, pon un número grande como n = 1,000 y mira qué parte queda en pie. Esto comprueba el ejemplo resuelto:

```js-run
const sizes = [10, 1000, 1000000]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  const full = 2 * n * n + 7 * n + 3
  const kept = 2 * n * n
  console.log('n =', n, '| 2n² + 7n + 3 =', full, '| solo 2n² =', kept, '| proporción:', (full / kept).toFixed(4))
}
```

La proporción se acerca cada vez más a 1: con n grande, los términos que quitamos casi no cambian nada.

Cuidado con las constantes grandes: O(n + 1,000,000) sigue siendo solo **O(n)**. Por grande que sea, un número fijo no crece, y cuando n es lo bastante grande, la parte n siempre gana.

**Error común:** comparar los términos con una n pequeña. Con n = 1,000, el 1,000,000 de n + 1,000,000 es mucho más grande que n, así que dan ganas de decir que el código es O(1). Pero Big O pregunta qué pasa cuando n sigue creciendo, y con n = mil millones, la parte n es mil veces más grande que la constante.

## Encuentra el término dominante en el código

Hasta ahora los términos llegaban ya escritos, como n² + 5n + 8. En el código real nadie te da la expresión: la armas tú, un bloque a la vez, y luego te quedas únicamente con la parte que crece más rápido. Los pasos:

1. Dale a cada bloque de código su costo: una línea simple (una cuenta, una asignación, leer por índice) es O(1), salvo que llame a un método que esconda un bucle; un bucle sobre la entrada es O(n); y un bucle dentro de otro bucle sobre la entrada es O(n²).
2. Suma los bloques que van **uno después del otro**.
3. Quédate con el término dominante y quita las constantes.

Esta es una función que prepara la fiesta, con el costo de cada bloque en un comentario:

```js-run
function prepareParty(guests) {
  console.log('Invitados:', guests.length) // O(1)

  for (let i = 0; i < guests.length; i++) {
    console.log('Gafete para ' + guests[i]) // O(n): un gafete por persona
  }

  let introductions = 0
  for (let i = 0; i < guests.length; i++) {
    for (let j = 0; j < guests.length; j++) {
      if (i !== j) {
        introductions = introductions + 1 // O(n²): cada persona conoce a todas las demás
      }
    }
  }
  console.log('Presentaciones:', introductions)
}

prepareParty(['Ana', 'Ben', 'Cleo', 'Dev'])
```

Al sumar los bloques queda O(1) + O(n) + O(n²). El bucle anidado es el término dominante, así que `prepareParty` es **O(n²)**. Con 4 personas son 4 gafetes y 12 presentaciones; con 1,000 personas, 1,000 gafetes y 999,000 presentaciones. Los gafetes casi no cuentan junto a las presentaciones.

Otras dos formas que vas a ver todo el tiempo:

- **Un bucle sobre la entrada y luego un bucle de largo fijo** (por ejemplo, poner 10 mesas): n + 10, así que **O(n)**. Un bucle que nunca crece es una constante, por grande que parezca.
- **Dos bucles anidados, uno después del otro:** n² + n² = 2n², y al quitar el 2 queda **O(n²)**. Dos copias del mismo término forman una constante más grande, no un término nuevo.

**Error común:** quedarte con el bloque que va primero, o con el que tiene más líneas. Dónde está un bloque y qué tan largo se ve no importan: busca el bloque que crece más rápido con la entrada, y con ese se queda Big O.

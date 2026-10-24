---
title: 'O(n²): un bucle dentro de otro'
order: 9
minutes: 10
---

> **Meta:** reconocer código O(n²) y entender por qué se considera ineficiente.

## Imprime cada asiento

Nuestra siguiente notación es **O(n²)**, que se lee "O de n al cuadrado". Es lo que obtienes cuando un bucle sobre la entrada está **dentro** de otro bucle sobre la misma entrada. Empieza con los dos bucles de la lección anterior, pero en lugar de ponerlos uno después del otro, pon uno dentro del otro, e imprime `i` y `j`.

La clave es cómo corre un **bucle anidado**. El bucle de afuera da un paso, y luego el bucle de adentro corre **completo**, de principio a fin. Solo entonces el bucle de afuera da su siguiente paso, y el de adentro vuelve a empezar desde el principio. Así que el bucle de adentro no corre n veces en total: corre n veces **por cada** paso del bucle de afuera. Con n pasos afuera y n pasos adentro de cada uno, el total es **n × n = n²**.

Míralo con una n pequeña:

```viz
trace-print-seats
```

**Qué acaba de pasar:** con n = 3, `i` empezó en 0, y el bucle de adentro imprimió `0 0`, `0 1`, `0 2`. Luego `i` pasó a 1 y el bucle de adentro empezó otra vez: `1 0`, `1 1`, `1 2`. Luego lo mismo con `i = 2`. Tres filas de tres: 9 líneas, que es 3². Elige n = 4 y obtienes 16.

Ejecútala con 10:

```js-run
function printSeats(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}

printSeats(10)
```

Recorre la salida: empieza en `0 0` y termina en `9 9`. Son **100 líneas**. Por cada uno de los 10 valores de `i`, el bucle de adentro corre 10 veces: **n × n = n²**. De ahí sale O(n²).

**Error común:** sumar los dos bucles en vez de multiplicarlos. Dos bucles de 10 uno después del otro imprimen 10 + 10 = 20 líneas. Dos bucles de 10 **uno dentro del otro** imprimen 10 × 10 = 100. Dónde está el segundo bucle lo cambia todo.

## La cuadrícula

Una cuadrícula es una buena forma de imaginar O(n²). Cada **fila** es un paso del bucle de afuera, y cada fila tiene una **celda** por cada paso del bucle de adentro. Con n filas y n columnas, hay n × n celdas, y el código visita cada una. En nuestra fiesta, imagina que cada persona invitada saluda a todas las demás: una fila por persona, una celda por saludo.

La cuadrícula también muestra por qué O(n²) crece tan rápido. Haz la lista el doble de larga y la cuadrícula tiene el doble de filas **y** el doble de columnas, así que tiene **4 veces** más celdas. Diez veces más invitados significa cien veces más celdas.

```viz
nested-grid
```

**Qué acaba de pasar:** cada fila era una persona, y en cada fila el bucle de adentro recorrió cada columna. 3 invitados llenaron una cuadrícula de 3 × 3: 9 celdas. Luego la lista se duplicó a 6 invitados, y la cuadrícula se volvió de 6 × 6 = 36 celdas. El doble de invitados, cuatro veces el trabajo. (Las celdas grises eran una persona encontrándose consigo misma, que el código se salta, pero el bucle igual las visita.)

También vas a escuchar que esto se llama **tiempo cuadrático**, y en general **tiempo polinomial**: cada bucle anidado sobre la entrada agrega otra potencia de n. Tres bucles anidados uno dentro del otro corren n × n × n veces, que es **O(n³)**.

Y un bucle anidado sigue siendo O(n²) aunque el de adentro sea más corto. Si el bucle de adentro solo llega hasta `i` (`for (let j = 0; j <= i; j++)`), corre 1 + 2 + … + n veces en total. Eso es n(n + 1) / 2, la fórmula de la lección 2: más o menos n² / 2. Quita la constante, y sigue siendo **O(n²)**. Antes de ejecutarlas, predice los dos conteos para n = 10:

```js-run
function countTriples(n) {
  let count = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        count = count + 1
      }
    }
  }
  return count
}

function countTriangle(n) {
  let count = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      count = count + 1
    }
  }
  return count
}

console.log(countTriples(10)) // n × n × n: O(n³)
console.log(countTriangle(10)) // más o menos n² / 2: sigue siendo O(n²)
```

**Error común:** decidir que un bucle de adentro más corto hace que el código sea O(n). El bucle de adentro se alarga conforme crece `i`, así que el total sigue siendo como la mitad de n², y la mitad de una curva que se dobla hacia arriba sigue doblándose hacia arriba.

## Por qué es ineficiente

Ahora sí podemos comparar dos códigos con Big O de verdad. Si dos funciones hacen el mismo trabajo, y una es O(n²) mientras la otra es O(n), el **código O(n) es mejor**: termina la tarea con muchas menos operaciones, y la diferencia crece con cada elemento extra.

| n     | O(n)  | O(n²)     |
| ----- | ----- | --------- |
| 10    | 10    | 100       |
| 100   | 100   | 10,000    |
| 1,000 | 1,000 | 1,000,000 |

O(n²) en general se considera **ineficiente**. Muchas veces se siente bien cuando lo pruebas con pocos elementos, y luego se arrastra con datos reales. Si puedes reescribir tu código para que sea O(n), va a ser mucho más eficiente. Esa es una pregunta muy común en las entrevistas: la primera idea para un problema es O(n²), y quien te entrevista pregunta: "¿Puedes hacerlo mejor?"

Pon O(n²) en la gráfica junto a O(n) y la diferencia salta a la vista:

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** O(n) subió como una línea recta, y O(n²) se curvó hacia arriba y la dejó muy atrás. Con n = 1,000, O(n²) ya iba en un millón de operaciones mientras O(n) seguía en mil.

Míralo con números reales. Cada vez que n se duplica, fíjate qué pasa con los asientos:

```js-run
function countSeats(n) {
  let seats = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      seats = seats + 1
    }
  }
  return seats
}

const sizes = [1000, 2000, 4000]
for (let k = 0; k < sizes.length; k++) {
  console.log('n =', sizes[k], '| asientos:', countSeats(sizes[k]))
}
```

1 millón, luego 4 millones, luego 16 millones: cada vez que la entrada se duplica, el trabajo se cuadruplica. Más adelante en el curso vas a aprender patrones que convierten muchas soluciones O(n²) en O(n), y algoritmos de ordenamiento como bubble sort que son O(n²).

**Error común:** probar código O(n²) con cinco elementos y decidir que es rápido. Con 5 elementos hace 25 pasos, que se siente instantáneo. Con 100,000 elementos hace 10 mil millones. Pregúntate siempre qué pasa cuando la entrada es grande.

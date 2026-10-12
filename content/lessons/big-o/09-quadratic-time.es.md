---
title: 'O(n²): un bucle dentro de otro'
order: 9
minutes: 7
---

> **Meta:** reconocer código O(n²) y entender por qué se considera ineficiente.

## Imprime cada pareja

Nuestra siguiente notación es **O(n²)**, que se lee "O de n al cuadrado". Empieza con los dos bucles de la lección anterior, pero en lugar de ponerlos uno después del otro, pon uno **dentro** del otro, e imprime `i` y `j`:

```viz
trace-print-pairs
```

Ejecútalo con 10:

```js-run
function printPairs(n) {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(i, j)
    }
  }
}

printPairs(10)
```

Revisa el resultado: empieza en `0 0` y termina en `9 9`. Son **100 líneas**. Por cada uno de los 10 valores de `i`, el bucle de adentro corre 10 veces: **n × n = n²**. De ahí sale O(n²).

## La cuadrícula

```viz
nested-grid
```

Una cuadrícula es una buena forma de imaginarlo. Cada fila es un paso del bucle de afuera, y cada fila tiene una celda por cada paso del bucle de adentro. Con n filas y n columnas hay n² celdas. Por eso duplicar la entrada hace **4 veces** el trabajo: 3 invitados hacen 9 celdas, 6 invitados hacen 36.

También vas a escuchar que se llama **tiempo cuadrático**, y en general **tiempo polinomial**: cada bucle anidado sobre la entrada agrega otra potencia de n. Tres bucles uno dentro de otro corren n × n × n veces:

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

console.log(countTriples(10)) // 1000: n × n × n = O(n³)
```

Cuidado: un bucle anidado sigue siendo O(n²) aunque el bucle de adentro sea más corto. Si el de adentro solo llega hasta `i` (`for (let j = 0; j <= i; j++)`), en total corre 1 + 2 + … + n veces, que es más o menos n² / 2. Quita la constante: sigue siendo **O(n²)**.

## Por qué es ineficiente

```viz
big-o-growth-chart
```

Pon O(n²) en la gráfica junto a O(n) y la diferencia salta a la vista: O(n) es una línea recta, O(n²) se curva hacia arriba y la deja muy atrás.

| n     | O(n)  | O(n²)     |
| ----- | ----- | --------- |
| 10    | 10    | 100       |
| 100   | 100   | 10,000    |
| 1,000 | 1,000 | 1,000,000 |

Así que si tienes dos códigos que hacen el mismo trabajo, y uno es O(n²) mientras el otro es O(n), **el código O(n) es mejor**: termina la tarea con muchísimas menos operaciones. Esta es nuestra primera oportunidad real de comparar dos códigos con Big O.

O(n²) en general se considera **ineficiente**. Muchas veces se siente bien cuando lo pruebas con pocos elementos, y luego se arrastra con datos reales. Si puedes reescribir tu código para que sea O(n), va a ser mucho más eficiente. Esa es una pregunta muy común en las entrevistas: la primera idea para un problema es O(n²), y el entrevistador pregunta: "¿Puedes hacerlo mejor?" Más adelante en el curso vas a aprender patrones que convierten muchas soluciones O(n²) en O(n), y algoritmos de ordenamiento como bubble sort que son O(n²).

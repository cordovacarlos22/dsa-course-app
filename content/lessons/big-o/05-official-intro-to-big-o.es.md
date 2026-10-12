---
title: La introducción oficial a Big O
order: 5
minutes: 8
---

> **Meta:** conocer el significado oficial de Big O y usarlo con cuatro ejemplos.

## Contar "a ojo", ahora oficial

```viz
big-o-growth-chart
```

Hemos estado hablando de Big O sin presentarlo oficialmente. Aquí está: **la notación Big O es una forma formal de contar "a ojo".** Nos deja hablar con precisión de **cómo crece el tiempo de ejecución de un algoritmo cuando crece su entrada**. Eso es todo: una descripción de la relación entre el tamaño de la entrada y el tiempo que tarda el código.

Ignora los detalles pequeños y se queda solo con la tendencia general. Ya vimos dos tendencias:

- Con la versión de `sumUpTo` que usa la fórmula, el tamaño de n no cambia el tiempo para nada.
- Con la versión del bucle, cuando n crece, el tiempo de ejecución crece con él en una relación más o menos de uno a uno.

Cuando no estés seguro con un código, pregúntate: _cuando la entrada crece, ¿cómo se va a ver esta gráfica?_ ¿El tiempo se queda plano, crece en línea recta o se dispara?

## La definición

```viz
same-shape
```

Esta es la definición oficial. Se ve aterradora, así que justo después la desarmamos:

> Decimos que un algoritmo es **O(f(n))** si el número de operaciones simples que tiene que hacer la computadora es **tarde o temprano menor que una constante por f(n)**, cuando n crece.

`f(n)` solo quiere decir "alguna función de n": una fórmula que convierte el tamaño de la entrada en una cantidad de trabajo. Las más comunes son:

- **f(n) = n**: lineal. Cuando n crece, el tiempo crece en proporción.
- **f(n) = n²**: cuadrática. El tiempo crece con el cuadrado de n.
- **f(n) = 1**: constante. Cuando n crece, el tiempo no cambia.
- …y algunas más que vas a conocer pronto, como log n.

"Tarde o temprano menor que una constante por f(n)" es lo que hace que Big O cuente "a ojo". La versión con el bucle hace unas 5n + 2 operaciones. Cuando n es al menos 2, eso nunca es mayor que 6 × n, así que es **O(n)**. No importa si la cuenta es 1n, 5n o 50n: en una gráfica gigante, todas son líneas rectas, y las simplificamos a solo n.

Una cosa más que recordar: Big O describe el **peor caso**, el límite superior del tiempo de ejecución. Sea cual sea la entrada, el código no va a hacerlo peor que esto.

## Cuatro ejemplos

```viz
trace-print-pairs
```

Pongámosle etiqueta a cuatro funciones:

1. **`sumUpToFormula(n)`** siempre hace 3 operaciones. La línea es plana: **O(1)**.
2. **`sumUpTo(n)`** con un bucle hace unas 5n + 2 operaciones: **O(n)**.
3. **`countUpAndDown(n)`** cuenta hacia arriba de 0 a n − 1 y luego de regreso hacia abajo. Ejecútala:

```js-run
function countUpAndDown(n) {
  console.log('Going up!')
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  console.log('At the top! Going down...')
  for (let j = n - 1; j >= 0; j--) {
    console.log(j)
  }
  console.log('Back down.')
}

countUpAndDown(3)
```

Cada bucle crece con n, así que el total es unas 2n. Quizá quieras llamarla O(2n), pero recuerda: nos importa el panorama general, así que es simplemente **O(n)**.

4. **`printPairs(n)`** imprime cada pareja de números de 0 a n − 1 con un bucle **dentro** de otro bucle (es la animación de arriba). No es O(2n): como los bucles están anidados, cada uno corre n veces **por cada paso** del otro. Cuenta las parejas:

```js-run
function printPairs(n) {
  let pairs = 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      pairs = pairs + 1
    }
  }
  return pairs
}

console.log('n = 2:', printPairs(2), 'pairs') // 4
console.log('n = 3:', printPairs(3), 'pairs') // 9
console.log('n = 4:', printPairs(4), 'pairs') // 16
```

2 → 4, 3 → 9, 4 → 16: el tiempo crece como n × n, así que es **O(n²)**. Eso crece mucho más rápido que O(n): prueba con n = 1,000 y obtienes un millón de parejas.

Así que nuestras cuatro funciones son: constante, lineal, lineal y cuadrática. Si esto se siente como mucho, es normal. Las siguientes lecciones ven cada forma con calma, una por una.

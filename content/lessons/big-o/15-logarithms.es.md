---
title: 'Logaritmos y O(log n)'
order: 15
minutes: 9
---

> **Meta:** entender qué es un logaritmo (con la menor cantidad de matemáticas posible) y por qué O(log n) es tan rápido.

## Lo contrario de un exponente

Algunos algoritmos tienen un Big O que no es O(1), O(n) ni O(n²). Uno que aparece más de lo que esperarías involucra **logaritmos**, así que aquí va la versión corta. Ya sea que aprendiste logaritmos en la escuela y los olvidaste, o que nunca los aprendiste, no necesitas ser un experto en matemáticas.

Un **logaritmo es lo contrario de un exponente**, igual que la división es lo contrario de la multiplicación. Así como 2 × 0.5 = 1 se puede voltear y queda 1 ÷ 2 = 0.5, un exponente se puede voltear y queda un logaritmo:

- **2³ = 8** quiere decir "multiplica tres 2 y obtienes 8".
- **log₂(8) = 3** pregunta lo mismo al revés: "¿2 a **qué** potencia da 8?" La respuesta es 3.

En general: log₂(valor) = exponente, y 2^exponente = valor.

```viz
halving-count
```

Esta es la regla práctica que lo hace fácil: **el logaritmo en base 2 de un número es más o menos cuántas veces puedes dividirlo entre 2 antes de llegar a 1 o menos.** 8 → 4 → 2 → 1 son 3 divisiones, así que log₂(8) = 3. 16 necesita 4, así que log₂(16) = 4.

Los números que no se dividen exacto quedan en medio. 25 → 12.5 → 6.25 → 3.125 → 1.56 → 0.78: pasamos el 1 entre la 4.ª y la 5.ª división, y log₂(25) es más o menos 4.64:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(25)) // about 4.64
console.log(Math.log2(1000000)) // about 20
```

Los logaritmos pueden tener otras bases: log₃, log₁₀, y uno que se llama "logaritmo natural". Técnicamente siempre necesitas una base, pero en Big O la base no cambia la forma de la curva, así que la quitamos y solo escribimos **log n**.

## Dividir y conquistar

```viz
binary-search-halving
```

¿Dónde aparecen los logaritmos en el código? Toma un array **ordenado** de 8 números, del 1 al 8, y busca el número 1. La forma inteligente: parte el array a la mitad y pregunta: "¿El 1 está en la primera mitad o en la segunda?" No está en la segunda, así que ni siquiera tenemos que mirar esos números. Parte otra vez a la mitad lo que queda, y otra vez, y lo encontramos.

Cuenta los pasos: **3**. El array tenía **8** elementos, y 2³ = 8. Eso es log₂(8) = 3. Esta técnica se llama **dividir y conquistar**, y solo funciona porque los datos están **ordenados**.

Partir 8 elementos a la mitad quizá no parezca gran cosa. Pero con un millón de elementos, el primer corte te ahorra mirar medio millón. Y con **2,147,483,648** elementos (eso es 2³¹, más de dos mil millones), dividir y conquistar encuentra cualquier elemento en **31 pasos**. Revisando los elementos uno por uno, encontrar el último tomaría más de dos mil millones de revisiones. Ese es el poder de **O(log n)**. La animación hace lo mismo con nuestra lista de invitados, ordenada de la A a la Z.

## Dónde aparecen los logaritmos

```viz
big-o-growth-chart
```

En la gráfica, O(log n) es un poco empinada justo al principio y luego se queda **muy plana**. No tan plana como O(1), pero muy eficiente comparada con O(n) y O(n²): mil veces más datos agregan solo unos 10 pasos más.

Hay una notación más que vale la pena ver: **O(n log n)**, a veces llamada **linearítmica**. Es el tiempo de los mejores algoritmos de ordenamiento de uso general, como merge sort y quick sort, que dividen los datos una y otra vez y los vuelven a juntar. No es tan buena como O(n), pero es mucho mejor que O(n²). Es lo más eficiente que puede ser un algoritmo de ordenamiento cuando tiene que ordenar cualquier tipo de dato, como textos. (Los algoritmos que solo ordenan números a veces pueden hacerlo mejor; vas a ver uno más adelante.)

Vas a volver a ver logaritmos en:

- **algoritmos de búsqueda**, como la búsqueda binaria: O(log n),
- **algoritmos de ordenamiento eficientes**: O(n log n),
- **la recursión**, donde describen el **espacio** que usan algunas funciones recursivas.

De aquí en adelante, casi todo en este curso va a ser uno de estos: **O(1), O(log n), O(n), O(n log n) u O(n²)**.

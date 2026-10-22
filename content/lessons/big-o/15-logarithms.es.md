---
title: 'Logaritmos y O(log n)'
order: 15
minutes: 12
---

> **Meta:** entender qué es un logaritmo (con la menor cantidad de matemáticas posible) y por qué O(log n) es tan rápido.

## Lo contrario de un exponente

Algunos algoritmos tienen un Big O que no es O(1), O(n) ni O(n²). Uno que aparece más de lo que esperarías tiene que ver con **logaritmos**, así que aquí va la versión corta. Ya sea que aprendiste logaritmos en la escuela y los olvidaste, o que nunca los aprendiste, no necesitas ser experto en matemáticas.

Un **logaritmo es lo contrario de un exponente**, igual que la división es lo contrario de la multiplicación. Así como 2 × 0.5 = 1 se puede voltear en 1 ÷ 2 = 0.5, un exponente se puede voltear en un logaritmo:

- **2³ = 8** significa "multiplica tres 2 entre sí y obtienes 8".
- **log₂(8) = 3** pregunta lo mismo al revés: "¿2 elevado a **qué** potencia da 8?" La respuesta es 3.

En general: log₂(valor) = exponente, y 2^exponente = valor. El 2 chiquito es la **base**: log₂ es el **logaritmo binario**, el que más aparece en el código, porque muchísimos algoritmos parten las cosas en dos.

Esta es la regla práctica que lo hace fácil: **el logaritmo binario de un número es más o menos cuántas veces lo puedes dividir entre 2 antes de llegar a 1 o menos.** No necesitas una fórmula, solo contar mitades.

```viz
halving-count
```

**Qué acaba de pasar:** 16 cajas se partieron a la mitad una y otra vez: 16 → 8 → 4 → 2 → 1. Son 4 mitades, así que log₂(16) = 4. Luego el último texto dio un salto: 1,024 cajas necesitan solo 10 mitades, y un millón necesita unas 20. La entrada creció mil veces, pero la cuenta de mitades solo se duplicó.

Los números que no se dividen exacto caen en medio. 25 → 12.5 → 6.25 → 3.125 → 1.56 → 0.78: pasamos el 1 entre la 4ª y la 5ª división, y log₂(25) es más o menos 4.64. JavaScript los calcula con `Math.log2`, y un bucle que parte a la mitad da las mismas cuentas:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(25)) // más o menos 4.64
console.log(Math.log2(1000000)) // más o menos 20

// La misma idea con un bucle: cuenta las mitades hasta que quede 1.
let boxes = 16
let halvings = 0
while (boxes > 1) {
  boxes = boxes / 2
  halvings++
}
console.log('16 cajas:', halvings, 'mitades')
```

Los logaritmos pueden tener otras bases: log₃, log₁₀ y uno que se llama "logaritmo natural". Técnicamente siempre necesitas una base, pero en Big O la base no cambia la forma de la curva, así que la dejamos fuera y escribimos solo **log n**.

**Error común:** pensar que log n significa "n entre 2". La mitad de un millón es 500,000; log₂ de un millón es más o menos 20. El logaritmo no es una mitad: es **cuántas** mitades se necesitan para llegar a 1.

## Dividir y conquistar

¿Dónde aparecen los logaritmos en el código? En cualquier lugar donde un algoritmo pueda **tirar la mitad del trabajo** en cada paso. Toma un array **ordenado** de 8 números, del 1 al 8, y busca el número 1. La forma inteligente: mira la mitad y pregúntate qué mitad podría tener el 1. El array está ordenado, así que el 1 solo puede estar en la mitad izquierda, y todos los números de la derecha se pueden saltar sin mirarlos. Parte lo que queda de la misma forma, una vez más, y encuentras el 1.

Cuenta los pasos: **3**. El array tenía **8** elementos, y 2³ = 8. Eso es log₂(8) = 3. Esta técnica se llama **dividir y conquistar**, y solo funciona porque los datos están **ordenados**: estar ordenados es lo que te dice qué mitad no puede tener la respuesta.

Partir 8 elementos a la mitad quizá no parezca gran cosa. Pero con un millón de elementos, el primer corte te ahorra mirar medio millón de ellos. Y con **2,147,483,648** elementos (eso es 2³¹, más de dos mil millones), dividir y conquistar encuentra cualquier elemento en **31 pasos**. Mirando los elementos uno por uno, encontrar el último tomaría más de dos mil millones de revisiones. Ese es el poder de **O(log n)**. La animación hace lo mismo con nuestra lista de invitados, ordenada de la A a la Z:

```viz
binary-search-halving
```

**Qué acaba de pasar:** la búsqueda miró el nombre de en medio de la lista ordenada y lo comparó con el nombre que buscaba. Como la lista está en orden alfabético, esa sola comparación le dijo qué mitad no podía tener el nombre, así que tiró esa mitad. Repitió eso con lo que quedaba, y encontró el nombre después de 3 revisiones en una lista de 8: log₂(8) = 3.

Cuenta las mitades para listas cada vez más grandes. Fíjate qué tan despacio crece la respuesta:

```js-run
function halvingsToOne(n) {
  let remaining = n
  let steps = 0
  while (remaining > 1) {
    remaining = Math.floor(remaining / 2)
    steps++
  }
  return steps
}

const sizes = [8, 1000, 1000000, 2147483648]
for (let i = 0; i < sizes.length; i++) {
  console.log(sizes[i], 'elementos:', halvingsToOne(sizes[i]), 'mitades')
}
```

**Error común:** usar dividir y conquistar con datos que no están ordenados. En una lista desordenada, el nombre de en medio no te dice nada sobre dónde está el nombre que buscas, así que no puedes tirar la mitad. Entonces vuelves a revisar los elementos uno por uno: O(n).

## Dónde aparecen los logaritmos

En la gráfica, O(log n) sube un poco al principio y luego se queda **muy plana**. No tan plana como O(1), pero muy eficiente comparada con O(n) y O(n²): mil veces más datos agregan solo unos 10 pasos más.

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** O(1) se quedó perfectamente plana, y O(log n) subió un poco al principio y luego casi no se movió, mientras O(n) y O(n²) seguían subiendo. De mejor a peor: O(1), O(log n), O(n), O(n²).

Hay una notación más que vale la pena ver: **O(n log n)**, a veces llamada **linearítmica**. Es lo que obtienes cuando un algoritmo hace trabajo O(n) en cada uno de log n niveles, y es el tiempo de los mejores algoritmos de **ordenamiento** de uso general, como merge sort y quick sort, que parten los datos una y otra vez y luego los vuelven a juntar. No es tan bueno como O(n), pero es mucho mejor que O(n²). Es lo más eficiente que puede ser un algoritmo de ordenamiento cuando tiene que ordenar cualquier tipo de dato, como textos. (Los algoritmos que solo ordenan números a veces pueden hacerlo mejor; vas a ver uno más adelante.)

```viz
sort-growth-chart
```

**Qué acaba de pasar:** O(n log n) quedó justo arriba de la línea recta de O(n), y muy por debajo de O(n²). Ahí cae un buen ordenamiento: un poco más que una pasada por los datos, y muy lejos de comparar cada pareja.

Ejecuta los números para un millón de elementos:

```js-run
const n = 1000000
const logN = Math.round(Math.log2(n))
console.log('O(log n):  ', logN)
console.log('O(n):      ', n)
console.log('O(n log n):', n * logN)
console.log('O(n²):     ', n * n)
```

Vas a encontrar logaritmos otra vez en:

- **algoritmos de búsqueda**, como la búsqueda binaria: O(log n),
- **algoritmos de ordenamiento eficientes**: O(n log n),
- **recursión**, donde describen el **espacio** que usan algunas funciones recursivas.

A partir de aquí, casi todo en este curso va a ser uno de estos: **O(1), O(log n), O(n), O(n log n) u O(n²)**.

**Error común:** confundir O(log n) con O(n log n). O(log n) es mejor que O(n): es la búsqueda binaria, que se salta casi todos los datos. O(n log n) es un poco **peor** que O(n): es ordenar, que tiene que tocar cada elemento varias veces.

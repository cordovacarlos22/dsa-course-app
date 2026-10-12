---
title: 'Logaritmos y O(log n)'
order: 13
minutes: 7
---

> **Meta:** entender qué es un logaritmo (sin matemáticas que asusten) y por qué O(log n) es tan rápido.

## Un logaritmo cuenta mitades

Un logaritmo es lo **contrario de un exponente**, igual que la división es lo contrario de la multiplicación. 2³ = 8 quiere decir "multiplica tres 2 y obtienes 8". El logaritmo hace la pregunta al revés: **log₂(8) = 3**, "¿cuántos 2 tienes que multiplicar para llegar a 8?"

Una forma más fácil de pensarlo: **¿cuántas veces puedes partir un número a la mitad hasta llegar a 1?**

```viz
halving-count
```

16 → 8 → 4 → 2 → 1 son 4 mitades, así que log₂(16) = 4. Los números que no se parten exacto quedan en medio: 20 → 10 → 5 → 2.5 → 1.25 → 0.625 pasa por el 1 en algún punto entre la 4.ª y la 5.ª mitad, y log₂(20) es más o menos 4.3:

```js-run
console.log(Math.log2(8)) // 3
console.log(Math.log2(16)) // 4
console.log(Math.log2(20)) // about 4.3
console.log(Math.log2(1000000)) // about 20
```

Los logaritmos pueden usar otras bases, como log₁₀, pero en Big O la base no cambia la forma de la curva, así que solo escribimos **log n**.

## Busca un nombre en una lista ordenada

```viz
binary-search-halving
```

Los logaritmos aparecen cuando el código **parte el problema a la mitad** en cada paso. Si la lista de invitados está **ordenada de la A a la Z**, no tienes que leerla nombre por nombre. Mira el nombre del medio: si el nombre que buscas va después en orden alfabético, descarta toda la mitad izquierda. Repite con la mitad que queda.

Eso es la **búsqueda binaria**, un algoritmo de "dividir y conquistar". Cada revisión descarta la mitad de lo que queda, así que el número de revisiones es el número de mitades: **O(log n)**. Con 1,000,000 de nombres ordenados necesita unas **20** revisiones, mientras que leerlos uno por uno podría tomar un millón. Solo funciona porque la lista está ordenada.

## Dónde aparecen los logaritmos

```viz
big-o-growth-chart
```

En la gráfica, O(log n) sube un poco al principio y después se queda casi plano. No es tan bueno como O(1), pero es mucho mejor que O(n): mil veces más invitados agregan solo unas 10 revisiones más.

Vas a volver a ver logaritmos más adelante en el curso:

- **Buscar** en datos ordenados, como la búsqueda binaria y los árboles de búsqueda: O(log n).
- **Los mejores algoritmos de ordenamiento de uso general**, como merge sort: **O(n log n)**. Son n elementos por log n rondas de división, que queda entre O(n) y O(n²).
- **La recursión**, donde describen cuánta memoria usa una función que se llama a sí misma.

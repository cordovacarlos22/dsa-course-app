---
title: 'Logaritmos y O(log n)'
order: 11
minutes: 7
---

> **Meta:** entender qué es un logaritmo (sin matemáticas que asusten) y por qué O(log n) es tan rápido.

## Un juego de adivinar

Estoy pensando en un número del 1 al 100. Después de cada intento te digo "más alto" o "más bajo". La estrategia inteligente es siempre decir el **número del medio** de lo que queda, así cada respuesta descarta la mitad de las posibilidades.

¿Cuántos intentos necesitas, como máximo? Contemos cuántas veces podemos cortar 100 a la mitad hasta que quede un solo número:

```js-run
function halvings(n) {
  let steps = 0
  while (n > 1) {
    n = Math.ceil(n / 2) // nos quedamos con la mitad más grande, por si acaso
    steps++
  }
  return steps
}

for (const n of [8, 100, 1000, 1000000, 1000000000]) {
  console.log(n, 'posibilidades →', halvings(n), 'intentos como máximo')
}
```

¡Solo **30 intentos** para **mil millones** de posibilidades! Esa cuenta es el **logaritmo**.

## Qué significa un logaritmo

**log₂(n)** responde una sola pregunta: _¿cuántas veces puedes cortar `n` a la mitad hasta llegar a 1?_ Dicho de otra forma: _¿2 elevado a qué potencia da `n`?_

- log₂(8) = 3, porque 2 × 2 × 2 = 8
- log₂(1,024) = 10
- log₂(unos mil millones) ≈ 30

En Big O simplemente escribimos **log n**: la base no cambia la forma del crecimiento.

## Búsqueda binaria: O(log n) en acción

La búsqueda binaria encuentra un elemento en un array **ordenado** igual que en el juego de adivinar: mira el centro y descarta la mitad que no puede contener el objetivo. Recórrela paso a paso:

```viz
binary-search-halving
```

Esa técnica de cortar el problema a la mitad una y otra vez se llama **dividir y conquistar**. Cuando la escuches, piensa en O(log n). Solo funciona porque los datos están ordenados; en un array desordenado tendrías que revisar todo, O(n).

## Dónde vas a ver logaritmos

- **O(log n):** la búsqueda binaria y la búsqueda en árboles balanceados (más adelante en el curso).
- **O(n log n):** los mejores algoritmos de ordenamiento de uso general, como merge sort. Son `n` elementos por `log n` niveles de división. Lo vas a construir tú mismo en el módulo de Merge Sort.

## Resumen

- log₂(n) = cuántas veces puedes dividir `n` a la mitad hasta llegar a 1.
- **O(log n)** crece increíblemente lento: mil millones de elementos → unos 30 pasos.
- "Dividir y conquistar" → O(log n). Un buen ordenamiento → O(n log n).

## Compruébalo tú mismo

1. ¿Cuánto es log₂(16)?
2. ¿Por qué la búsqueda binaria necesita un array ordenado?
3. Si n pasa de 1,000 a 1,000,000, ¿más o menos cuántos pasos más necesita un algoritmo O(log n)?

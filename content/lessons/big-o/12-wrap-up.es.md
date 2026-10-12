---
title: 'Repaso: comparando el crecimiento'
order: 12
minutes: 6
---

> **Meta:** poner todas las notaciones de Big O una al lado de la otra y conocer las palabras que se usan para cada una.

## Los números lado a lado

Calculemos más o menos cuántos pasos necesita cada Big O a medida que `n` crece:

```js-run
const rows = [10, 100, 1000, 1000000].map((n) => ({
  n,
  'O(1)': 1,
  'O(log n)': Math.round(Math.log2(n)),
  'O(n)': n,
  'O(n log n)': Math.round(n * Math.log2(n)),
  'O(n²)': n * n,
}))

for (const row of rows) console.log(row)
```

Con n = 1,000,000, O(log n) necesita unos **20** pasos, O(n) necesita **un millón** y O(n²) necesita **un billón** (un millón de millones). Esa diferencia es la razón por la que elegir el algoritmo correcto importa más que tener una computadora más rápida.

### Las formas

```viz
big-o-growth-chart
```

## El vocabulario

Vas a escuchar estas palabras en entrevistas y en la documentación:

| Big O      | Nombre       | Vas a escuchar…                 | Ejemplo                   |
| ---------- | ------------ | ------------------------------- | ------------------------- |
| O(1)       | constante    | "tiempo constante"              | `arr[i]`, `obj.key`       |
| O(log n)   | logarítmico  | "dividir y conquistar"          | búsqueda binaria          |
| O(n)       | lineal       | "proporcional"                  | un bucle sobre la entrada |
| O(n log n) | linearítmico | "el mejor ordenamiento general" | merge sort                |
| O(n²)      | cuadrático   | "un bucle dentro de otro bucle" | comparar cada pareja      |

De mejor a peor: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

## Las reglas que aprendiste

1. **Cuenta pasos, no segundos.**
2. Big O significa el **peor caso** (Ω mejor, Θ promedio).
3. **Elimina las constantes:** O(2n) → O(n).
4. **Elimina los términos no dominantes:** O(n² + n) → O(n²).
5. **Entradas distintas, variables distintas:** O(a + b), O(a · b).
6. Mide también el **espacio**, no solo el tiempo.

### Lo que sigue

Próximo módulo: el Big O de las herramientas que usas todos los días, los **arrays y los objetos**. Después vas a aprender un método paso a paso para resolver problemas que nunca has visto.

Antes de seguir, haz el **cuestionario de Big O** en la página del módulo y prueba los **problemas de entrevista de Big O**.

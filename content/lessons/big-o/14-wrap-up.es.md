---
title: 'Repaso: todas las formas'
order: 14
minutes: 6
---

> **Meta:** poner todos los Big O lado a lado y conocer las palabras que se usan para cada uno.

## Los números lado a lado

```viz
big-o-growth-chart
```

¿Qué tan lejos están de verdad estas formas? Ejecuta esto para contar los pasos con 100 y con 1,000 invitados:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

Con 100 invitados: 1, unos 7, 100 y 10,000 pasos. Con 1,000 invitados: 1, unos 10, 1,000 y **1,000,000**. La diferencia entre O(n) y O(n²) ya es enorme con mil elementos, y las apps reales manejan millones. Por eso elegir el algoritmo correcto importa más que comprar una computadora más rápida.

## Las palabras que se usan

```viz
search-cases
```

| Big O      | Nombre      | Vas a escuchar…                 | Ejemplo con la lista de invitados      |
| ---------- | ----------- | ------------------------------- | -------------------------------------- |
| O(1)       | constante   | "tiempo constante"              | `guests[3]`, `guests.length`           |
| O(log n)   | logarítmico | "dividir y conquistar"          | búsqueda binaria en una lista ordenada |
| O(n)       | lineal      | "proporcional"                  | dar la bienvenida a cada invitado      |
| O(n log n) | n log n     | "el mejor ordenamiento general" | ordenar (más adelante en el curso)     |
| O(n²)      | cuadrático  | "un bucle dentro de otro bucle" | cada invitado saluda a cada invitado   |

Una gran referencia gratuita es el **Big O Cheat Sheet** en bigocheatsheet.com. Su gráfica también muestra O(2ⁿ) y O(n!), que crecen todavía más rápido que O(n²); casi nunca los vas a ver en código de todos los días. Sus tablas muestran estructuras de datos y algoritmos de ordenamiento con columnas para el mejor caso (Ω), el promedio (Θ) y el peor (O), además del espacio. Vas a notar que algunos ordenamientos son rápidos pero necesitan memoria extra, mientras que otros casi no usan memoria pero son lentos: otra vez el intercambio entre tiempo y espacio. Vuelve a esa página a medida que aprendas cada tema.

## Las reglas que aprendiste

```viz
dominant-term
```

1. **Cuenta pasos, no segundos.** Big O depende del algoritmo, no de la computadora.
2. Big O es el **peor caso** (Ω es el mejor caso, Θ el promedio).
3. **Elimina las constantes:** O(2n) → O(n), O(500) → O(1).
4. **Elimina los términos no dominantes:** O(n² + n) → O(n²).
5. **Entradas distintas, letras distintas:** O(a + b) y O(a · b).
6. **Mide también el espacio:** la memoria extra que crea el código.

De mejor a peor: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

Próximo módulo: el Big O de las herramientas que usas todos los días, los **arrays y los objetos**. Antes de seguir, haz el **cuestionario de Big O** en la página del módulo.

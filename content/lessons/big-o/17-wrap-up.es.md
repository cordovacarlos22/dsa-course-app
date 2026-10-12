---
title: 'Repaso: comparando todo'
order: 17
minutes: 8
---

> **Meta:** poner todos los Big O lado a lado, conocer las palabras que se usan para cada uno y repasar las reglas.

## Los números lado a lado

```viz
big-o-growth-chart
```

¿Qué tan lejos están de verdad estas formas? Ejecuta esto para contar los pasos con n = 100 y con n = 1,000:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

Con n = 100: O(1) es 1, O(log n) es más o menos 7, O(n) es 100 y O(n²) es 10,000. Con n = 1,000: 1, unos 10 (2¹⁰ = 1,024, cerca de mil), 1,000 y **1,000,000**. La diferencia entre O(n) y O(n²) ya es enorme con mil elementos, y las apps reales manejan millones. Por eso elegir el algoritmo correcto importa más que comprar una computadora más rápida.

## Las palabras, y una hoja de referencia

```viz
search-cases
```

| Big O      | Nombre                  | Vas a escuchar…                 | Ejemplo                                 |
| ---------- | ----------------------- | ------------------------------- | --------------------------------------- |
| O(1)       | constante               | "tiempo constante"              | leer un elemento de un array por índice |
| O(log n)   | logarítmico             | "dividir y conquistar"          | búsqueda binaria                        |
| O(n)       | lineal                  | "proporcional"                  | recorrer un array                       |
| O(n log n) | linearítmico            | "el mejor ordenamiento general" | merge sort, quick sort                  |
| O(n²)      | cuadrático (polinomial) | "un bucle dentro de otro bucle" | cada invitado saluda a cada invitado    |

Una gran referencia gratuita es el **Big O Cheat Sheet** en bigocheatsheet.com. Su gráfica califica cada forma de crecimiento en una escala de **Excellent** (excelente) a **Horrible**: O(1) y O(log n) están en el lado excelente, O(n²), O(2ⁿ) y O(n!) en el lado horrible, y O(n) y O(n log n) en medio. O(n!) es algo que básicamente solo vas a ver si escribes código malo a propósito.

Debajo de la gráfica, sus tablas muestran las estructuras de datos más comunes con su tiempo **promedio (Θ)** y en el **peor caso (O)** para cada operación, además de su espacio. La tabla de ordenamientos agrega también el **mejor caso (Ω)**. Vas a notar que algunos ordenamientos tienen una complejidad temporal terrible pero una espacial excelente (selection sort), mientras que otros tienen una complejidad temporal excelente pero necesitan más espacio (merge sort): otra vez el intercambio entre tiempo y espacio. Ten esa página a la mano y vuelve a ella a medida que aprendas cada tema.

## Repaso

```viz
dominant-term
```

Para analizar el rendimiento de un algoritmo usamos la **notación Big O**. Nos da una **idea general** de cómo cambia el tiempo de ejecución (complejidad temporal) o la memoria (complejidad espacial) de un algoritmo cuando crece su entrada. No le importa la precisión, solo las **tendencias generales**. Y depende solo del **algoritmo**, no del hardware: una supercomputadora corre el mismo código más rápido que tu laptop, pero la tendencia es la misma.

Las reglas que aprendiste:

1. **Cuenta operaciones, no segundos.**
2. Big O es el **peor caso** (Ω es el mejor caso, Θ el promedio).
3. **Elimina las constantes:** O(2n) → O(n), O(100n²) → O(n²), O(500) → O(1).
4. **Elimina los términos no dominantes:** O(n² + n) → O(n²).
5. **Entradas distintas, términos distintos:** O(a + b) y O(a · b).
6. Un **bucle dentro de otro bucle** es O(n²); **dividir y conquistar** es O(log n); **O(1)** es el más eficiente de todos.
7. Mide también el **espacio**: la memoria extra que crea el algoritmo.

De mejor a peor: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

Big O está en todo este curso, y lo vas a practicar mucho. Antes de seguir, haz el **cuestionario de Big O** en la página del módulo.

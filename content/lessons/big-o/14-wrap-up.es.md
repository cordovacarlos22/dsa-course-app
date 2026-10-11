---
title: 'Repaso: todas las formas'
order: 14
minutes: 4
---

> **Meta:** poner todos los Big O lado a lado y conocer las palabras que se usan para cada uno.

## Las formas

```viz
big-o-growth-chart
```

| Big O      | Nombre      | Vas a escuchar…                 | Ejemplo con la lista de invitados      |
| ---------- | ----------- | ------------------------------- | -------------------------------------- |
| O(1)       | constante   | "tiempo constante"              | `guests[3]`, `guests.length`           |
| O(log n)   | logarítmico | "dividir y conquistar"          | búsqueda binaria en una lista ordenada |
| O(n)       | lineal      | "proporcional"                  | dar la bienvenida a cada invitado      |
| O(n log n) | n log n     | "el mejor ordenamiento general" | ordenar (más adelante en el curso)     |
| O(n²)      | cuadrático  | "un bucle dentro de otro bucle" | cada invitado saluda a cada invitado   |

De mejor a peor: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

## Las reglas que aprendiste

```viz
search-cases
```

1. **Cuenta pasos, no segundos.**
2. Big O es el **peor caso** (Ω mejor, Θ promedio).
3. **Elimina las constantes:** O(2n) → O(n).
4. **Elimina los términos no dominantes:** O(n² + n) → O(n²).
5. **Entradas distintas, letras distintas:** O(a + b), O(a · b).
6. Mide también el **espacio**.

Próximo módulo: el Big O de las herramientas que usas todos los días, los **arrays y los objetos**. Antes de seguir, haz el **cuestionario de Big O** en la página del módulo.

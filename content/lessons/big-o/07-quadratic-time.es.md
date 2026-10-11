---
title: 'O(n²): un bucle dentro de otro'
order: 7
minutes: 5
---

> **Meta:** reconocer código O(n²) y ver por qué se vuelve lento tan rápido.

## Cada invitado saluda a cada invitado

```viz
nested-grid
```

Cada fila es un invitado. Por cada fila, el bucle de adentro recorre a todos los invitados otra vez. **n filas × n columnas = n²** pasos.

## Observa los dos bucles

```viz
trace-greet-everyone
```

Sigue a **i** (el bucle de afuera) y a **j** (el bucle de adentro). Por cada `i`, `j` va desde 0 hasta el final. Elige **4 invitados**: 16 pasos internos en lugar de 9.

Duplica los invitados y el trabajo es **4 veces** más grande. Eso es **O(n²)**, tiempo cuadrático. Tres bucles uno dentro de otro serían O(n³).

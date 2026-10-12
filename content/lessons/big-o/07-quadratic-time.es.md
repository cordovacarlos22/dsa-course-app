---
title: 'O(n²): un bucle dentro de otro'
order: 7
minutes: 6
---

> **Meta:** reconocer código O(n²) y ver por qué se vuelve lento tan rápido.

## Cada invitado saluda a cada invitado

En la fiesta, cada invitado quiere saludar a todos los demás. Cada fila de esta cuadrícula es un invitado, y cada columna es un invitado al que saluda:

```viz
nested-grid
```

Por cada invitado (una fila), recorremos a todos los invitados otra vez (las columnas). Con n invitados son **n filas × n columnas = n²** celdas. Cuéntalas en fiestas pequeñas:

| Invitados | Celdas |
| --------- | ------ |
| 2         | 4      |
| 3         | 9      |
| 4         | 16     |

## Observa los dos bucles

En código, una cuadrícula así es un **bucle dentro de otro bucle**:

```viz
trace-greet-everyone
```

Sigue a **i** (el bucle de afuera) y a **j** (el bucle de adentro). Por cada valor de `i`, `j` va desde 0 hasta el final de la lista. Por eso el paso de adentro corre n × n veces. (El código se salta que un invitado se salude a sí mismo, pero el bucle de adentro igual da ese paso.)

Elige **4 invitados**: 16 pasos internos en lugar de 9. Duplica los invitados y el trabajo crece **4 veces**. Eso es **O(n²)**, que se lee "O de n al cuadrado", también llamado **tiempo cuadrático**. Un tercer bucle dentro del segundo lo haría n × n × n = **O(n³)**, que crece todavía más rápido.

## Una señal de alerta

```viz
big-o-growth-chart
```

En la gráfica, O(n²) es la curva que se dispara. Los números explican por qué: 10 invitados necesitan 100 pasos, 1,000 invitados necesitan **1,000,000** de pasos, y 100,000 usuarios necesitarían 10 mil millones. Un código así se siente bien cuando lo pruebas con pocos elementos, y luego se arrastra con datos reales.

Los bucles anidados no siempre se pueden evitar, pero muchas veces son una pista de que hay una mejor forma. En las entrevistas, la primera idea para un problema muchas veces es O(n²), y la siguiente pregunta es: "¿Puedes hacerlo en O(n)?" Más adelante en el curso, los patrones para resolver problemas te van a enseñar cómo.

---
title: Contando operaciones
order: 3
minutes: 5
---

> **Meta:** contar las operaciones de una función y ver cómo crece el total con n.

## Cada línea es una operación

```viz
trace-count-short-names
```

Cada línea resaltada suma 1 al contador: darle un valor a una variable, comparar, sumar. Reprodúcelo con **4 invitados**, luego elige **8** y **16** y compara los totales.

## No necesitamos el conteo exacto

```viz
linear-boxes
```

Contar cada operación te da algo como "3 o 4 por invitado". Ese número exacto no importa. Lo que importa es la **forma**: duplica los invitados y el trabajo se duplica. Eso es lo que describe Big O.

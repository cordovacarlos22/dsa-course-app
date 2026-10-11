---
title: 'Logaritmos y O(log n)'
order: 13
minutes: 5
---

> **Meta:** entender qué es un logaritmo (sin matemáticas que asusten) y por qué O(log n) es tan rápido.

## Un logaritmo cuenta mitades

```viz
halving-count
```

**log₂(n)** responde una sola pregunta: _¿cuántas veces puedes partir n a la mitad hasta que quede 1?_ 16 → 8 → 4 → 2 → 1 son 4 mitades, así que log₂(16) = 4. En Big O solo escribimos **log n**.

## Busca un nombre en una lista ordenada

```viz
binary-search-halving
```

Cuando la lista de invitados está **ordenada de la A a la Z**, no tienes que leerla nombre por nombre. Mira el nombre del medio y descarta la mitad que no puede tener el nombre que buscas. Repite.

Eso es la **búsqueda binaria**, un algoritmo de "dividir y conquistar": **O(log n)**. Un millón de nombres ordenados necesita solo unas 20 revisiones. Solo funciona con datos **ordenados**.

---
title: Elimina las constantes
order: 6
minutes: 4
---

> **Meta:** simplificar O(2n) a O(n) con la primera regla.

## Dos bucles seguidos

```viz
trace-welcome-and-goodbye
```

Primero una bienvenida para cada invitado y después una despedida para cada invitado: **n + n = 2n** mensajes. Es tentador escribir O(2n).

## La misma forma, así que quita el número

```viz
same-shape
```

n, 2n y 3n son todas líneas rectas. Duplica los invitados y el trabajo se duplica, sin importar el número de adelante. Big O se queda con la **forma**, así que **eliminamos la constante**:

| Contaste    | Escríbelo así |
| ----------- | ------------- |
| 2n          | O(n)          |
| 100n        | O(n)          |
| n / 2       | O(n)          |
| 5 (siempre) | O(1)          |

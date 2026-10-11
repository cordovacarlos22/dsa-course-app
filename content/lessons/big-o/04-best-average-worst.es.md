---
title: Mejor caso, caso promedio y peor caso
order: 4
minutes: 4
---

> **Meta:** saber qué describen Ω, Θ y O, y por qué Big O significa el peor caso.

## ¿Dónde está el nombre?

```viz
search-cases
```

La misma búsqueda puede tardar 1 revisión o revisar a todos los invitados. Depende de **dónde** está el nombre:

| Caso     | Letra     | Nuestra lista de invitados             |
| -------- | --------- | -------------------------------------- |
| Mejor    | Ω (omega) | el nombre es el primero                |
| Promedio | Θ (theta) | el nombre está más o menos en el medio |
| Peor     | O (big O) | el nombre no está en la lista          |

## Big O es el peor caso

```viz
trace-is-invited
```

Elige **buscar a 'Zoe'**: se revisa a todos los invitados. Cuando te preguntan por "el Big O" de tu código, se refieren a este **peor caso**: el código nunca será más lento que esto.

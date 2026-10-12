---
title: Mejor caso, caso promedio y peor caso
order: 4
minutes: 5
---

> **Meta:** saber qué describen Ω, Θ y O, y por qué Big O significa el peor caso.

## ¿Dónde está el nombre?

`isInvited` no siempre hace la misma cantidad de trabajo. Depende de **dónde** está el nombre:

```viz
search-cases
```

En ciencias de la computación se usan tres letras griegas para estas situaciones:

| Caso     | Letra     | Significado                                   | Nuestra lista de invitados          |
| -------- | --------- | --------------------------------------------- | ----------------------------------- |
| Mejor    | Ω (omega) | lo mínimo que el código puede trabajar        | el nombre es el primero: 1 revisión |
| Promedio | Θ (theta) | lo que puedes esperar la mayoría de las veces | más o menos en el medio: unas n / 2 |
| Peor     | O (big O) | lo máximo que el código puede trabajar        | no está en la lista: n revisiones   |

Algunos libros le dicen "ómicron" a la O, otra letra griega, pero todo el mundo dice simplemente "big O".

## Big O es el peor caso

```viz
trace-is-invited
```

Elige **buscar a 'Zoe'** y mira cómo se revisa a cada invitado. Ese es el peor caso, y es a lo que se refieren cuando dicen "el Big O de este código". Big O es un **límite superior**: una promesa de que, sin importar la entrada, el código **nunca será más lento** que esto.

A veces vas a escuchar "el Big O del mejor caso" o "el Big O del caso promedio". Técnicamente eso no existe: el mejor caso es Ω y el caso promedio es Θ. Big O siempre describe el peor caso.

¿Por qué enfocarse en el peor caso? Porque es el que duele. Una búsqueda que casi siempre es rápida pero a veces lee un millón de nombres **va a** leer un millón de nombres algún día, para un usuario real. Planear para el peor caso significa no tener sorpresas. Para `isInvited`, el peor caso son n revisiones, así que es **O(n)**. La siguiente lección muestra cómo se ve eso.

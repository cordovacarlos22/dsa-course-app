---
title: ¿Por qué Big O?
order: 1
minutes: 5
---

> **Meta:** ver por qué "funciona" no es suficiente y qué mide Big O.

## Dos versiones que funcionan

```viz
trace-is-invited
```

Estás en la puerta de una fiesta con la lista de invitados. `isInvited` revisa los nombres uno por uno y **se detiene en cuanto encuentra el nombre**. Presiona **Reproducir** y luego prueba los otros nombres de arriba.

## Una versión que nunca se detiene antes

```viz
trace-is-invited-all
```

`isInvitedAll` da las mismas respuestas, pero **siempre lee toda la lista**. Elige **buscar a 'Ana'**: Ana es la primera, y aun así revisa a los 6 invitados.

Las dos versiones funcionan. Una hace menos trabajo. ¿Cómo decimos cuál es mejor?

## La etiqueta para "cuánto trabajo"

```viz
big-o-growth-chart
```

Con 6 invitados nadie nota la diferencia. Con un millón de invitados, todos la notan.

**Big O** es la etiqueta que le ponemos al código para describir **cómo crece el trabajo cuando crece la entrada**. Te deja comparar dos soluciones, y en todas las entrevistas técnicas te lo preguntan.

---
title: ¿Por qué Big O?
order: 1
minutes: 7
---

> **Meta:** entender por qué "funciona" no es toda la historia, y qué mide Big O.

## Dos versiones que funcionan

Estás en la puerta de una fiesta con la lista de invitados. Alguien llega y te dice su nombre. ¿Está en la lista? Esta es una forma de escribir esa revisión. Presiona **Reproducir** para verla correr:

```viz
trace-is-invited
```

`isInvited` empieza arriba de la lista (`i = 0`) y compara cada nombre con el que está buscando. En cuanto encuentra una coincidencia, **se detiene** y devuelve `true`. Si llega al final sin encontrarlo, el nombre no está, así que devuelve `false`.

Usa los botones de arriba del código para probar tres nombres. Encontrar a 'Ana' toma 1 revisión, a 'Dev' toma 4, y 'Zoe', que no está invitada, toma las 6. Fíjate en el contador: muestra cuántos nombres tuvo que mirar el código. Ese número va a ser muy importante.

## Una versión que nunca se detiene antes

Esta es una segunda versión. Da exactamente las mismas respuestas:

```viz
trace-is-invited-all
```

`isInvitedAll` usa una variable, `found`, que empieza en `false`. Cuando ve el nombre, pone `found = true`… y aun así sigue adelante. Siempre lee **toda** la lista antes de responder. Elige **buscar a 'Ana'**: Ana es la primera invitada, y el código igual revisa los 6 nombres.

Las dos funciones son correctas. Si solo las probaras con unos pocos nombres, no podrías distinguirlas. Pero una de ellas hace menos trabajo. Entonces, ¿cuál es **mejor**? ¿Y cómo le explicarías por qué a otra persona, sin decir "es que se siente más rápida"?

## ¿Qué significa "mejor"?

```viz
big-o-growth-chart
```

"Mejor" puede significar cosas distintas:

- **Más rápido:** termina en menos tiempo.
- **Más ligero:** usa menos memoria.
- **Más claro:** es más fácil de leer y de cambiar.

A veces estas cosas tiran en direcciones opuestas. La solución más rápida a veces usa más memoria, y el código muy corto e ingenioso suele ser más difícil de leer. Un buen desarrollador sabe hablar de estos intercambios.

**Big O** nos da una forma común de hablar de los dos primeros. No dice "esto tarda 3 segundos". Describe **cómo crece el trabajo cuando crece la entrada**. Piensa en la etiqueta de consumo de gasolina de un carro: no te dice cuánto va a durar tu viaje, pero sí cómo crece la gasolina que necesitas con la distancia que manejas. La gráfica de arriba muestra las formas de crecimiento más comunes. En este módulo vas a aprender a mirar un código y decir qué forma tiene.

## Por qué importa

```viz
memory-boxes
```

¿Por qué aprender esto antes que todo lo demás?

- **En las entrevistas te lo preguntan.** Después de resolver un problema de código, la siguiente pregunta casi siempre es: "¿Cuál es el Big O de tu solución?"
- **Los datos reales son grandes.** Con 6 invitados, cualquier código es instantáneo. Con 10 millones de usuarios, una versión puede tardar segundos y la otra, horas.
- **Te ayuda a encontrar código lento.** Cuando una app se vuelve lenta, Big O te dice dónde buscar.
- **Te ayuda a elegir.** Todas las estructuras de datos de este curso se comparan con Big O.

Big O mide dos cosas. La **complejidad temporal** es cómo crece el número de pasos con la entrada. La **complejidad espacial** es cómo crece la memoria extra. La animación de arriba es un adelanto: contar invitados necesita una caja de memoria, pero hacer un gafete para cada invitado necesita una caja nueva por invitado. En una entrevista te pueden decir: _"Muy bien, es rápido. ¿Puedes hacer que use menos memoria?"_ Nos vamos a enfocar sobre todo en el tiempo, y el espacio tiene su propia lección.

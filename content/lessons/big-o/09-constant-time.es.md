---
title: 'O(1): tiempo constante'
order: 9
minutes: 4
---

> **Meta:** reconocer código O(1), el mejor Big O que existe.

## Salta directo a la caja

```viz
constant-jump
```

`guests[3]` no mira las cajas 0, 1 y 2. **Salta directo** a la caja 3. Un paso con 6 invitados, un paso con un millón.

## Una línea plana

```viz
big-o-growth-chart
```

El trabajo que no crece con la entrada es **O(1)**, también llamado **tiempo constante**. En la gráfica es la línea plana de abajo: no hay nada mejor.

Unos pocos pasos siguen siendo O(1): 5 pasos siempre es O(5), y eliminamos la constante.

```js-run
const guests = ['Ana', 'Ben', 'Cleo', 'Dev', 'Eli']

const first = guests[0]
const last = guests[guests.length - 1]
console.log('First:', first, '- Last:', last)
```

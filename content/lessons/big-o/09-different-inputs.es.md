---
title: Entradas distintas, variables distintas
order: 9
minutes: 5
---

> **Meta:** escribir el Big O de código que recibe dos entradas independientes, como O(a + b) y O(a · b). Es una trampa clásica de entrevista.

## Dos listas, dos tamaños

Una escuela envía un mensaje a cada estudiante y luego a cada mentor:

```js-run
function sendMessages(students, mentors) {
  let messages = 0
  for (const student of students) messages++
  for (const mentor of mentors) messages++
  return messages
}

console.log(sendMessages(['Ana', 'Bo', 'Cai'], ['Dr. Lee']))
```

Dos bucles, uno después del otro. La respuesta tentadora: "cada bucle es O(n), entonces O(2n), que es O(n)". **Eso está mal.**

## Por qué está mal

`n` significa "el tamaño de la entrada", pero aquí hay **dos** entradas y pueden tener tamaños completamente distintos. ¿Y si hay 3 estudiantes y 1 millón de mentores? Llamar `n` a los dos tamaños esconde eso.

Usa **una variable por entrada**: `a` estudiantes y `b` mentores. Los bucles uno después del otro se **suman**:

**O(a + b)**

No se puede simplificar más: ninguno de los dos términos es una constante y no sabes cuál es más grande.

## Los bucles anidados multiplican

Ahora la escuela junta a cada estudiante con cada mentor para una reunión corta:

```js-run
function scheduleMeetings(students, mentors) {
  let meetings = 0
  for (const student of students) {
    for (const mentor of mentors) {
      meetings++
    }
  }
  return meetings
}

console.log(scheduleMeetings(['Ana', 'Bo', 'Cai'], ['Dr. Lee', 'Ms. Ruiz']))
```

3 estudiantes × 2 mentores = 6 reuniones. Los bucles anidados sobre dos entradas distintas se **multiplican**:

**O(a · b)**

Solo es O(n²) si los dos bucles recorren la **misma** entrada.

## Resumen

| Forma del código                             | Big O    |
| -------------------------------------------- | -------- |
| Bucle sobre `a`, luego bucle sobre `b`       | O(a + b) |
| Bucle sobre `b` dentro de un bucle sobre `a` | O(a · b) |
| Bucles anidados sobre el mismo array         | O(n²)    |

## Compruébalo tú mismo

1. Una función recorre `orders` y luego `customers`. ¿Cuál es su Big O?
2. ¿Por qué no puedes simplificar O(a + b) a O(n)?
3. ¿Cuándo O(a · b) se convierte en O(n²)?

---
title: ¿Qué es una lista enlazada?
order: 1
minutes: 10
---

> **Meta:** saber qué es una lista enlazada, en qué se diferencia de un array, y nombrar sus partes: nodos, `next`, `head`, `tail` y `null`.

## Sin índices, y no uno junto al otro

Hasta ahora has usado las estructuras de datos que JavaScript te da gratis: arrays y objetos. A partir de este módulo, **construyes las tuyas**. La primera es la **lista enlazada**, y la mejor forma de entenderla es ponerla junto a la estructura con la que siempre la comparan: el array.

Un array tiene dos características en las que te has apoyado, quizás sin darte cuenta. Primero, cada elemento tiene un **índice**: `guests[0]`, `guests[1]`, `guests[2]`. Segundo, los elementos se guardan **uno junto al otro en memoria**, en un solo bloque sin huecos (la palabra técnica es **contiguo**). Esas dos cosas van de la mano. Como el bloque no tiene huecos y cada espacio mide lo mismo, la computadora encuentra `guests[2]` con una simple cuenta: el inicio del bloque, más 2 espacios. Por eso leer un array por índice es O(1).

Una lista enlazada renuncia a las dos. Sus elementos **no tienen índices**, y **no se guardan uno junto al otro**: cada uno puede estar en cualquier parte de la memoria, donde hubiera espacio libre cuando se creó. Entonces, ¿cómo pasas de un elemento al siguiente? Cada elemento guarda un **puntero** al elemento que va después. Conociste los punteros en el módulo de Clases y punteros, y una lista enlazada en realidad es solo una cadena de ellos.

```viz
array-vs-linked-list
```

**Qué acaba de pasar:** el array guardó a sus cuatro invitados en un solo bloque, los espacios 4 a 7, y pudo encontrar `guests[2]` contando desde el inicio de ese bloque. La lista enlazada puso a los mismos cuatro invitados en los espacios 2, 9, 5 y 11, sin ningún orden. Lo que los mantiene unidos es que cada uno recuerda el espacio del siguiente. Cuando dibujamos la lista como una cadena, esos recuerdos se vuelven las flechas.

Aquí tienes una lista enlazada pequeñita, armada a mano con objetos normales, para que veas las dos ideas en código. (La lección 3 la desarma pieza por pieza.)

```js-run
const line = {
  value: 'Ana',
  next: { value: 'Ben', next: { value: 'Cleo', next: null } },
}

console.log(line[2]) // undefined: no hay índices
console.log(line.next.next.value) // 'Cleo': mejor sigue los enlaces
```

**Error común:** escribir `list[2]` por costumbre. Una lista enlazada no tiene ningún índice al cual saltar. Para llegar al tercer invitado, empiezas en el primero y sigues dos enlaces.

## Head, tail y null

Cada elemento de una lista enlazada se llama **nodo**. Un nodo guarda dos cosas: un **valor** (para nosotros, el nombre de un invitado) y un puntero llamado **`next`**, que apunta al nodo que va después. La historia de este módulo es una **fila de conga**: cada invitado se agarra del siguiente invitado de la fila, y nadie necesita un número para saber dónde está.

La lista además guarda dos punteros más. **`head`** apunta al primer nodo, el inicio de la fila. **`tail`** apunta al último nodo, el final de la fila. Solo con `head` puedes llegar a cualquier nodo, siguiendo `next` una y otra vez. `tail` es un atajo: te lleva al final de la fila sin recorrerla completa.

¿Y el último nodo? Su `next` no tiene a nadie a quien apuntar, así que guarda **`null`**. Ese `null` es como sabes que llegaste al final. A una lista armada así se le llama **terminada en null** (en inglés, _null-terminated_), porque termina en `null`.

```viz
linked-list-anatomy
```

**Qué acaba de pasar:** le pusimos nombre a cada parte de la lista. Cada caja es un nodo, con un valor y un puntero `next`. `head` está en Ana, el primer nodo, y `tail` está en Dev, el último. El `next` de Dev es `null`, y eso marca el final de la fila.

```js-run
const dev = { value: 'Dev', next: null }
const cleo = { value: 'Cleo', next: dev }
const ben = { value: 'Ben', next: cleo }
const ana = { value: 'Ana', next: ben }

const head = ana
const tail = dev

console.log(head.value) // 'Ana': el inicio de la fila
console.log(tail.value) // 'Dev': el final de la fila
console.log(tail.next) // null: no hay nada después del tail
console.log(head.next.value) // 'Ben': a un enlace del inicio
console.log(head === ana) // true: head es un puntero al nodo de Ana
```

Fíjate en que `head` y `tail` no son nodos. Son **punteros a nodos**, igual que las variables de la lección de punteros: `head` y `ana` son dos nombres para el mismo objeto.

**Error común:** pensar que el `next` del tail regresa al primer nodo. En todas las listas de este módulo, el `next` del último nodo es `null`. (Sí existen listas donde el último nodo apunta de vuelta al primero: se llaman listas circulares, y son otra estructura.)

## Lo que vas a construir en este módulo

¿Por qué tomarse tanto trabajo si ya existen los arrays? Porque las listas enlazadas brillan justo donde los arrays batallan: al agregar y quitar al **inicio**. Para poner a un invitado en el índice 0, un array tiene que recorrer a todos los demás un lugar (viste ese reindexado en el módulo de Big O). Una lista enlazada solo crea un nodo nuevo y lo apunta al que antes era el primero, y nadie más se mueve. Además, una lista enlazada crece un nodo a la vez, así que nunca necesita un bloque grande de memoria sin huecos.

Vas a encontrar listas enlazadas en programas reales, casi siempre metidas dentro de otra cosa: una cola de canciones por reproducir, una fila de documentos esperando a la impresora, el historial detrás del botón de deshacer. Las pilas y las colas, más adelante en esta sección, muchas veces se construyen como listas enlazadas, y los árboles y los grafos usan la misma idea de nodos y punteros. Si te sientes cómodo con las listas enlazadas ahora, el resto de la sección de Estructuras de datos se vuelve mucho más fácil.

En este módulo vas a construir una clase `LinkedList` desde cero, un método por lección: la misma clase que viste de adelanto en el módulo de Clases y punteros. Cada lección de un método sigue los **5 pasos** de Un método para resolver problemas: entender qué hace el método, probar ejemplos (una lista vacía, un nodo, muchos nodos), dividirlo en pasos, escribir el código y revisar su Big O.

```viz
list-class-preview
```

**Qué acaba de pasar:** el adelanto corrió los métodos que estás por escribir. El constructor empieza la fila, `push` y `unshift` agregan un invitado al final y al inicio, `insert` y `remove` trabajan en un índice, y `pop` y `shift` sacan a un invitado de cualquiera de los extremos. En la próxima lección, antes de escribir cualquiera de ellos, vas a calcular cuánto cuesta cada uno.

**En resumen:** una lista enlazada es una cadena de nodos. Cada nodo tiene un valor y un puntero `next`, `head` y `tail` apuntan a los dos extremos, y el último nodo apunta a `null`. No hay índices, así que llegar a un nodo significa seguir enlaces desde `head`.

**Error común:** decidir que las listas enlazadas simplemente son "mejores" que los arrays. Son más rápidas en algunos trabajos y más lentas en otros, y la próxima lección les pone números a los dos.

---
title: Cómo sacarle el máximo provecho a este curso
order: 2
minutes: 12
---

> **Meta:** entender por qué el curso empieza con Big O, por qué las clases y los punteros van antes de las estructuras de datos, y armar una rutina de estudio que funcione.

## "¿Puedo saltar directo al código?"

Hay quien solo quiere escribir código y saltarse todo lo que suene a teoría. Se puede: la sección de Estructuras de datos está ahí mismo en el mapa del curso. Pero dos temas cortos hacen que todo lo que hay ahí sea más fácil: **Big O**, que viene ahora, y las **clases y los punteros**, que abren esa sección. Este paso trata del primero.

**Big O** es como se describe la **eficiencia** del código. No en segundos, que cambian de computadora a computadora, sino en cómo crece la cantidad de trabajo cuando crece la entrada. Aquí tienes una situación donde eso importa. Estás construyendo una app, y lo más importante que hace es **quitar el último elemento** de una lista, miles de veces por segundo. Podrías guardar la lista como una **lista enlazada simple**, donde cada elemento solo conoce al que va después, o como una **lista doblemente enlazada**, donde cada elemento también conoce al de antes. ¿Cuál eliges?

La lista doblemente enlazada es _mucho_ más rápida en esa tarea. La animación de abajo muestra por qué a la lista enlazada simple le cuesta. No necesitas entender cada línea todavía; la vas a construir en el módulo de Listas enlazadas.

```viz
linked-list-cost-end
```

**Qué acaba de pasar:** agregar a Eve al final tomó dos movimientos, porque `tail` ya apuntaba al final de la fila. Pero quitar a Eve significó regresar `tail` a Dev, y en una lista enlazada simple nada apunta hacia atrás desde Eve. Así que el código recorrió toda la fila desde el inicio para encontrar a quien va antes del tail. Con 4 invitados es una caminata corta; con 4,000 es larga. Una lista doblemente enlazada daría un paso atrás desde el tail en un solo movimiento. Big O es el lenguaje para justo esta diferencia: una versión hace siempre la misma pequeña cantidad de trabajo, y la otra hace más trabajo entre más larga es la lista.

Antes de ejecutar la siguiente caja, haz una predicción: si una fila de 400 invitados toma 398 pasos, ¿cuántos pasos toma una fila de 4,000? Luego ejecútala para ver cómo crece la caminata con el tamaño de la lista:

```js-run
// Una lista enlazada simple solo se puede recorrer hacia adelante, desde el inicio.
// Para quitar a quien va al final, primero tienes que llegar a quien va justo antes.
const sizes = [4, 400, 4000]
for (let k = 0; k < sizes.length; k++) {
  let steps = 0
  for (let i = 0; i < sizes[k] - 2; i++) {
    steps++
  }
  console.log(sizes[k] + ' invitados: ' + steps + ' pasos para llegar al penúltimo lugar de la fila')
}
```

La caminata siempre tiene 2 pasos menos que la fila, así que cada persona más en la fila suma un paso más: el trabajo crece **al mismo ritmo** que la fila. En una fila larga, esos 2 pasos dejan de importar: con 10 veces más invitados, unas 10 veces más pasos (398 → 3,998). La lista doblemente enlazada hace el mismo movimiento con 4 invitados o con 4 millones. Decir con precisión "esta crece con la lista y esa no", y notarlo con solo leer el código, es lo que enseña el módulo de Big O.

Hay tres razones para aprender Big O primero:

1. **Todos los temas lo usan.** Para cada estructura de datos y algoritmo del curso nos vamos a preguntar: "¿Cuál es su Big O?", y los cuestionarios también lo preguntan.
2. **Te ayuda a elegir.** Escoger la estructura de datos correcta para un trabajo, como la lista enlazada de arriba, significa comparar su Big O.
3. **En las entrevistas siempre lo preguntan.** En una entrevista técnica, casi seguro te van a pedir el Big O de tu solución.

Big O describe dos tipos de costo. La **complejidad temporal** es cómo crece el número de **operaciones** cuando crece la entrada. Contamos operaciones en vez de segundos porque el mismo código termina antes en una computadora más rápida, pero sigue haciendo exactamente las mismas operaciones. La **complejidad espacial** es cómo crece la **memoria** que necesita el código. A veces cambias una por la otra: una versión más rápida puede necesitar más memoria. Este curso se enfoca sobre todo en el tiempo, pero en las entrevistas preguntan por los dos, así que el módulo de Big O enseña los dos.

**Error común:** saltarse Big O porque tiene un poco de matemáticas. Cada módulo después de este usa Big O para explicar _por qué_ un método es rápido y otro es lento. Sin él, tendrías que memorizar esas respuestas en vez de deducirlas.

## Por qué importan las clases

Cada estructura de datos de este curso se construye como una **clase**. Una clase es un plano: describe los datos que guarda cada objeto y los **métodos** (funciones) que trabajan con esos datos. Una lista enlazada, por ejemplo, es una clase `LinkedList` con métodos como `push` y `pop`, y cada lista que creas con ella recibe esos métodos. Por eso necesitas lo básico de las clases antes de construir una, y por eso la sección de Estructuras de datos empieza con un módulo corto de Clases y punteros, de solo dos lecciones.

Aquí tienes un adelanto, para que la palabra no asuste cuando la veas. No te preocupes por cada detalle; el módulo de Clases y punteros explica cada línea. Esta clase es el plano de los gafetes de la fiesta. Cada gafete hecho con ella guarda un nombre de la lista y tiene un método `read`:

```js-run
class NameTag {
  constructor(guest) {
    this.guest = guest
  }

  read() {
    return 'Hola, me llamo ' + this.guest
  }
}

const tagForAna = new NameTag('Ana')
const tagForBen = new NameTag('Ben')
console.log(tagForAna.read())
console.log(tagForBen.read())
```

Un plano, dos gafetes. `new NameTag('Ana')` creó un objeto con el plano, y `new NameTag('Ben')` creó otro. Cada gafete guarda su propio nombre, y los dos recibieron el mismo método `read` sin escribirlo dos veces. Una lista enlazada funciona igual: una clase `LinkedList`, y cada lista que creas con `new LinkedList(...)` recibe `push`, `pop` y los demás.

**Error común:** pensar que la clase _es_ el objeto. La clase es solo el plano: no existe nada hasta que `new` crea un objeto con ella. `NameTag` no tiene un nombre guardado; `tagForAna` sí.

## Punteros, por dentro

Los **punteros** son la otra idea clave, y confunden a mucha gente. Cuando una variable guarda un objeto, no guarda una copia del objeto: guarda una **referencia**, una flecha hacia donde vive el objeto. En este curso a una variable así le decimos **puntero**. Los punteros se pueden mover para que apunten a otro objeto, y dos punteros pueden apuntar al mismo objeto.

Por eso una variable que guarda un objeto se comporta distinto de una que guarda un número. Si copias un número en otra variable, obtienes otro número, separado. Si copias una variable de objeto, obtienes otra flecha al **mismo** objeto, así que un cambio hecho por una flecha se ve por la otra. Mira los dos casos:

```viz
value-copy
```

**Qué acaba de pasar:** `let seats = guestCount` copió el 5 en `seats` en ese momento, y después nada unió a las dos variables. Cuando `guestCount` cambió a 8, `seats` se quedó con su propio 5.

```viz
reference-copy
```

**Qué acaba de pasar:** `let sameCard = card` copió la flecha, no el objeto, así que las dos variables apuntaron al mismo objeto A. Cambiar `card.value` cambió el objeto A, y leer `sameCard.value` mostró el cambio también: siempre hubo un solo objeto.

Ahora pruébalo con otros valores. Predice qué imprime esto y luego ejecútalo:

```js-run
// Un número: la variable guarda el valor mismo.
let plates = 10
let platesLeft = plates // copia el número
platesLeft = platesLeft - 1
console.log('plates:', plates, '| platesLeft:', platesLeft)

// Un objeto: la variable guarda una flecha hacia el objeto.
const ana = { name: 'Ana', table: 1 }
const sameGuest = ana // copia la flecha, no el objeto
sameGuest.table = 4
console.log('Ana se sienta en la mesa', ana.table)
```

`plates` siguió en 10, porque `platesLeft` recibió su propia copia del número. Pero `ana.table` cambió a 4, aunque el código solo cambió `sameGuest`. Siempre hubo **un solo** objeto, con dos flechas apuntándole. Las listas enlazadas se construyen justo sobre esto: el `next` de un nodo es una flecha a otro nodo, y mover una flecha cambia cómo se ve la lista sin copiar nada.

**Error común:** esperar que `const` congele un objeto. `const sameGuest = ana` significa que esa flecha no se puede mover a otro objeto, pero el objeto al que apunta sí puede cambiar. Por eso funcionó `sameGuest.table = 4`.

## `head` y `tail` son punteros

Una **lista enlazada** es una cadena de **nodos**. Cada nodo es un objeto pequeño que guarda un `value` y un puntero `next` al nodo que sigue, y el `next` del último nodo es `null`, que significa "después de mí no hay nada". La lista guarda dos punteros más: `head`, que apunta al primer nodo, y `tail`, que apunta al último.

Aquí es donde eso importa. Mira las etiquetas en esta lista enlazada:

```viz
linked-list-anatomy
```

**Qué acaba de pasar:** cada caja es un **nodo**, que guarda un valor y un puntero `next` al nodo que sigue. `head` y `tail` estaban **arriba** de las cajas, apuntando hacia el primer y el último nodo. No son nodos. Son variables que apuntan a nodos.

Ejecuta este pequeño ejemplo. Creamos un nodo, hacemos que `head` y `tail` apunten a él y luego agregamos un segundo nodo al final:

```js-run
const firstNode = { value: 4, next: null }
let head = firstNode
let tail = firstNode
console.log('¿head y tail apuntan al mismo nodo?', head === tail)

// Agregamos un nodo nuevo al final de la cadena:
const nodeToAdd = { value: 7, next: null }
tail.next = nodeToAdd // 1. el último nodo actual apunta al nuevo
tail = nodeToAdd // 2. tail se mueve al nodo nuevo

console.log('head apunta al nodo con', head.value)
console.log('tail apunta al nodo con', tail.value)
console.log('el nodo después de head tiene', head.next.value)
```

Fíjate que `head` nunca se movió: sigue apuntando al primer nodo. Solo se movió `tail`, porque `tail` es un puntero, y los punteros se pueden mover a otro nodo. Vas a aprender exactamente cómo funciona esto en el módulo de Clases y punteros.

**Error común:** mirar el diagrama de una lista enlazada y llamar "head" a la primera caja y "tail" a la última. En realidad, `head` y `tail` **no** son las cajas (los nodos). Son **variables que apuntan a** nodos. Ahorita `head` apunta al primero, pero eso puede cambiar.

## Tu rutina de estudio

La forma más rápida de aprender DSA es **practicar justo después de aprender**. Leer una solución se siente como entenderla, pero la prueba de verdad es escribirla tú mientras la idea sigue fresca. Cada vez que sacas una idea de tu memoria, respondiendo una pregunta o escribiendo código, se vuelve más fácil recordarla la siguiente vez. Por eso cada paso del curso termina con una comprobación, y cada módulo termina con práctica.

Todo pasa aquí mismo en el navegador, así que no hay nada que descargar ni configurar. Esta es la rutina:

1. Lee la lección y juega con cada animación y cada caja de código. Cambia el código y ejecútalo otra vez.
2. Al final del módulo, haz el **cuestionario** en la página del módulo.
3. Luego haz los **ejercicios**. En los de **Constrúyelo** escribes tú el código del módulo, un método o un paso a la vez, y los **Problemas de entrevista** usan el tema en un problema estilo LeetCode. Escribe el código tú, aunque al principio te parezca lento. Cada ejercicio revisa tu código con pruebas, te da una pista después de un intento fallido y te muestra cuánto tardaste.

Cada ejercicio trae código inicial, así que te saltas la preparación y usas tu tiempo en la idea que enseñó el módulo. Hazlos en cuanto termines el módulo, no "después".

**Error común:** dejar toda la práctica para el final del curso. Un poco de práctica después de cada módulo se te queda mucho mejor que mucha práctica meses después. Y cuando te atores, prueba la pista antes de ver la respuesta: el esfuerzo es parte de lo que hace que se quede.

En resumen:

- **Big O** es cómo comparamos código, en tiempo (operaciones) y en espacio (memoria). Todos los temas lo usan, te ayuda a elegir estructuras de datos y en las entrevistas lo preguntan.
- Cada estructura de datos es una **clase**: un plano, y `new` crea objetos con él.
- Una variable que guarda un objeto es un **puntero**: copiarla copia la flecha, no el objeto.
- `head` y `tail` son **punteros** a nodos, no los nodos en sí.
- Practica justo después de cada módulo: el cuestionario, y luego los ejercicios.

Cuando termines este módulo, el **cuestionario del Módulo 1** te espera en la página del módulo.

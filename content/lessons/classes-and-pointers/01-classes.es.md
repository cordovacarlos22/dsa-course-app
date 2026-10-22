---
title: 'Clases: el plano de cada estructura de datos'
order: 1
minutes: 12
---

> **Meta:** escribir una clase con un constructor y métodos, saber qué hacen `new` y `this`, y ver por qué cada estructura de datos de este curso es una clase.

## Una clase es una plantilla de invitación

Hasta ahora has guardado datos en arrays y objetos, y has escrito funciones que trabajan con esos datos. Una **clase** junta las dos cosas en un solo lugar: describe qué datos guarda algo **y** qué puedes hacer con ellos. Piensa en la **plantilla de invitación** de nuestra fiesta. La plantilla no es una invitación. Es un diseño que usas para imprimir todas las invitaciones que quieras, y cada invitación que imprime tiene el mismo diseño, con el nombre de un invitado distinto.

En código, la plantilla es la **clase**, y cada invitación que imprime es una **instancia** de esa clase (también vas a oír "un objeto creado a partir de la clase"). Aquí tienes una clase `Invitation` (invitación). Por convención, los nombres de las clases empiezan con **mayúscula** (`Invitation`, `LinkedList`), y así es fácil distinguirlos de las variables y funciones normales (`invitation`, `push`):

```js
class Invitation {
  constructor(guest) {
    this.guest = guest
  }
}
```

Esa ya es una clase completa. Es chiquita, pero puede hacer invitaciones, y cada invitación que hace recibe su propio `guest` (invitado).

```viz
invitation-template
```

**Qué acaba de pasar:** la clase fue la misma todo el tiempo: es la plantilla. `new Invitation('Ana')` imprimió la primera instancia, y `new Invitation('Ben')` imprimió una segunda. Las dos tienen el mismo diseño (un `guest`), pero cada una guarda su **propio** valor. Imprimir mil invitaciones más no cambiaría la plantilla para nada.

Ejecútalo, y fíjate en la última línea: dos invitaciones hechas con la misma clase siguen siendo dos objetos distintos.

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
  }
}

const forAna = new Invitation('Ana')
const forBen = new Invitation('Ben')

console.log(forAna.guest)
console.log(forBen.guest)
console.log(forAna === forBen) // false: dos invitaciones distintas
```

**Error común:** olvidar `new`. Sin él, `Invitation('Ana')` no hace una invitación: JavaScript se detiene con un `TypeError`, porque una clase solo se puede usar con `new`.

## El constructor, new y this

Cada clase tiene un método especial llamado **constructor**. Es el código que corre cuando se crea una instancia nueva, y su trabajo es prepararla: aquí, guardar a su invitado. Los valores que le pasas a la clase, como `'Ana'`, van directo a los parámetros del constructor, como `guest`.

La palabra clave **`new`** es la que llama al constructor. `new Invitation('Ana')` parece una sola acción, pero JavaScript hace cuatro cosas pequeñas:

1. Crea un objeto nuevo y vacío.
2. Hace que **`this`** apunte a ese objeto.
3. Ejecuta el constructor, que llena el objeto (`this.guest = 'Ana'`).
4. Regresa el objeto terminado, que normalmente guardamos en una variable.

```viz
invitation-new
```

**Qué acaba de pasar:** el objeto se construyó frente a ti: vacío, luego apuntado por `this`, luego llenado por el constructor, luego entregado a `forAna`. Por eso el constructor escribe `this.guest` y no solo `guest`. `guest` es el parámetro que se pasó; `this.guest` es la propiedad guardada en **esta invitación en particular**.

**`this`** siempre significa "la instancia para la que está corriendo este código". Cuando el constructor corre para `forAna`, `this` es `forAna`. Cuando corre para `forBen`, `this` es `forBen`. La misma línea de código, `this.guest = guest`, escribe en una invitación distinta cada vez, y así una sola clase puede hacer muchas instancias sin que se estorben entre sí.

Un constructor también puede preparar propiedades que no se le pasan. Aquí, cada invitación nueva empieza sin enviar:

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
    this.isSent = false // cada invitación empieza sin enviar
  }
}

const forAna = new Invitation('Ana')
console.log(forAna.guest, forAna.isSent)
```

**Error común:** escribir `guest = guest` en vez de `this.guest = guest` en el constructor. Eso solo reasigna el parámetro, así que la invitación se queda sin invitado.

## Métodos: getters y setters

Una clase también puede tener **métodos**: funciones que pertenecen a la clase y trabajan con los datos de una instancia. Se escriben dentro de la clase, sin la palabra `function`. La mayoría de los métodos caen en dos grupos generales. Un **getter** lee algún dato de la instancia y lo regresa. Un **setter** cambia los datos de la instancia.

```js-run
class Invitation {
  constructor(guest) {
    this.guest = guest
  }

  getGuest() {
    return this.guest
  }

  setGuest(guest) {
    this.guest = guest
  }
}

const forAna = new Invitation('Ana')
const forBen = new Invitation('Ben')

console.log(forAna.getGuest())
console.log(forBen.getGuest())

forBen.setGuest('Benny') // el nombre estaba mal en la invitación de Ben
console.log(forBen.getGuest()) // cambió
console.log(forAna.getGuest()) // no cambió
```

```viz
invitation-methods
```

**Qué acaba de pasar:** `getGuest` se escribe una sola vez, en la clase, y cada instancia lo puede usar. Cuando llamas `forAna.getGuest()`, `this` es `forAna`; cuando llamas `forBen.getGuest()`, `this` es `forBen`. Por eso el mismo método dio dos respuestas distintas, y por eso `setGuest` en una invitación nunca tocó a la otra.

¿Para qué usar métodos, si podrías escribir `forBen.guest = 'Benny'` directamente? Porque los métodos dejan que la clase decida cómo se usan sus datos. Un setter podría revisar el valor nuevo primero, o actualizar dos propiedades juntas para que nunca se contradigan. Cuando construyas una lista enlazada, un método como `push` va a mantener sincronizados el `head`, el `tail` y el `length` de la lista, algo fácil de hacer mal si cambias esas propiedades a mano.

Quizá también veas la sintaxis propia de JavaScript, `get` y `set`, que deja leer un método como si fuera una propiedad:

```js
class Invitation {
  constructor(guest) {
    this._guest = guest
  }

  get guest() {
    return this._guest
  }
}

new Invitation('Ana').guest // 'Ana', sin paréntesis
```

En este curso escribimos los getters y setters como métodos normales, como `getGuest()`, para que siempre quede claro cuándo corre un método.

**Error común:** olvidar los paréntesis. `forAna.getGuest` sin `()` no llama al método: te regresa la función misma.

## Cada estructura de datos es una clase

¿Por qué una lección entera sobre invitaciones? Porque **cada estructura de datos que vas a construir en este curso es una clase**. Una lista enlazada, una pila, una cola, un árbol, una tabla hash, un grafo: cada una es una clase con un constructor que la prepara y métodos que hacen trabajos específicos con sus datos.

Este es un adelanto de la clase que vas a construir en el siguiente módulo. El constructor recibe un valor y crea la lista con ese primer elemento. Luego cada método hace un trabajo: `push` agrega un elemento al final, `unshift` agrega uno al principio, `insert` agrega uno en un índice, `remove` saca el elemento de un índice, `pop` quita el último y `shift` quita el primero.

```js
class LinkedList {
  constructor(value) {
    // crear la lista con su primer elemento
  }
  push(value) {}
  unshift(value) {}
  insert(index, value) {}
  remove(index) {}
  pop() {}
  shift() {}
}
```

```viz
list-class-preview
```

**Qué acaba de pasar:** una instancia de `LinkedList`, `line`, pasó por todos los métodos. Cada llamada hizo una cosa específica, y como los métodos pertenecen a la clase, `line.push(...)` siempre trabaja con los datos de `line`. Una segunda lista hecha con `new LinkedList(...)` tendría sus propios invitados, y sus métodos trabajarían con esos, igual que `forAna` y `forBen`.

Ese es el poder de las clases: cuando una estructura de datos está escrita como clase, puedes crear todas las que necesites con `new`, y cada una lleva sus propios datos y su propio juego de herramientas. Crear una instancia y llamar a un getter o setter sencillo como `getGuest` son **O(1)**: hacen la misma pequeña cantidad de trabajo sin importar cuántas invitaciones existan. Los métodos que vas a escribir en los siguientes módulos no van a ser todos tan baratos, y medirlos con Big O es una parte importante del trabajo.

**Error común:** pensar que la clase _es_ los datos. La clase es solo el plano. Los datos viven en cada instancia que creas con `new`.

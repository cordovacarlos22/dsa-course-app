---
title: 'Clases: el plano de cada estructura de datos'
order: 1
minutes: 12
---

> **Meta:** escribir una clase con un constructor y métodos, saber qué hacen `new` y `this`, y ver por qué cada estructura de datos de este curso es una clase.

## Una clase es un molde para galletas

Hasta ahora has guardado datos en arrays y objetos, y has escrito funciones que trabajan con esos datos. Una **clase** junta las dos cosas en un solo lugar: describe qué datos guarda algo **y** qué puedes hacer con ellos. Piensa en un **molde para galletas**. El molde no es una galleta. Es una forma que usas para hacer todas las galletas que quieras, y cada galleta que hace tiene la misma forma.

En código, el molde es la **clase**, y cada galleta que hace es una **instancia** de esa clase (también vas a oír "un objeto creado a partir de la clase"). Aquí tienes una clase `Cookie` (galleta). Por convención, los nombres de las clases empiezan con **mayúscula** (`Cookie`, `LinkedList`), y así es fácil distinguirlos de las variables y funciones normales (`cookie`, `push`):

```js
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }
}
```

Eso ya es una clase completa. Es pequeña, pero puede hacer galletas, y cada galleta que hace recibe su propio sabor, `flavor`.

```viz
cookie-cutter
```

**Qué acaba de pasar:** la clase fue la misma todo el tiempo: es el molde. `new Cookie('chocolate')` hizo la primera instancia, y `new Cookie('vanilla')` hizo una segunda. Las dos tienen la misma forma (un `flavor`), pero cada una guarda su **propio** valor. Hacer mil galletas más no cambiaría el molde para nada.

Ejecútalo, y fíjate en la última línea: dos galletas hechas con la misma clase siguen siendo dos objetos distintos.

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }
}

const cookieOne = new Cookie('chocolate')
const cookieTwo = new Cookie('vanilla')

console.log(cookieOne.flavor)
console.log(cookieTwo.flavor)
console.log(cookieOne === cookieTwo) // false: dos galletas distintas
```

**Error común:** olvidar `new`. Sin él, `Cookie('chocolate')` no hace una galleta: JavaScript se detiene con un `TypeError`, porque una clase solo se puede usar con `new`.

## El constructor, new y this

Cada clase tiene un método especial llamado **constructor**. Es el código que corre cuando se crea una instancia nueva, y su trabajo es prepararla: aquí, guardar su sabor. Los valores que le pasas a la clase, como `'chocolate'`, van directo a los parámetros del constructor, como `flavor`.

La palabra clave **`new`** es la que llama al constructor. `new Cookie('chocolate')` parece una sola acción, pero JavaScript hace cuatro cosas pequeñas:

1. Crea un objeto nuevo y vacío.
2. Hace que **`this`** apunte a ese objeto.
3. Ejecuta el constructor, que llena el objeto (`this.flavor = 'chocolate'`).
4. Regresa el objeto terminado, que normalmente guardamos en una variable.

```viz
cookie-new
```

**Qué acaba de pasar:** el objeto se construyó frente a ti: vacío, luego apuntado por `this`, luego llenado por el constructor, y al final entregado a `cookieOne`. Por eso el constructor escribe `this.flavor` y no solo `flavor`. `flavor` es el parámetro que se recibió; `this.flavor` es la propiedad guardada en **esta galleta en particular**.

**`this`** siempre quiere decir "la instancia para la que está corriendo este código". Cuando el constructor corre para `cookieOne`, `this` es `cookieOne`. Cuando corre para `cookieTwo`, `this` es `cookieTwo`. La misma línea de código, `this.flavor = flavor`, escribe en una galleta distinta cada vez, y así una sola clase puede hacer muchas instancias sin que se estorben entre sí.

Un constructor también puede preparar propiedades que no se le pasan. Aquí, cada galleta nueva empieza sin hornear:

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
    this.isBaked = false // cada galleta empieza cruda
  }
}

const cookieOne = new Cookie('chocolate')
console.log(cookieOne.flavor, cookieOne.isBaked)
```

**Error común:** escribir `flavor = flavor` en vez de `this.flavor = flavor` en el constructor. Eso solo reasigna el parámetro, así que la galleta termina sin ningún sabor.

## Métodos: getters y setters

Una clase también puede tener **métodos**: funciones que pertenecen a la clase y trabajan con los datos de una instancia. Se escriben dentro de la clase, sin la palabra `function`. La mayoría de los métodos caen en dos grandes grupos. Un **getter** lee algún dato de la instancia y lo regresa. Un **setter** cambia los datos de la instancia.

```js-run
class Cookie {
  constructor(flavor) {
    this.flavor = flavor
  }

  getFlavor() {
    return this.flavor
  }

  setFlavor(flavor) {
    this.flavor = flavor
  }
}

const cookieOne = new Cookie('chocolate')
const cookieTwo = new Cookie('vanilla')

console.log(cookieOne.getFlavor())
console.log(cookieTwo.getFlavor())

cookieOne.setFlavor('oatmeal')
console.log(cookieOne.getFlavor()) // cambió
console.log(cookieTwo.getFlavor()) // no cambió
```

```viz
cookie-methods
```

**Qué acaba de pasar:** `getFlavor` se escribe una sola vez, en la clase, y cada instancia lo puede usar. Cuando llamas `cookieOne.getFlavor()`, `this` es `cookieOne`; cuando llamas `cookieTwo.getFlavor()`, `this` es `cookieTwo`. Por eso el mismo método dio dos respuestas distintas, y por eso `setFlavor` en una galleta nunca tocó a la otra.

¿Para qué usar métodos, si podrías escribir directamente `cookieOne.flavor = 'oatmeal'`? Porque los métodos le dejan a la clase decidir cómo se usan sus datos. Un setter podría revisar el valor nuevo primero, o actualizar dos propiedades juntas para que nunca se contradigan. Cuando construyas una lista enlazada, un método como `push` va a mantener sincronizados el `head`, el `tail` y el `length` de la lista, algo que es fácil hacer mal si cambias esas propiedades a mano.

También vas a ver la sintaxis propia de JavaScript, `get` y `set`, que deja leer un método como si fuera una propiedad:

```js
class Cookie {
  constructor(flavor) {
    this._flavor = flavor
  }

  get flavor() {
    return this._flavor
  }
}

new Cookie('chocolate').flavor // 'chocolate', sin paréntesis
```

En este curso escribimos los getters y setters como métodos normales, como `getFlavor()`, para que siempre quede claro cuándo corre un método.

**Error común:** olvidar los paréntesis. `cookieOne.getFlavor` sin `()` no llama al método: te regresa la función misma.

## Cada estructura de datos es una clase

¿Por qué una lección entera sobre galletas? Porque **cada estructura de datos que vas a construir en este curso es una clase**. Una lista enlazada, una pila, una cola, un árbol, una tabla hash, un grafo: cada una es una clase con un constructor que la prepara y métodos que hacen trabajos específicos con sus datos.

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

**Qué acaba de pasar:** una instancia de `LinkedList`, `line`, pasó por todos los métodos. Cada llamada hizo una cosa específica, y como los métodos pertenecen a la clase, `line.push(...)` siempre trabaja con los datos de `line`. Una segunda lista hecha con `new LinkedList(...)` tendría sus propios invitados, y sus métodos trabajarían con esos, igual que `cookieOne` y `cookieTwo`.

Ese es el poder de las clases: cuando una estructura de datos está escrita como clase, puedes crear todas las que necesites con `new`, y cada una lleva sus propios datos y su propio juego de herramientas. Crear una instancia y llamar a un getter o setter sencillo como `getFlavor` son **O(1)**: hacen la misma pequeña cantidad de trabajo sin importar cuántas galletas existan. Los métodos que vas a escribir en los siguientes módulos no van a ser todos tan baratos, y medirlos con Big O es una parte importante del trabajo.

**Error común:** pensar que la clase _es_ los datos. La clase es solo el plano. Los datos viven en cada instancia que creas con `new`.

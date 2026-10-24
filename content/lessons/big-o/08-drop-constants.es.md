---
title: Elimina las constantes
order: 8
minutes: 10
---

> **Meta:** simplificar expresiones como O(2n) con la primera regla: eliminar las constantes.

## Dos bucles seguidos

Big O tiene algunas reglas que simplifican la notación y nos hacen la vida más fácil. Existen porque a Big O solo le importa la **forma** del crecimiento, así que todo lo que no cambia la forma puede irse. La primera regla se llama **eliminar las constantes** (también vas a escuchar "quitar las constantes"). Una **constante** es un número fijo que no depende de n, como el 2 de 2n o el 100 de 100n.

De aquí salen las constantes. Toma `printNumbers` de la lección anterior y agrégale un segundo bucle que haga lo mismo, usando `j` en lugar de `i`. El primer bucle corre n veces; luego el segundo bucle corre n veces. Dos bucles **uno después del otro** se suman: n + n = **2n**.

Esta es la misma forma con la lista de invitados, un bucle de bienvenidas y luego uno de despedidas:

```viz
trace-welcome-and-goodbye
```

**Qué acaba de pasar:** el primer bucle le dio la bienvenida a cada persona, un mensaje por nombre. Cuando terminó, el segundo bucle empezó desde el principio y se despidió de cada persona. Con 3 invitados, son 3 + 3 = 6 mensajes; con 6 invitados, 12. El total siempre es 2n.

Esta es `printTwice`, la versión con números:

```js-run
function printTwice(n) {
  for (let i = 0; i < n; i++) {
    console.log(i)
  }
  for (let j = 0; j < n; j++) {
    console.log(j)
  }
}

printTwice(3)
```

Con 3, imprime 0, 1, 2 del primer bucle y luego 0, 1, 2 otra vez del segundo. Los dos bucles corren n veces, así que el código corre **n + n = 2n** veces. Tiene sentido llamarlo **O(2n)**. Esta es la simplificación: 2n, 3n o 100n, el número de adelante no hace ninguna diferencia. Sea cual sea la constante, **la eliminamos**, y este código es **O(n)**.

**Error común:** pensar que eliminar la constante significa que el código hace menos trabajo. `printTwice(50)` sigue imprimiendo 100 líneas. Big O simplemente no usa el 2 para describirlo, porque 2n y n crecen igual.

## La misma forma, así que quita el número

¿Por qué se vale? Porque una constante cambia qué tan **inclinada** está una línea, no qué **tipo** de línea es. Mira las líneas n, 2n y 3n. Todas son **líneas rectas**. 2n está más inclinada, pero si duplicas la entrada, las dos se duplican. Big O describe la **forma** del crecimiento, no qué tan inclinada está.

```viz
same-shape
```

**Qué acaba de pasar:** n, 2n y 3n se dibujaron en la misma gráfica. Cada una estaba más inclinada que la anterior, pero las tres eran rectas. Luego apareció n², y se dobló hacia arriba y dejó atrás a las tres. Multiplicar por una constante hizo las líneas más inclinadas; solo cambiar la forma, de n a n², hizo una diferencia de verdad.

Imagina la gráfica estirándose hasta valores enormes de n, y aléjate mucho. Desde tan lejos, 13n², n² y 1,000n² se ven casi iguales, y lo mismo pasa con n, 2n y 100n. Las constantes simplemente no cambian el panorama general:

| Contaste      | Escríbelo así |
| ------------- | ------------- |
| 2n            | O(n)          |
| 100n          | O(n)          |
| n / 2         | O(n)          |
| 500 (siempre) | O(1)          |
| 13n²          | O(n²)         |

La fila de O(500) merece una segunda mirada: quiere decir "500 operaciones cada vez, sea cual sea n". Eso es una línea plana, así que lo simplificamos a **O(1)**, tiempo constante. Y n / 2 también tiene una constante: es n por ½.

Puedes ver "la misma forma" en números. Duplica n, y cada una de estas se duplica, sea cual sea su constante:

```js-run
const sizes = [10, 20, 40]
for (let k = 0; k < sizes.length; k++) {
  const n = sizes[k]
  console.log('n =', n, '| n:', n, '| 2n:', 2 * n, '| 100n:', 100 * n, '| n / 2:', n / 2)
}
```

**Error común:** quitar el pequeño 2 de n² como si fuera una constante. 13n² se vuelve **O(n²)**, no O(n). El 13 es una constante que multiplica, así que se va. El ² es parte de la forma: dice que el trabajo crece con n × n, y eso se queda.

## Por qué se vale

Esta regla sale directamente de la definición: un código es O(f(n)) si, cuando n ya es lo bastante grande, sus operaciones nunca son más que **una constante por f(n)**. 2n nunca es mayor que 2 × n, y 100n nunca es mayor que 100 × n, así que los dos son O(n). La constante ya viene "incluida" en la definición, así que volver a escribirla no agrega nada.

Intenta simplificar estas:

- O(n × 40) → **O(n)**
- O(1,000,000) → **O(1)**
- O(2n + 5n) → O(7n) → **O(n)**

El panorama general es el mismo que el de la gráfica de la lección 4. Ahí cada forma es una sola línea, y no hay una línea aparte para 2n o 100n: todas son parte de la familia O(n).

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** la gráfica dibujó una línea por forma: O(1), O(log n), O(n) y O(n²). Cuando eliminamos las constantes, estamos diciendo a cuál de estas líneas pertenece un código. `printTwice` pertenece a O(n), aunque su línea exacta estaría el doble de inclinada.

¿Quiere decir que las constantes nunca importan? No. Una versión que recorre la lista una vez sigue siendo más rápida que una que la recorre dos veces, y en código real eso puede contar. Ejecuta esto para comparar el trabajo de una pasada y de dos pasadas sobre un millón de invitados:

```js-run
const n = 1000000

let onePass = 0
for (let i = 0; i < n; i++) {
  onePass++ // darle la bienvenida a cada persona
}

let twoPasses = 0
for (let i = 0; i < n; i++) {
  twoPasses++ // darle la bienvenida a cada persona
}
for (let i = 0; i < n; i++) {
  twoPasses++ // luego despedirse de cada persona
}

console.log('Una pasada:', onePass, 'pasos')
console.log('Dos pasadas:', twoPasses, 'pasos')
```

Las dos son O(n), y las dos se duplicarían si la lista de invitados se duplicara. Dos pasadas hacen el doble de trabajo, algo que quizá arregles algún día, pero es una mejora de segundo nivel. Big O se fija primero en el panorama general: ¿el trabajo es plano, una línea recta o una curva que se dispara?

**Por dentro:** la constante ni siquiera es un número confiable. Nuestras cuentas tratan todas las operaciones como iguales, pero el procesador no. Leer un valor que ya está en su **caché** (una memoria pequeña y muy rápida, pegada a él) puede ser unas cien veces más rápido que traerlo de la memoria principal. Y el motor puede convertir una línea en varios pasos de máquina, o varias líneas en uno. Así que dos funciones que "hacen 2n operaciones" pueden correr a velocidades bastante distintas en la misma computadora. La constante depende del hardware y del motor; la forma no. Esa es una razón más para que Big O se quede solo con la forma.

**Error común:** escribir la constante en una respuesta de entrevista, como "es O(2n)". Las matemáticas no están mal, pero le dice a quien te entrevista que todavía no simplificaste. Di "es O(n)", y si ayuda, agrega "recorre la lista dos veces".

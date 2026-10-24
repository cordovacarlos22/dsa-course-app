---
title: 'Repaso: comparando todo'
order: 17
minutes: 11
---

> **Meta:** poner cada Big O lado a lado, conocer las palabras que se usan para cada uno y repasar las reglas.

## Los números lado a lado

Ya conoces todas las formas que usa este curso: O(1), O(log n), O(n), O(n log n) y O(n²). Cada una describe cómo crece el trabajo con la entrada, y las diferencias entre ellas no son pequeñas. Son la diferencia entre un código que maneja un millón de elementos sin pestañear y uno que se congela con diez mil.

Por eso también **elegir el algoritmo correcto importa más que comprar una computadora más rápida**. Una computadora 10 veces más rápida corre cualquier algoritmo 10 veces más rápido, pero no cambia ninguna forma. Un algoritmo O(n²) en esa computadora nueva solo puede manejar unas 3 veces más elementos en el mismo tiempo (porque 3 × 3 es más o menos 10). Cambiar a un algoritmo O(n) hace mucho más: el millón de pasos que O(n²) gasta en 1,000 elementos le alcanza a O(n) para manejar un millón de elementos.

```viz
big-o-growth-chart
```

**Qué acaba de pasar:** la gráfica agregó las formas una por una, desde la línea plana de O(1) hasta la curva empinada de O(n²), y luego las mostró todas juntas. En la orilla derecha están tan separadas que O(1) y O(log n) parecen acostadas en el piso.

¿Qué tan lejos están estas formas, de verdad? Ejecuta esto para contar los pasos con n = 100 y n = 1,000:

```js-run
const sizes = [100, 1000]
for (let i = 0; i < sizes.length; i++) {
  const n = sizes[i]
  console.log('n =', n)
  console.log('  O(1):', 1, ' O(log n):', Math.round(Math.log2(n)))
  console.log('  O(n):', n, ' O(n²):', n * n)
}
```

Con n = 100: O(1) es 1, O(log n) es más o menos 7, O(n) es 100 y O(n²) es 10,000. Con n = 1,000: 1, más o menos 10 (2¹⁰ = 1,024, casi mil), 1,000 y **1,000,000**. La diferencia entre O(n) y O(n²) ya es enorme con mil elementos, y las apps reales manejan millones.

**Error común:** pensar que una computadora lo bastante rápida hace que Big O no importe. El hardware acelera cada paso lo mismo, pero no puede cambiar cuántos pasos hay. Con entradas grandes, la forma siempre gana.

## Las palabras, y una hoja de referencia

Quienes entrevistan y quienes programan casi nunca dicen "O de n al cuadrado" sin un nombre o una imagen que lo acompañe. Cada forma tiene un **nombre**, y casi todas tienen una frase que la gente usa para ella. Conocer las dos te ayuda a seguir una conversación y a explicar tu propio código:

| Big O      | Nombre                  | Vas a escuchar…                 | Ejemplo                                 |
| ---------- | ----------------------- | ------------------------------- | --------------------------------------- |
| O(1)       | constante               | "tiempo constante"              | leer un elemento de un array por índice |
| O(log n)   | logarítmico             | "dividir y conquistar"          | búsqueda binaria                        |
| O(n)       | lineal                  | "proporcional"                  | recorrer un array                       |
| O(n log n) | linearítmico            | "el mejor ordenamiento general" | merge sort, quick sort                  |
| O(n²)      | cuadrático (polinomial) | "un bucle dentro de otro"       | cada persona saluda a todas las demás   |

Una gran referencia gratis es la **Big O Cheat Sheet**, en bigocheatsheet.com. Su gráfica califica cada ritmo de crecimiento en una escala que va de **Excelente** (_Excellent_) a **Horrible**: O(1) y O(log n) están en el extremo excelente, O(n²), O(2ⁿ) y O(n!) en el horrible, y O(n) y O(n log n) en medio. También muestra O(2ⁿ) y O(n!), que crecen todavía más rápido; O(n!) es algo que básicamente solo vas a ver si escribes código malo a propósito.

Debajo de la gráfica, sus tablas muestran las estructuras de datos más comunes con su tiempo **promedio (Θ)** y en el **peor caso (O)** para cada operación, además de su espacio. La tabla de ordenamientos agrega también el **mejor caso (Ω)**. Esos son los tres casos de la lección 6:

```viz
search-cases
```

**Qué acaba de pasar:** la misma búsqueda hizo 1 revisión en el mejor caso (Ω), más o menos media lista en el caso promedio (Θ), y a todos los invitados en el peor caso (O). Las tablas de la hoja de referencia usan justo estas tres columnas, así que ya las puedes leer.

Vas a notar que algunos ordenamientos tienen una complejidad temporal terrible pero una espacial excelente (selection sort), mientras que otros tienen una complejidad temporal excelente pero necesitan más espacio (merge sort): otra vez el intercambio entre tiempo y espacio. Ten esa página a la mano y vuelve a ella a medida que aprendas cada tema.

Mira qué tan rápido crece el extremo "horrible", incluso con una n pequeña:

```js-run
const n = 16

let factorial = 1
for (let i = 2; i <= n; i++) {
  factorial = factorial * i
}

console.log('n = 16')
console.log('O(log n):', Math.log2(n))
console.log('O(n²):', n * n)
console.log('O(2ⁿ):', Math.pow(2, n))
console.log('O(n!):', factorial)
```

**Error común:** memorizar la tabla en vez de las razones. Si sabes **por qué** la búsqueda binaria es O(log n) (parte los datos a la mitad en cada paso), vas a reconocer la misma forma en código que nunca has visto. Una tabla memorizada no puede hacer eso.

## Resumen

La **notación Big O** es nuestra herramienta para juzgar cómo se desempeña un algoritmo. Nos da un **entendimiento de alto nivel** de cómo cambia el tiempo de ejecución (complejidad temporal) o la memoria (complejidad espacial) de un algoritmo cuando crece su entrada. No le importa la precisión, solo las **tendencias generales**. Y es una propiedad del **algoritmo** mismo, no de la máquina que lo corre: una supercomputadora corre el mismo código más rápido que tu laptop, pero la tendencia es la misma.

Las reglas que aprendiste:

1. **Cuenta operaciones, no segundos.**
2. Big O es el **peor caso** (Ω es el mejor caso, Θ el promedio).
3. **Elimina las constantes:** O(2n) → O(n), O(100n²) → O(n²), O(500) → O(1).
4. **Elimina los términos no dominantes:** O(n² + n) → O(n²).
5. **Entradas distintas, términos distintos:** O(a + b) y O(a · b).
6. Un **bucle dentro de otro** es O(n²); **dividir y conquistar** es O(log n); **O(1)** es el más eficiente de todos.
7. Mide también el **espacio**: la memoria extra que crea el algoritmo.

De mejor a peor: **O(1) < O(log n) < O(n) < O(n log n) < O(n²)**.

```viz
dominant-term
```

**Qué acaba de pasar:** esta fue la regla 4 en acción. Conforme n crecía, la parte n² hacía cada vez más del trabajo en n² + n, hasta que la parte n quedó como una rebanada. Por eso la respuesta simplificada es O(n²).

Aquí tienes una última función para analizar con todas las reglas a la vez. Predice su Big O, luego ejecútala y mira cómo crecen las cuentas:

```js-run
function partyPlan(guests) {
  let steps = 0
  steps++ // el anfitrión revisa la puerta: O(1)
  for (let i = 0; i < guests.length; i++) {
    steps++ // darle la bienvenida a cada persona: O(n)
  }
  for (let i = 0; i < guests.length; i++) {
    for (let j = 0; j < guests.length; j++) {
      steps++ // cada persona conoce a todas las demás: O(n²)
    }
  }
  return steps
}

const sizes = [10, 100, 1000]
for (let k = 0; k < sizes.length; k++) {
  const guests = []
  for (let i = 0; i < sizes[k]; i++) {
    guests.push('Persona ' + i)
  }
  console.log(sizes[k], 'invitados:', partyPlan(guests), 'pasos')
}
```

Es 1 + n + n², y con las reglas, eso es **O(n²)**: diez veces más invitados, unas cien veces más pasos.

Big O está en todo este curso, y vas a practicarlo mucho. Antes de seguir, haz el **cuestionario de Big O** en la página del módulo.

**Error común:** analizar solo el tiempo. Cada respuesta tiene dos mitades: "Esto es O(n²) de tiempo y O(1) de espacio." Muchas veces te van a preguntar la segunda mitad justo después de que des la primera.

---
title: 'Paso 2: Explorar ejemplos concretos'
order: 3
minutes: 10
---

> **Meta:** usar ejemplos (simples, más complejos, vacíos e inválidos) para entender mejor un problema y para revisar tu solución después.

## ¿Por qué ejemplos?

El segundo paso es **explorar ejemplos concretos**: entradas reales, escritas junto con la salida que esperas. Está muy ligado al primer paso. Un problema descrito con palabras puede sentirse perfectamente claro hasta que pruebas una entrada real y te das cuenta de que no sabes qué debería salir.

Los ejemplos hacen dos trabajos. Primero, te ayudan a **entender el problema**: cada ejemplo que no puedes responder es una pregunta que hacer. Segundo, son **pruebas de cordura**: cuando ya escribiste una solución, sabes lo que debería regresar para cada ejemplo, así que puedes revisarla de inmediato. Los equipos profesionales hacen lo mismo a mayor escala. Una **historia de usuario** describe qué debe pasar cuando alguien usa la app y hace algo, y una **prueba unitaria** ejecuta un pedazo de código con una entrada y revisa la salida. De hecho, cada comprobación de código de este curso es una lista de ejemplos: entradas, y las salidas que tu código debe regresar.

Nuestro problema para el resto del módulo es: **"Escribe una función que reciba un string y regrese cuántas veces aparece cada carácter."** Llamémosla `countCharacters`. La salida va a ser un objeto: cada clave es un carácter, y su valor es cuántas veces aparece ese carácter. Empieza con ejemplos simples, y escríbelos:

- `countCharacters('aaa')` → `{ a: 3 }`
- `countCharacters('banana')` → `{ b: 1, a: 3, n: 2 }`

```viz
five-steps-examples
```

**Qué acaba de pasar:** la lista del paso 2 tiene cuatro tipos de ejemplos, y vas a usar los cuatro con `countCharacters` en esta lección: simples, más complejos, vacíos e inválidos. Ir en ese orden quiere decir que empiezas con los casos que tienes claros y luego avanzas hacia los raros.

Hasta los ejemplos simples traen una pregunta. Para `'aaa'`, ¿el objeto también debería tener todas las demás letras con 0, como `{ a: 3, b: 0, c: 0, … }`? Eso podría hacer el código un poco más simple, porque cada clave ya existiría, pero el objeto siempre tendría decenas de claves. Pregunta. Nosotros diremos que no: solo los caracteres que de verdad aparecen.

**Error común:** guardar los ejemplos en tu cabeza. Escríbelos donde tú (y quien te entrevista) puedan verlos. Los vas a necesitar otra vez en el paso 5.

## De lo simple a lo más complejo

Cuando los ejemplos simples estén claros, pasa a los **más complejos**. Son los que te hacen descubrir las reglas reales del problema. Prueba con una frase corta:

- `countCharacters('Hi Ana!')`: ¿contamos el **espacio**? ¿El **`!`**? ¿**`'H'` y `'h'`** son el mismo carácter, o dos distintos? ¿Y `'A'` y `'a'`?
- `countCharacters('Party at 8!')`: ¿hay que contar el **dígito** `'8'`?

Ninguna de estas tiene una respuesta obvia, porque el problema tal como está escrito no lo dice. En una entrevista preguntarías; practicando por tu cuenta, decidirías y escribirías la decisión. Para este módulo, decidimos: **contar solo letras y dígitos, ignorar mayúsculas y minúsculas (contarlo todo en minúsculas) y saltarse los espacios y la puntuación**.

```viz
example-ladder
```

**Qué acaba de pasar:** los ejemplos fueron de fáciles a raros. Los simples tenían respuestas claras. Los más difíciles produjeron signos de pregunta, y al final cada pregunta tenía su respuesta. Fíjate de dónde salieron las reglas de nuestra función: no del problema original, sino de los ejemplos.

Puedes escribir tus ejemplos como código, para que estén listos para ejecutarse en cuanto exista la función:

```js-run
const examples = [
  { input: 'aaa', expected: { a: 3 } },
  { input: 'banana', expected: { b: 1, a: 3, n: 2 } },
  { input: 'Hi Ana!', expected: { h: 1, i: 1, a: 2, n: 1 } },
  { input: 'Party at 8!', expected: { p: 1, a: 2, r: 1, t: 2, y: 1, 8: 1 } },
  { input: '', expected: {} },
]

for (let i = 0; i < examples.length; i++) {
  console.log(examples[i].input, '→', examples[i].expected)
}
```

**Error común:** probar solo los ejemplos "felices", donde todo es normal. Los ejemplos que te hacen dudar son los valiosos: ahí es donde se esconden los bugs.

## Entradas vacías e inválidas

Dos tipos más de ejemplos completan la lista. **Entradas vacías:** ¿qué debería regresar `countCharacters('')`? Un objeto vacío, `{}`, parece lo natural, pero alguien podría defender `null`, `false` o `undefined`. Las entradas vacías muchas veces te muestran cómo se supone que funciona el problema, así que siempre vale la pena preguntar por ellas.

**Entradas inválidas:** ¿y si alguien llama `countCharacters(42)`, `countCharacters(null)`, o `countCharacters()` sin nada? En una entrevista, la respuesta suele ser "supón que la entrada es válida". En apps reales importa mucho más: los usuarios escriben cosas inesperadas, y otro código pasa valores equivocados. Pensar en las entradas inválidas es como se construye código que no se rompe de formas extrañas. Mira lo que hace un bucle sencillo con entradas malas:

```js-run
function totalCharacters(text) {
  let count = 0
  for (let i = 0; i < text.length; i++) {
    count++
  }
  return count
}

console.log(totalCharacters('party')) // 5
console.log(totalCharacters('')) // 0
console.log(totalCharacters(42)) // 0: un número no tiene length, así que el bucle nunca corre
console.log(totalCharacters(['a', 'b'])) // 2: ¡un array también tiene length!
console.log(totalCharacters(null)) // truena: null no tiene length
```

**Qué acaba de pasar:** el string vacío dio `0`, lo cual es correcto. El número `42` dio `0` sin avisar, el array se contó como si fuera un string, y `null` detuvo el programa con un error. Tres entradas inválidas, tres comportamientos distintos, y ninguno fue una decisión de nadie. Por eso decides qué debe pasar con las entradas inválidas, en vez de dejar que pase por accidente. Para `countCharacters`, aceptaremos solo strings.

Fíjate en que Big O todavía no ha aparecido. Es normal: los pasos 1 y 2 tratan de **qué** construir. Qué tan rápido corre es una pregunta para el paso 5.

**Error común:** suponer que una entrada es válida porque se ve bien. Un array tiene `length` y se puede leer por índice, igual que un string, pero no es uno.

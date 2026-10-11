// The guest list used by every Big O animation, so students follow one story
// through the whole module. Alphabetical, so binary search works on it too.
export const GUESTS = [
  'Ana',
  'Ben',
  'Cleo',
  'Dev',
  'Eli',
  'Fay',
  'Gus',
  'Hana',
  'Ivan',
  'Jade',
  'Kai',
  'Lola',
  'Max',
  'Nia',
  'Omar',
  'Pia',
  'Quinn',
  'Rosa',
  'Sam',
  'Tess',
]

// The first `count` guests.
export function guestList(count) {
  return GUESTS.slice(0, count)
}

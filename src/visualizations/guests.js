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

// Each guest's answer to the invitation, keyed by name: the object the
// "Big O of Arrays & Objects" animations use, so the party story goes on.
export const RSVPS = {
  Ana: 'yes',
  Ben: 'no',
  Cleo: 'maybe',
  Dev: 'yes',
  Eli: 'no',
}

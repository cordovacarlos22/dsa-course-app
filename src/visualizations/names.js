// The names lessons can use in a ```viz block.
// Kept in its own plain-JS file so scripts/validate-content.js can check that
// every lesson only uses animations that exist. When you add an animation,
// add its name here AND register its component in ./index.js.
export const VISUALIZATION_NAMES = [
  'big-o-growth-chart',
  'array-reindex',
  'binary-search-halving',
]

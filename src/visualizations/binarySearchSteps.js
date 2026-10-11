// Runs a real binary search and records one step per check, so the
// animation can never disagree with the algorithm.
export function buildBinarySearchSteps(values, target) {
  const steps = [
    { low: 0, high: values.length - 1, middle: null, captionKey: 'start' },
  ]
  let low = 0
  let high = values.length - 1
  let checks = 0

  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    checks++
    if (values[middle] === target) {
      steps.push({ low, high, middle, captionKey: 'found', checks })
      break
    }
    const captionKey = values[middle] < target ? 'goRight' : 'goLeft'
    steps.push({ low, high, middle, captionKey, checks })
    if (values[middle] < target) low = middle + 1
    else high = middle - 1
  }
  return steps
}

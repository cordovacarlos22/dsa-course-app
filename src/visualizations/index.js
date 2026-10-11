// Maps each animation name (used in a lesson's ```viz block) to its component.
// The list of names lives in ./names.js so the content validator can use it.
import ArrayReindex from './ArrayReindex'
import BigOGrowthChart from './BigOGrowthChart'
import BinarySearchHalving from './BinarySearchHalving'

export const visualizations = {
  'big-o-growth-chart': BigOGrowthChart,
  'array-reindex': ArrayReindex,
  'binary-search-halving': BinarySearchHalving,
}

// Maps each animation name (used in a lesson's ```viz block) to its component.
// The list of names lives in ./names.js so the content validator can use it.
import { createElement } from 'react'
import ArrayReindex from './ArrayReindex'
import BigOGrowthChart from './BigOGrowthChart'
import BinarySearchHalving from './BinarySearchHalving'
import CodeTrace from './CodeTrace'
import ConstantJump from './ConstantJump'
import DominantTerm from './DominantTerm'
import HalvingCount from './HalvingCount'
import LinearBoxes from './LinearBoxes'
import MemoryBoxes from './MemoryBoxes'
import NestedGrid from './NestedGrid'
import SameShape from './SameShape'
import SearchCases from './SearchCases'
import StopwatchRace from './StopwatchRace'
import TwoInputs from './TwoInputs'
import { traces } from './traces'

// Every code trace is drawn by the same <CodeTrace> component.
const traceComponents = Object.fromEntries(
  Object.entries(traces).map(([name, trace]) => [
    name,
    () => createElement(CodeTrace, { trace }),
  ]),
)

export const visualizations = {
  'big-o-growth-chart': BigOGrowthChart,
  'array-reindex': ArrayReindex,
  'binary-search-halving': BinarySearchHalving,
  'stopwatch-race': StopwatchRace,
  'search-cases': SearchCases,
  'linear-boxes': LinearBoxes,
  'same-shape': SameShape,
  'nested-grid': NestedGrid,
  'dominant-term': DominantTerm,
  'constant-jump': ConstantJump,
  'two-inputs': TwoInputs,
  'memory-boxes': MemoryBoxes,
  'halving-count': HalvingCount,
  ...traceComponents,
}

// Maps each animation name (used in a lesson's ```viz block) to its component.
// The list of names lives in ./names.js so the content validator can use it.
import { createElement } from 'react'
// Registers the captions, so every animation below can use t('viz.…').
import './captions'
import ArrayMethodCost from './ArrayMethodCost'
import ArrayReindex from './ArrayReindex'
import ArraySplice from './ArraySplice'
import ArrayVsObject from './ArrayVsObject'
import BigOGrowthChart from './BigOGrowthChart'
import BinarySearchHalving from './BinarySearchHalving'
import CharCodeRanges from './CharCodeRanges'
import CodeTrace from './CodeTrace'
import ConstantJump from './ConstantJump'
import CookieCutter from './CookieCutter'
import DominantTerm from './DominantTerm'
import ExampleLadder from './ExampleLadder'
import FiveSteps from './FiveSteps'
import HalvingCount from './HalvingCount'
import LinearBoxes from './LinearBoxes'
import ListClassPreview from './ListClassPreview'
import MemoryBoxes from './MemoryBoxes'
import NestedGrid from './NestedGrid'
import ObjectLookup from './ObjectLookup'
import ObjectToArray from './ObjectToArray'
import PointerArrows from './PointerArrows'
import SameShape from './SameShape'
import SearchCases from './SearchCases'
import SolutionLayers from './SolutionLayers'
import StepsToCode from './StepsToCode'
import StopwatchRace from './StopwatchRace'
import TimingChart from './TimingChart'
import TwoInputs from './TwoInputs'
import { traces } from './traces'

// An animation drawn by a component with some props, e.g. one scene of
// ObjectLookup.
const withProps = (component, props) => () => createElement(component, props)

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
  'timing-chart': TimingChart,
  'array-splice': ArraySplice,
  'array-vs-object': ArrayVsObject,
  'object-access': withProps(ObjectLookup, { scene: 'access' }),
  'object-insert-remove': withProps(ObjectLookup, { scene: 'write' }),
  'object-has-key': withProps(ObjectLookup, { scene: 'hasKey' }),
  'object-to-array': ObjectToArray,
  'array-copy-methods': withProps(ArrayMethodCost, { scene: 'copies' }),
  'array-loop-methods': withProps(ArrayMethodCost, { scene: 'loops' }),
  'sort-growth-chart': withProps(BigOGrowthChart, {
    curveKeys: ['linear', 'nLogN', 'quadratic'],
    titleKey: 'sortTitle',
    summaryKey: 'sortSummary',
  }),
  'five-steps': FiveSteps,
  'five-steps-understand': withProps(FiveSteps, { focus: 'understand' }),
  'five-steps-examples': withProps(FiveSteps, { focus: 'examples' }),
  'five-steps-break-down': withProps(FiveSteps, { focus: 'breakDown' }),
  'five-steps-solve': withProps(FiveSteps, { focus: 'solve' }),
  'five-steps-look-back': withProps(FiveSteps, { focus: 'lookBack' }),
  'example-ladder': ExampleLadder,
  'steps-to-code': StepsToCode,
  'solution-layers': SolutionLayers,
  'char-code-ranges': CharCodeRanges,
  'cookie-cutter': withProps(CookieCutter, { scene: 'instances' }),
  'cookie-new': withProps(CookieCutter, { scene: 'new' }),
  'cookie-methods': withProps(CookieCutter, { scene: 'methods' }),
  'list-class-preview': ListClassPreview,
  'value-copy': withProps(PointerArrows, { scene: 'valueCopy' }),
  'reference-copy': withProps(PointerArrows, { scene: 'referenceCopy' }),
  'pointer-move': withProps(PointerArrows, { scene: 'pointerMove' }),
  ...traceComponents,
}

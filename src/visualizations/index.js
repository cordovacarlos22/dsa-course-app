// Maps each animation name (used in a lesson's ```viz block) to its component.
// The list of names lives in ./names.js so the content validator can use it.
import { createElement } from 'react'
// Registers the captions, so every animation below can use t('viz.…').
import './captions'
import ArrayMethodCost from './ArrayMethodCost'
import ArrayReindex from './ArrayReindex'
import ArraySplice from './ArraySplice'
import ArrayVsLinkedList from './ArrayVsLinkedList'
import ArrayVsObject from './ArrayVsObject'
import BigOGrowthChart from './BigOGrowthChart'
import BinarySearchHalving from './BinarySearchHalving'
import CharCodeRanges from './CharCodeRanges'
import CodeTrace from './CodeTrace'
import ConstantJump from './ConstantJump'
import InvitationTemplate from './InvitationTemplate'
import DominantTerm from './DominantTerm'
import ExampleLadder from './ExampleLadder'
import FiveSteps from './FiveSteps'
import HalvingCount from './HalvingCount'
import LinearBoxes from './LinearBoxes'
import LinkedListBigO from './LinkedListBigO'
import LinkedListNested from './LinkedListNested'
import LinkedListScenes from './LinkedListScenes'
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
  'invitation-template': withProps(InvitationTemplate, { scene: 'instances' }),
  'invitation-new': withProps(InvitationTemplate, { scene: 'new' }),
  'invitation-methods': withProps(InvitationTemplate, { scene: 'methods' }),
  'list-class-preview': ListClassPreview,
  'value-copy': withProps(PointerArrows, { scene: 'valueCopy' }),
  'reference-copy': withProps(PointerArrows, { scene: 'referenceCopy' }),
  'pointer-move': withProps(PointerArrows, { scene: 'pointerMove' }),
  'array-vs-linked-list': ArrayVsLinkedList,
  'linked-list-anatomy': withProps(LinkedListScenes, { scene: 'anatomy' }),
  'linked-list-cost-end': withProps(LinkedListScenes, { scene: 'costEnd' }),
  'linked-list-cost-front': withProps(LinkedListScenes, { scene: 'costFront' }),
  'linked-list-cost-middle': withProps(LinkedListScenes, {
    scene: 'costMiddle',
  }),
  'linked-list-cost-lookup': withProps(LinkedListScenes, {
    scene: 'costLookup',
  }),
  'linked-list-big-o': LinkedListBigO,
  'linked-list-node': withProps(LinkedListNested, { scene: 'node' }),
  'linked-list-nested': withProps(LinkedListNested, { scene: 'nested' }),
  'linked-list-node-class': withProps(LinkedListScenes, { scene: 'nodeClass' }),
  'linked-list-constructor-examples': withProps(LinkedListScenes, {
    scene: 'constructorExamples',
  }),
  'linked-list-constructor-plan': withProps(LinkedListScenes, {
    scene: 'constructorPlan',
  }),
  'linked-list-push': withProps(LinkedListScenes, { scene: 'push' }),
  'linked-list-push-examples': withProps(LinkedListScenes, {
    scene: 'pushExamples',
  }),
  'linked-list-push-plan': withProps(LinkedListScenes, { scene: 'pushPlan' }),
  'linked-list-pop': withProps(LinkedListScenes, { scene: 'pop' }),
  'linked-list-pop-examples': withProps(LinkedListScenes, {
    scene: 'popExamples',
  }),
  'linked-list-pop-plan': withProps(LinkedListScenes, { scene: 'popPlan' }),
  'linked-list-unshift': withProps(LinkedListScenes, { scene: 'unshift' }),
  'linked-list-unshift-examples': withProps(LinkedListScenes, {
    scene: 'unshiftExamples',
  }),
  'linked-list-unshift-plan': withProps(LinkedListScenes, {
    scene: 'unshiftPlan',
  }),
  'linked-list-shift': withProps(LinkedListScenes, { scene: 'shift' }),
  'linked-list-shift-examples': withProps(LinkedListScenes, {
    scene: 'shiftExamples',
  }),
  'linked-list-shift-plan': withProps(LinkedListScenes, { scene: 'shiftPlan' }),
  'linked-list-get': withProps(LinkedListScenes, { scene: 'get' }),
  'linked-list-get-examples': withProps(LinkedListScenes, {
    scene: 'getExamples',
  }),
  'linked-list-get-plan': withProps(LinkedListScenes, { scene: 'getPlan' }),
  'linked-list-set': withProps(LinkedListScenes, { scene: 'set' }),
  'linked-list-set-examples': withProps(LinkedListScenes, {
    scene: 'setExamples',
  }),
  'linked-list-set-plan': withProps(LinkedListScenes, { scene: 'setPlan' }),
  'linked-list-insert': withProps(LinkedListScenes, { scene: 'insert' }),
  'linked-list-insert-examples': withProps(LinkedListScenes, {
    scene: 'insertExamples',
  }),
  'linked-list-insert-plan': withProps(LinkedListScenes, {
    scene: 'insertPlan',
  }),
  'linked-list-remove': withProps(LinkedListScenes, { scene: 'remove' }),
  'linked-list-remove-examples': withProps(LinkedListScenes, {
    scene: 'removeExamples',
  }),
  'linked-list-remove-plan': withProps(LinkedListScenes, {
    scene: 'removePlan',
  }),
  'linked-list-reverse': withProps(LinkedListScenes, { scene: 'reverse' }),
  'linked-list-reverse-examples': withProps(LinkedListScenes, {
    scene: 'reverseExamples',
  }),
  'linked-list-reverse-plan': withProps(LinkedListScenes, {
    scene: 'reversePlan',
  }),
  ...traceComponents,
}

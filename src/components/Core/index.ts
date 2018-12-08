import xs, { Stream } from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks, Reducer, ComponentLens } from "typometer/types"
import Model from "typometer/models/Model"
import Content from "typometer/components/Content"
import Replay from "typometer/components/Replay"
import Metrics from "typometer/components/Metrics"
import model from "./model"
import view from "./view"
import nap from "./nap"

// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
export default function Core(sources: Sources): Sinks {
  const state$ = sources.state.stream
  const parentReducer$ = model()
  const napReducer$ = nap(state$)


  /**
   * Internal event streams
   * 
   * TODO: should be handled in ./nap.ts instead
   */

  // Triggers "true" when the user is done typing the whole text \o/
  const textStatusOK$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.isSuccess()
    })
    .startWith(false)

  // Triggers "true" when the user made a(t least one) mistake while typing the text.
  const textStatusKO$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.hasError()
    })
    .startWith(false)

  // Triggers "true" when the user starts typing the text.
  const textStatusEditing$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.textBeingEdited()
    })
    .startWith(false)


  /**
   * Lenses
   * 
   * TODO: just sharing the whole state with child components for the time
   * being, must check what's really required and scope accordingly; may
   * not be possible though because of Model(state) calls ("state decorator").
   * Would require changing the architecture to handle a stream of 
   * DecoratedAppState objects, starting with ./model.ts here.
   *
   * Using SAM, that would be the output of the State function, aka. a state
   * representation => currently known as SuperState actually.
   */

  // Content
  const ContentLens: ComponentLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const contentSinks = isolate(Content, {state: ContentLens})(sources)

  // Replay
  const ReplayLens: ComponentLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const replaySinks = isolate(Replay, {state: ReplayLens})(sources)

  // Metrics
  const MetricsLens: ComponentLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const metricsSinks = isolate(Metrics, {state: MetricsLens})(sources)


  /**
   * Sink: state reducer
   */

  const componentsReducer$ = xs.merge(
    contentSinks.state,
    replaySinks.state,
    metricsSinks.state
  )

  const reducer$ = xs.merge(
    parentReducer$,
    napReducer$,
    componentsReducer$
  ) as Stream<Reducer>

  /**
   * Sink: virtual DOM
   */

  const contentVDom$ = contentSinks.dom;
  const replayVDom$ = replaySinks.dom;
  const metricsVDom$ = metricsSinks.dom;
  const vdom$ = view({
    textStatusEditing$,
    textStatusKO$,
    textStatusOK$,
    contentVDom$,
    replayVDom$,
    metricsVDom$
  })

  return {
    dom: vdom$,
    state: reducer$
  }
}

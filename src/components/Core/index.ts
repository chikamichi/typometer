import xs, { Stream } from "xstream"
import { VNode } from "@cycle/dom"
import isolate from "@cycle/isolate"

import { Sources, Sinks, Reducer } from "typometer/types"
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

  const textStatusOK$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.isSuccess()
    })
    .startWith(false)

  const textStatusKO$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.hasError()
    })
    .startWith(false)

  const textStatusEditing$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.textBeingEdited()
    })
    .startWith(false)

  // Content
  const ContentLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const contentSinks = isolate(Content, {state: ContentLens})(sources)

  // Replay
  // TODO: "replay" is actually not a good naming, for it's not a, well, replay
  // but merely an tick-based IA.
  const ReplayLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const replaySinks = isolate(Replay, {state: ReplayLens})(sources)

  // Metrics
  const MetricsLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const metricsSinks = isolate(Metrics, {state: MetricsLens})(sources)

  const componentsReducer$ = xs.merge(
    contentSinks.state,
    replaySinks.state,
    metricsSinks.state

  )

  const reducer$ = xs.merge(
    parentReducer$,
    napReducer$,
    componentsReducer$
  )

  const vdom$ = view(
    textStatusEditing$,
    textStatusKO$,
    textStatusOK$,
    contentSinks.dom,
    replaySinks.dom,
    metricsSinks.dom
  )

  return {
    dom: <Stream<VNode>>vdom$,
    state: <Stream<Reducer>>reducer$
  }
}

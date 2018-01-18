import xs from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks } from "typometer/types"
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
  const state$ = sources.onion.state$
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
  const contentSinks = isolate(Content, {onion: ContentLens})(sources)

  // Replay
  // TODO: "replay" is actually not a good naming, for it's not a, well, replay
  // but merely an tick-based IA.
  const ReplayLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const replaySinks = isolate(Replay, {onion: ReplayLens})(sources)

  // Metrics
  const MetricsLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const metricsSinks = isolate(Metrics, {onion: MetricsLens})(sources)

  const componentsReducer$ = xs.merge(
    contentSinks.onion,
    replaySinks.onion,
    metricsSinks.onion

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
    contentSinks.DOM,
    replaySinks.DOM,
    metricsSinks.DOM
  )

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

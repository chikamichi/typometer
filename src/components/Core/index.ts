import xs from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks } from "types"
import Content from "components/Content"
import Replay from "components/Replay"
import Metrics from "components/Metrics"
import model from "./model"
import view from "./view"
import nap from "./nap"

// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
export default function Core(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  const parentReducer$ = model()
  const napReducer$ = nap(state$)

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
    contentSinks.DOM,
    replaySinks.DOM,
    metricsSinks.DOM
  )

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

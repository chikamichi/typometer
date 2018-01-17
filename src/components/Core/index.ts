import xs from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks } from "types"
import Content from "components/Content"
import Metrics from "components/Metrics"
// import ReplayTyping from "components/replay_typing"
import model from "./model"
import view from "./view"
import nap from "./nap"

// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
export default function Core(sources: Sources): Sinks {
  // let app_state$ = xs.create()
  // let custom_text_bus$ = xs.create()
  // const action$ = intent({...sources, ...{CUSTOM_TEXT: custom_text_bus$}})
  // const mutation_proposal$ = xs.merge(sources.NAP, action$)

  // app_state$.imitate(model(mutation_proposal$))

  // Components should return sinks with onion, so that I can merge sinks.onion below.
  // const custom_text$ = isolate(CustomText)({app_state$: app_state$, DOM: sources.DOM})
  // custom_text_bus$.imitate(custom_text$.BUS)
  // const replay$ = isolate(ReplayTyping)({app_state$: app_state$, DOM: sources.DOM})
  // const live_text$ = isolate(LiveText)({app_state$: app_state$, replay$: replay$})

  // const vtree$ = view({
  //   state$: state$,
    // custom_text$: custom_text$.DOM,
    // live_text$: live_text$.DOM,
    // replay$: replay$.DOM
  // })

  // const nap$ = nap(app_state$)

  const state$ = sources.onion.state$
  const parentReducer$ = model()
  const napReducer$ = nap(state$)

  // Content
  const ContentLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const contentSinks = isolate(Content, {onion: ContentLens})(sources)

  // Metrics
  const MetricsLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const metricsSinks = isolate(Metrics, {onion: MetricsLens})(sources)

  const componentsReducer$ = xs.merge(
    contentSinks.onion,
    metricsSinks.onion
  )

  const reducer$ = xs.merge(
    parentReducer$,
    napReducer$,
    componentsReducer$
  )

  const vdom$ = view(
    contentSinks.DOM,
    metricsSinks.DOM
  )

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

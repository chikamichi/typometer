import xs, { Stream } from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks, Reducer, ComponentLens } from "typometer/types"
import State from 'typometer/models/State'
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
  const actions = nap(state$) // no actions derived from external intents atm
  const ownReducer$ = model(actions)


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
   * representation => currently known as State actually.
   */

  // Content
  // const ContentLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const contentSinks = isolate(Content, {state: ContentLens})(sources)

  // // Replay
  // const ReplayLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const replaySinks = isolate(Replay, {state: ReplayLens})({ state$, dom: sources.dom })

  // // Metrics
  // const MetricsLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const metricsSinks = isolate(Metrics, {state: MetricsLens})(state$)

  // TODO: check isolate again, is it required?
  const contentSinks = Content({ state$, dom: sources.dom })
  const replaySinks = Replay({ state$, dom: sources.dom })
  const metricsSinks = Metrics({ state$ })


  /**
   * Sink: state reducer
   */

  const componentsReducer$ = xs.merge(
    contentSinks.state,
    replaySinks.state,
    metricsSinks.state
  )

  const reducer$ = xs.merge(
    ownReducer$,
    componentsReducer$
  )


  /**
   * Sink: virtual DOM
   */

  const contentVDom$ = contentSinks.dom;
  const replayVDom$ = replaySinks.dom;
  const metricsVDom$ = metricsSinks.dom;
  const vdom$ = view({
    state$,
    contentVDom$,
    replayVDom$,
    metricsVDom$
  })


  return {
    dom: vdom$,
    state: reducer$
  }
}

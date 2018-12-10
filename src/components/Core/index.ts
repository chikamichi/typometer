import xs from "xstream"

import { Sources, Sinks } from "typometer/types"
import isolateComponent from 'typometer/utils/isolateComponent'
import Content from "typometer/components/Content"
import Rythm from "typometer/components/Rythm"
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
   * Children components
   */

  const contentSinks = isolateComponent(Content, sources)
  const rythmSinks = isolateComponent(Rythm, sources)
  const metricsSinks = isolateComponent(Metrics, sources)


  /**
   * Sink: state reducer
   */

  const componentsReducer$ = xs.merge(
    contentSinks.state,
    rythmSinks.state,
    metricsSinks.state
  )

  const reducer$ = xs.merge(
    ownReducer$,
    componentsReducer$
  )


  /**
   * Sink: virtual DOM
   */

  const contentVDom$ = contentSinks.dom
  const rythmVDom$ = rythmSinks.dom
  const metricsVDom$ = metricsSinks.dom
  const vdom$ = view({
    state$,
    contentVDom$,
    rythmVDom$,
    metricsVDom$
  })


  return {
    dom: vdom$,
    state: reducer$
  }
}

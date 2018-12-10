import xs, { Stream } from "xstream"
import pluck from 'ramda/src/pluck'

import { Sources, Sinks, Reducer } from "typometer/types"
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

  const components = {
    contentSinks: isolateComponent(Content, sources),
    rythmSinks: isolateComponent(Rythm, sources),
    metricsSinks: isolateComponent(Metrics, sources)
  }


  /**
   * Sink: state reducer
   */

  const componentsState = pluck('state')(Object.values(components))
  const componentsReducer$ = xs.merge(...componentsState) as Stream<Reducer>
  const reducer$ = xs.merge(
    ownReducer$,
    componentsReducer$
  )


  /**
   * Sink: virtual DOM
   */

  const contentVDom$ = components.contentSinks.dom
  const rythmVDom$ = components.rythmSinks.dom
  const metricsVDom$ = components.metricsSinks.dom
  const vdom$ = view({
    state$,
    contentVDom$,
    rythmVDom$,
    metricsVDom$
  })


  /**
   * Core's sinks
   */

  return {
    dom: vdom$,
    state: reducer$
  }
}

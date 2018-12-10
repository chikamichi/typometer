import xs from "xstream"

import { Sources, Sinks } from "typometer/types"
import { addComponents } from 'typometer/utils'
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

  const components = addComponents(Content, Rythm, Metrics)(sources)

  const reducer$ = xs.merge(
    ownReducer$,
    components.reducers$
  )

  const vdom$ = view({ state$, ...components.dom$ })

  return {
    dom: vdom$,
    state: reducer$
  }
}

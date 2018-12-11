import xs from "xstream"

import { Component } from "typometer/types"
import { addComponents } from 'typometer/utils'
import Content from "typometer/components/Content"
import Rythm from "typometer/components/Rythm"
import Metrics from "typometer/components/Metrics"
import intent from './intent'
import model from "./model"
import view from "./view"


const Core: Component = (sources) => {
  const state$ = sources.state.stream
  const actions = intent(sources.dom)
  const ownReducer$ = model(actions, state$)

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

Core.cname = 'Core'

export default Core

import xs, { Stream } from "xstream"

import { Component, Reducer } from "typometer/types"
import intent from './intent'
import model from './model'
import view from "./view"


const Metrics: Component = (sources) => {
  const actions = intent(sources.dom)
  const reducer$ = model(actions)
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: reducer$
  }
}

Metrics.cname = 'Metrics'

export default Metrics
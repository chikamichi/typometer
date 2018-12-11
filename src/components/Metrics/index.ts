import xs, { Stream } from "xstream"

import { Component, Reducer } from "typometer/types"
import view from "./view"


const Metrics: Component = (sources) => {
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: xs.create() as Stream<Reducer>
  }
}

Metrics.cname = 'Metrics'

export default Metrics
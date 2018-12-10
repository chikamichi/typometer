import xs, { Stream } from "xstream"

import { Sources, Sinks, Reducer } from "typometer/types"
import view from "./view"


export default function Metrics(sources: Sources): Sinks {
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: xs.create() as Stream<Reducer>
  }
}

import xs from "xstream"

import { Sources, Sinks } from "typometer/types"
import view from "./view"


export default function Metrics(sources: Sources): Sinks {
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: xs.create()
  }
}

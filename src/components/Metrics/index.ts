import xs, { Stream, MemoryStream } from "xstream"

import { ComponentSources, Sinks, Reducer } from "typometer/types"
import view from "./view"


export default function Metrics(sources: ComponentSources): Sinks {
  const vdom$ = view(sources.state$)

  return {
    dom: vdom$,
    state: xs.create() as Stream<Reducer>
  }
}

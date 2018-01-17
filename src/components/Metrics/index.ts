import xs from "xstream"
import Model from "model"

import { Sources, Sinks } from "types"
import view from "./view"


export default function Metrics(sources: Sources): Sinks {
  const vdom$ = view(sources.onion.state$)

  return {
    DOM: vdom$,
    onion: xs.create()
  }
}

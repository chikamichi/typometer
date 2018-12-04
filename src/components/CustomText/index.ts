import { Stream } from "xstream"

import { Sources, Sinks, Reducer } from "typometer/types"
import intent from "./intent"
import model from "./model"
import view from "./view"


export default function CustomText(sources: Sources): Sinks {
  const actions = intent(sources.dom)
  const reducer$ = model(actions)
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: <Stream<Reducer>>reducer$
  }
}

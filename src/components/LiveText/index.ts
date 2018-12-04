import { Sources, Sinks } from "typometer/types"
import intent from "./intent"
import model from "./model"
import view from "./view"


export default function LiveText(sources: Sources): Sinks {
  const actions = intent(sources)
  const reducer$ = model(actions)

  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: reducer$
  }
}

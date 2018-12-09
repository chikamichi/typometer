import { ComponentSources, Sinks } from "typometer/types"
import intent from "./intent"
import model from "./model"
import view from "./view"


export default function Editor(sources: ComponentSources): Sinks {
  const actions = intent(sources.dom!)
  const reducer$ = model(actions)
  const vdom$ = view(sources.state$)

  return {
    dom: vdom$,
    state: reducer$
  }
}

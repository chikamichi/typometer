import Model from "model"
import TargetText from "models/target_text"

import { Sources, Sinks } from "types"
import intent from "./intent"
import model from "./model"
import view from "./view"


export default function CustomText(sources: Sources): Sinks {
  const actions = intent(sources.DOM)
  const reducer$ = model(actions)
  const vdom$ = view(sources.onion.state$)

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

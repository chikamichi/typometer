import { Stream } from "xstream"

import { Reducer } from "typometer/types"
import TypingAction from "typometer/actions/Typing"


export interface LiveTextActions {
  newChar$: Stream<string>
}

export default function model(actions: LiveTextActions): Stream<Reducer> {
  return actions.newChar$.map(TypingAction)
}

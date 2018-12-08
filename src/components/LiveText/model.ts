import { Stream } from "xstream"

import { Reducer } from "typometer/types"
import TypingAction from "typometer/actions/Typing"
import { LiveTextActions } from "./intent"


export default function model(actions: LiveTextActions): Stream<Reducer> {
  return actions.newChar$.map(TypingAction)
}

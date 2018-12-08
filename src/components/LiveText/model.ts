import { Stream } from "xstream"

import { Reducer, AppState } from "typometer/types"
import TypingAction from "typometer/actions/TypingAction"
import { LiveTextActions } from "./intent"


export default function model(actions: LiveTextActions): Stream<Reducer> {
  return actions.newChar$
    .map(newChar => {
      return function newCharReducer(prevState: AppState) {
        return prevState.text.editing ? prevState : TypingAction(newChar, prevState)
      }
    })
}

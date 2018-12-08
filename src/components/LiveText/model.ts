import { Stream } from "xstream"

import { Reducer } from "typometer/types"
import { isAppState } from "typometer/utils/guards"
import TypingAction from "typometer/actions/TypingAction"
import { LiveTextActions } from "./intent"


export default function model(actions: LiveTextActions): Stream<Reducer> {
  return actions.newChar$
    .map(newChar => {
      return function newCharReducer(prevState) {
        if (!isAppState(prevState)) return prevState
        return prevState.text.editing ? prevState : TypingAction(newChar, prevState)
      } as Reducer
    })
}

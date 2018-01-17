import { Stream } from "xstream"

import { Reducer } from "types"
import TypingAction from "actions/TypingAction"


export default function model(actions): Stream<Reducer> {
  return actions.newChar$
    .map(newChar => {
      return function newCharReducer(prevState) {
        return TypingAction(newChar, prevState)
      }
    })
}

import { Stream } from "xstream"

import { Model } from "typometer/types"
import TypingAction from "typometer/actions/Typing"


export interface LiveTextActions {
  newChar$: Stream<string>
}

const model: Model = (actions: LiveTextActions) => {
  return actions.newChar$.map(TypingAction)
}

export default model

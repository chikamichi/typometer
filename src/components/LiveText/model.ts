import { Stream } from "xstream"

import { Model } from "typometer/types"
import * as Actions from 'typometer/actions/Commands'


export interface LiveTextActions {
  newChar$: Stream<string>
}

const model: Model = (actions: LiveTextActions) => {
  return actions.newChar$.map(Actions.TextInput)
}

export default model

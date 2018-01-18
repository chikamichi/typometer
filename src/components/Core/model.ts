import xs from "xstream"

import { AppState } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"

// Model: map actions to state reducers.
export default function model() {
  return xs.of(function initialReducer(prevState: AppState) {
    if (prevState)
      return prevState
    else
      return INITIAL_APP_STATE
  })
}

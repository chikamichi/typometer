import { Action } from 'typometer/types'
import Success from "typometer/reducers/Core/Success"


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action: Action = (_: any) => {
  return function (state) {
    if (!state) return
    return Success(state)
  }
}

export default action

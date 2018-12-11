import { Action } from 'typometer/types'
import Reset from "typometer/reducers/Core/Reset"


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action: Action = () => {
  return function (state) {
    if (!state) return
    return Reset(state)
  }
}

export default action

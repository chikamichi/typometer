import { Action } from 'typometer/types'
import State from 'typometer/models/State'
import Reset from "typometer/reducers/Core/Reset"


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action = (_: any) => {
  return function (prevState: State) {
    return Reset(prevState)
  }
}

export default action as Action

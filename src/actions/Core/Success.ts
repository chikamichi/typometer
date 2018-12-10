import { Action } from 'typometer/types'
import State from 'typometer/models/State'
import Success from "typometer/reducers/Core/Success"


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action = (_: any) => {
  return function (prevState: State) {
    return Success(prevState)
  }
}

export default action as Action

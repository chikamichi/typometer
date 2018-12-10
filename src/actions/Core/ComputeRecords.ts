import { Action, TypingRecords } from 'typometer/types'
import State from 'typometer/models/State'
import ComputeRecords from 'typometer/reducers/Core/ComputeRecords'


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action = (latestRecords: TypingRecords) => {
  return function (prevState: State) {
    return ComputeRecords(prevState, latestRecords)
  }
}

export default action as Action

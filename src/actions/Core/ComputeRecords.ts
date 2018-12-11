import { Action, TypingRecords } from 'typometer/types'
import ComputeRecords from 'typometer/reducers/Core/ComputeRecords'


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action: Action = (latestRecords: TypingRecords) => {
  return function (state) {
    if (!state) return
    // NOTE: filtering could be handled here, which would turn nap() into
    // an empty nutshell basically. Is NAP worth it as a physical layer, or
    // could actions be enough?
    // @see components/Core/nap.ts
    return ComputeRecords(state, latestRecords)
  }
}

export default action

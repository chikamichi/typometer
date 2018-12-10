import State from 'typometer/models/State'
import { Reducer, TypingRecords } from 'typometer/types'


/**
 * Run is over and records must be computed.
 * 
 * Mutations:
 * - records: default values -> computed values
 */
function ComputeRecords(prevState: State, records: TypingRecords): State {
  return State.from({
    ...prevState.data,
    records
  })
}

export default ComputeRecords as Reducer

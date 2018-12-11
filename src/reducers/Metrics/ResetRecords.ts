import { Reducer } from 'typometer/types'
import State from 'typometer/models/State'
import { INITIAL_APP_STATE } from 'typometer/utils'


const ResetRecords: Reducer = (state) => {
  return State.from({
    ...state!.data,
    records: INITIAL_APP_STATE.records
  })
}

export default ResetRecords

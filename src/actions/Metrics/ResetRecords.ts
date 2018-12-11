import { Action } from "typometer/types"
import ResetRecords from "typometer/reducers/Metrics/ResetRecords"


const action: Action = () => {
  return function(state) {
    if (!state) return
    return ResetRecords(state)
  }
}

export default action

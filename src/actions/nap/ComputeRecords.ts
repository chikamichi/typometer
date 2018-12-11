import State from 'typometer/models/State'

import ComputeRecords from 'typometer/reducers/Core/ComputeRecords'


const nap = (state: State) => {
  return ComputeRecords(state)
}

nap.triggers = (state: State) => {
  return state.isDoneDone() && state.hasNoStats()
}

export default nap

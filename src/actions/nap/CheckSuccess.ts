import State from 'typometer/models/State'

import Success from "typometer/reducers/Core/Success"


const nap = (state: State) => {
  return Success(state)
}

nap.triggers = (state: State) => {
  return state.isDone() && state.hasNoStats()
}

export default nap

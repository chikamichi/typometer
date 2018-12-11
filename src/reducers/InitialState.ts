import { Reducer } from 'typometer/types'
import State from 'typometer/models/State'
import { INITIAL_APP_STATE } from 'typometer/utils'


const InitialState: Reducer = () => {
  return State.from(INITIAL_APP_STATE)
}

export default InitialState

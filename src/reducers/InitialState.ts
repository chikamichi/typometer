import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'
import { INITIAL_APP_STATE } from 'typometer/utils'

// No need to explicitly receive "prevState: State" parameter in this case.
export default (function InitialState(): State {
  return State.from(INITIAL_APP_STATE)
}) as Reducer

import { Action } from 'typometer/types'
import State from 'typometer/models/State'
import Tick from 'typometer/reducers/Rythm/Tick'


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action = (tick: number) => {
  return function (prevState: State) {
    return Tick(prevState, tick)
  }
}

export default action as Action

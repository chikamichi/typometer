import { Action } from 'typometer/types'
import Tick from 'typometer/reducers/Rythm/Tick'


/**
 * Triggered when the user is done typing the whole text successfully.
 */
const action: Action = (tick: number) => {
  return function (state) {
    if (!state) return
    return Tick(state, tick)
  }
}

export default action

import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'


/**
 * User is done typing the whole text :tada:
 * 
 * Mutations:
 * - metrics.stop: undefined -> some timestamp
 */
function Success(prevState: State): State {
  const metrics = {...prevState.data.metrics, stop: new Date()}
  return State.from({...prevState.data, metrics})
}

export default Success as Reducer

import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'


/**
 * User is done typing the whole text :tada:
 * 
 * Mutations:
 * - metrics.stop: undefined -> some timestamp
 */
const Success: Reducer = (state) => {
  const metrics = {...state!.data.metrics, stop: new Date()}
  return State.from({...state!.data, metrics})
}

export default Success

import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'


/**
 * Run is over and records must be computed.
 * 
 * Mutations:
 * - records: default values -> computed values
 */
const Tick: Reducer = (state, tick: number) => {
  const metrics = {...state!.data.metrics, ticks: tick}
  return State.from({...state!.data, metrics})
}

export default Tick

import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'


/**
 * Run is over and records must be computed.
 * 
 * Mutations:
 * - records: default values -> computed values
 */
function Tick(prevState: State, tick: number): State {
  const metrics = {...prevState.data.metrics, ticks: tick}
  return State.from({...prevState.data, metrics})
}

export default Tick as Reducer

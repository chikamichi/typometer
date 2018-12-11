import State from 'typometer/models/State'
import { Reducer } from 'typometer/types'
import { INITIAL_APP_STATE } from 'typometer/utils'


/**
 * User wishes to reset the game.
 * 
 * Mutations:
 * - everything gets reseted, but the text and records.
 */
const Success: Reducer = (state) => {
  return State.from({
    ...INITIAL_APP_STATE,
    ...{
      text: {
        ...INITIAL_APP_STATE.text,
        raw: state!.data.text.raw
      },
      records: {
        ...state!.data.records,
        pending: true
      }
    }
  })
}

export default Success

import { reduceWhile } from 'ramda'

import { Action } from 'typometer/types'
import * as actions from '../nap'


/**
 * Runs all registered next-action-predicate actions.
 */
const nap: Action = () => {
  return function (state) {
    if (!state) return

    let newState = state

    reduceWhile(
      (triggered, _) => !triggered,
      (triggered, actionName) => {
        const action = actions[actionName]
        if (action.triggers(state)) {
          newState = action(state)
          triggered = true
        }
        return triggered
      },
      false,
      Object.keys(actions)
    )

    return newState
  }
}

export default nap

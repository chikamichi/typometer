import xs, { Stream } from "xstream"
import delay from "xstream/extra/delay"

import { AppState, Reducer } from "types"
import Model from "model"
import Metrics from "models/Metrics"


// Next-action-predicate aka. internal side-effect handler.
//
// Computes any required side-effect and pushes it down the pipe as a reducer.
//
// A side-effect could be:
// - a mutation proposal
// - an emulated user-action (resulting in a mutation proposal)
//
// As next-action-predicates listen for state$, they have the potential for
// unleashing infinite loop doom: proceed with caution, use restrictive safe
// guards in the form of .filter() statements.
export default function nap(state$): Stream<Reducer> {
  // NOTE: return xs.merge(…) if multiple reducers.
  return state$
    // NOTE: we're interested in inspecting state$ upon a specific event from
    // state$ being emitted, which leaves the possibility state$ itself will
    // have evolved between the moment the triggering event is filtered against
    // below and the moment state$ is processed within Metrics.Records().
    // It shouldn't be a problem really for we're computing records, but let's
    // be aware of that potential pitfall and the likely need for a better
    // strategy/fix here.
    .filter(state => {
      const model = Model(state)
      return model.isSuccess() && model.hasNoStats()
    })
    .compose(delay(0)) // Fancy seeing you here, setTimeout(0).
    .map(_ => Metrics.Records(state$))
    .map(records => {
      return (prevState: AppState) => {
        return {
          ...prevState,
          records
        }
      }
    })
}

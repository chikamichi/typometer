import { Stream } from "xstream"
import delay from "xstream/extra/delay"

import Metrics from "typometer/models/Metrics"
import { TypingRecords } from "typometer/types"
import State from "typometer/models/State"


export interface CoreActions {
  // textStatusEditing$: Stream<boolean>
  // textStatusKO$: Stream<boolean>
  // textStatusOK$: Stream<boolean>,
  // computeRecords$: Stream<TypingRecords>
}

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
export default function nap(state$: Stream<State>): CoreActions {
  // Triggers "true" when the user is done typing the whole text \o/
  return {
    // textStatusOK$: state$
    //   .filter(state => {
    //     const model = Model(state)
    //     return !!model.isSuccess()
    //   })
    //   .map(_=> true),
      
    // // Triggers "true" when the user made a(t least one) mistake while typing the text.
    // textStatusKO$: state$
    //   .filter(state => {
    //     const model = Model(state)
    //     return !!model.hasError()
    //   })
    //   .map(_=> true),

    // // Triggers "true" when the user starts typing the text.
    // textStatusEditing$: state$
    //   .filter(state => {
    //     const model = Model(state)
    //     return !!model.textBeingEdited()
    //   })
    //   .map(_=> true),

    // // Triggers "true" when metrics must be computed.
    // // NOTE: we're interested in inspecting state$ upon a specific event from
    // // state$ being emitted, which leaves the possibility state$ itself will
    // // have evolved between the moment the triggering event is filtered against
    // // below and the moment state$ is processed within Metrics.Records().
    // // It shouldn't be a problem really for we're computing records, but let's
    // // be aware of that potential pitfall and the likely need for a better
    // // strategy/fix here.
    // computeRecords$: state$
    //   .filter(state => {
    //     const model = Model(state)
    //     const res = model.isDoneDone() && model.hasNoStats()
    //     console.log('ACTION computeRecords$', model, res)
    //     return res
    //   })
    //   .map(_ => {
    //     console.log('computing records')
    //     // TODO: not the best design sending the whole track of AppState objects.
    //     // Best would be to accumulate and compare only current run with current record.
    //     return Metrics.Records(state$)
    //   })
    //   // .compose(delay(0)) // Fancy seeing you here, setTimeout(0).
    //   // .take(1)
  }
}

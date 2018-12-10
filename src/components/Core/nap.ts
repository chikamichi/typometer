import { Stream, MemoryStream } from "xstream"

import Metrics from "typometer/models/Metrics"
import { TypingRecords } from "typometer/types"
import State from "typometer/models/State"


export interface CoreActions {
  // textStatusEditing$: Stream<boolean>
  // textStatusKO$: Stream<boolean>
  success$: Stream<boolean>,
  computeRecords$: Stream<boolean>
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
export default function nap(state$: MemoryStream<State>): CoreActions {
  return {
    // Triggers "true" when the user is done typing the whole text \o/
    success$: state$
      .filter(state => state.isDone() && state.hasNoStats())
      .map(_ => true),
      
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
    computeRecords$: state$
      .filter(state => state.isDoneDone() && state.hasNoStats())
      .map(_ => true)
      // .map(_ => {
      //   // TODO: not the best design sending the whole track of AppState objects.
      //   // Best would be to accumulate and compare only current run with current record.
      //   return Metrics.Records(state$)
      // })
  }
}

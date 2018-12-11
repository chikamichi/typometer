import { NAP } from 'typometer/types'


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
const nap: NAP = state$ => {
  return {
    success$: state$
      .filter(state => state.isDone() && state.hasNoStats())
      .map(_ => true),
      
    computeRecords$: state$
      .filter(state => state.isDoneDone() && state.hasNoStats())
      .map(_ => true)
  }
}

export default nap

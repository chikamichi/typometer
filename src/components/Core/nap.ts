import xs from "xstream"

// Next-action-predicate aka. internal side-effect handler.
//
// Computes any required side-effect and pushes it down the pipe.
// A side-effect could be:
// - a mutation proposal
// - an emulated user-action (resulting in a mutation proposal)
// - an effect on some external asset with no internal consequence whatsoever
//
// The last use-case is more suited to sources-less drivers so should be avoided.
// Emulated user-action are better handled outside the intent() function due to
// stream wiring. Therefore, such actions must be pre-processed here as a
// mutation proposal and exposed as such.
// export default function nap(app_state$) {
//   // Typing is over but stats (model decoration) are still pending: trigger
//   // updates and re-rendering with a fake keypress.
//   const compute_wpm$ = app_state$
//     .filter(_ => {
//       return Model.Singleton.get().isDone()
//         && !Model.Singleton.get().attributes.stop
//     })
//     .map(app_state => (new TypingAction).process())
//
//   // Once everything is over, including stats computation/display, let's reset
//   // everything after a short delay so the user may retry.
//   const auto_reset$ = app_state$
//     .filter(_ => {
//       return Model.Singleton.get().isDone()
//         && Model.Singleton.get().attributes.stop
//     })
//     .compose(delay(2000))
//     .map(_ => Model.Singleton.clear())
//
//   // User has stopped, must reset state.
//   const manual_reset$ = app_state$
//     .filter(_ => {
//       return Model.Singleton.get().hasStopped()
//     })
//     .map(_ => Model.Singleton.clear())
//
//   return xs.merge(
//     compute_wpm$,
//     auto_reset$,
//     manual_reset$
//   ).startWith(undefined)
// }


export default function nap(state$) {
  return xs.create()
}

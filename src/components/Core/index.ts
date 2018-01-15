import xs from "xstream"
import isolate from "@cycle/isolate"
import { h, h1, h2, div, table, thead, tbody, tr, th, td } from "@cycle/dom"

import { AppState, Sources, Sinks, Reducer } from "types"
import { INITIAL_APP_STATE } from "utils"
import TargetText from "models/target_text"
// import NewTextAction from "actions/new_text"

import CustomText from "components/CustomText"
import LiveText from "components/LiveText"
// import ReplayTyping from "components/replay_typing"


// Intent: computes mutation proposals based on raw events.
function intent(sources: Sources) {
}


// Model: map actions to state reducers.
function model(actions) {
  return xs.of(function initialReducer(prevState: AppState) {
    if (prevState)
      return prevState
    else
      return INITIAL_APP_STATE
  })
}

// View: decorates app state and re-renders in place.
// TODO: add metricsVDom$
function view(liveTextVDom$, customTextVDom$) {
  return xs.combine(liveTextVDom$, customTextVDom$)
    .map(([liveText, customText]) => {
    // TODO: decorate
//   ).map(([app_state, ...remainder]) => [(new Model.Decorator(app_state)).decorate(), ...remainder])
      return div('.typing-app.ta', [
        div('.ta-side', [
          h1('.ta-title', 'typometer'),
          div('.ta-settings', [
            h2('Settings'),
            // h(replay_settings.sel, replay_settings.data, replay_settings.children),
          ])
        ]), // .ta-side

        div('.ta-main', [

          div('.ta-header', [

            table('.ta-metrics', [
              thead('.ta-metrics__types', [
                tr([
                  th('Metrics:'),
                  th('Accuracy'),
                  th('WPM')
                ])
              ]),
              // tbody('.ta-metrics__values', [
              //   tr('.ta-metrics__best', [
              //     td('.ta-metrics__best-value', 'Best:'),
              //     td('.ta-metric  .ta-metric--accuracy  .ta-metric__best-value  .ta-metric__best-value--accuracy', attributes.records.accuracy + '%'),
              //     td('.ta-metric  .ta-metric--wpm  .ta-metric__best-value  .ta-metric__best-value--wpm', attributes.records.wpm)
              //   ]),
              //   tr('.ta-metrics__current', [
              //     td('.ta-metrics__current-value', 'Current:'),
              //     td('.ta-metric  .ta-metric--accuracy  .ta-metric__current-value  .ta-metric__current-value--accuracy', attributes.accuracy + '%'),
              //     td('.ta-metric  .ta-metric--wpm  .ta-metric__current-value  .ta-metric__current-value--wpm', attributes.wpm),
              //   ])
              // ])
            ])

            // div(classnames('.ta-progress .ta-progress--done', {'.u-wip': !attributes.done}), ' Done!')

          ]), // .ta-header

          div('.ta-content', [
            liveText,
            customText
          ]), // .ta-content

        ]) // .ta-main

      ]) // .ta
    })
}


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
// function nap(app_state$) {
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


function nap(state$) {
  return xs.create()
}


// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
export default function Core(sources: Sources): Sinks {
  // let app_state$ = xs.create()
  // let custom_text_bus$ = xs.create()
  // const action$ = intent({...sources, ...{CUSTOM_TEXT: custom_text_bus$}})
  // const mutation_proposal$ = xs.merge(sources.NAP, action$)

  // app_state$.imitate(model(mutation_proposal$))

  // Components should return sinks with onion, so that I can merge sinks.onion below.
  // const custom_text$ = isolate(CustomText)({app_state$: app_state$, DOM: sources.DOM})
  // custom_text_bus$.imitate(custom_text$.BUS)
  // const replay$ = isolate(ReplayTyping)({app_state$: app_state$, DOM: sources.DOM})
  // const live_text$ = isolate(LiveText)({app_state$: app_state$, replay$: replay$})

  // const vtree$ = view({
  //   state$: state$,
    // custom_text$: custom_text$.DOM,
    // live_text$: live_text$.DOM,
    // replay$: replay$.DOM
  // })

  // const nap$ = nap(app_state$)

  const state$ = sources.onion.state$
  const actions = intent(sources)
  const parentReducer$ = model(actions)
  const napReducer$ = nap(state$)

  const CustomTextLens = {
    get: (state) => state,
    set: (prevState, componentState) => componentState
  }
  const customTextSinks = isolate(CustomText, {onion: CustomTextLens})(sources)

  const LiveTextLens = {
    get: (state) => state,
    set: (prevState, componentState) => componentState
  }
  const liveTextSinks = isolate(LiveText, {onion: LiveTextLens})(sources)

  const componentsReducer$ = xs.merge(
    customTextSinks.onion,
    liveTextSinks.onion
  )
  const reducer$ = xs.merge(
    parentReducer$,
    napReducer$,
    componentsReducer$
  )

  const vdom$ = view(
    liveTextSinks.DOM,
    customTextSinks.DOM
  )

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

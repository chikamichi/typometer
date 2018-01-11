/***
 * Typometer — typing-abilities speedometer
 *
 * Tracks instant accuracy and averaged speed on any text:
 * - instant accuracy is refined as you type.
 * - averaged speed is expressed as Words per minute, with a hardcoded
 *   convention of 5 letters per word.
 *
 * Formula: https://www.speedtypingonline.com/typing-equations
 *
 ***/

import xs from "xstream"
import delay from 'xstream/extra/delay'
import { run } from "@cycle/run"
import isolate from "@cycle/isolate"
import { h1, h2, div, p, span, input, textarea, ul, li, makeDOMDriver } from "@cycle/dom"
import classnames from "classnames"

import TargetText from "./target_text"
import * as Model from './model'
import NewTextAction from "./actions/new_text"
import TypingAction from "./actions/typing"



const default_text = 'salut la terre'
Model.Singleton.set({text: new TargetText(default_text)})



// Intent: computes mutation proposals based on raw events.
function intent(dom_source) {
  const new_text$ = dom_source
    .select('.ta-custom-text').events('change')
    .map(e => new NewTextAction(e.target.value.trim()))

  const new_char$ = dom_source
    .select('document').events('keydown')
    .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
    .map(e => new TypingAction(e.key))

  return xs
    .merge(new_text$, new_char$)
    .map(action => action.process())
}



// Model: mutates app state based on proposed mutation.
function model(mutation_proposal$) {
  return mutation_proposal$
    .map((mutation_proposal: Model.AppState) => {
      // Basically auto-accept proposed mutations for now.
      return Model.Singleton.set(mutation_proposal)
    })
}



// View: decorates app state and re-renders in place.
function view(app_state$) {
  return app_state$
    .map(app_state => (new Model.Decorator(app_state)).decorate())
    .map(attributes =>
      div('.typing-app.ta', [
        h1('Try typing the following text as fast as possible:'),
        div('.ta-content', [
          p('.ta-target-text', {tabindex: 0}, attributes.text.wrap((char) => {
            if (char.isValid)
              return span('.ta-char  .ta-char--valid', char.char)
            else if (char.isError)
              return span('.ta-char  .ta-char--error', char.char)
            else
              return span('.ta-char', char.char)
          })),
          span(classnames('.ta-progress .ta-progress--done', {'.u-wip': !attributes.done}), ' Done!')
        ]),
        ul('.ta-metrics', [
          li('.ta-metric__record-accuracy', [
            span('Accuracy: ' + attributes.accuracy + '%')
          ]),
          li('.ta-metric__record-wpm', [
            span('Net WPM: ' + attributes.wpm + ' words/minute'),
            span(classnames({'.u-wip': !attributes.records.wpm}), ' (best: ' + attributes.records.wpm + ')')
          ])
        ]),
        div('.ta-custom-text', [
          h2('Enter some custom text:'),
          textarea({tabindex: 0}, [
            attributes.text
          ]),
        ])
      ])
    )
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
function nap(app_state$) {
  // Typing is over but stats (model decoration) are still pending: trigger
  // updates and re-rendering with a fake keypress.
  const compute_wpm$ = app_state$
    .filter(_ => {
      return Model.Singleton.get().isDone()
        && !Model.Singleton.get().attributes.stop
    })
    .map(app_state => (new TypingAction).process())

  // Once everything is over, including stats computation/display, let's reset
  // everything after a short delay so the user may retry.
  const auto_reset$ = app_state$
    .filter(_ => {
      return Model.Singleton.get().isDone()
        && Model.Singleton.get().attributes.stop
    })
    .compose(delay(2000))
    .map(app_state => Model.Singleton.clear())

  return xs.merge(
    compute_wpm$,
    auto_reset$
  ).startWith(undefined)
}



// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
function main(sources) {
  const mutation_proposal$ = xs.merge(sources.NAP, intent(sources.DOM))
  const app_state$ = model(mutation_proposal$)
  const vtree$ = view(app_state$)
  const nap$ = nap(app_state$)
  return {
    DOM: vtree$,
    NAP: nap$ // next-action-predicate aka. internal side-effects
  }
}



// The NAP driver is merely a proxy for pre-computed side-effects aka. triggered
// mutation proposals.
function makeNAPDriver() {
  return function NAPDriver(side_effect$) {
    return side_effect$
  }
}



// Drivers: raw events streams hooked with the intent layer through main().
const drivers = {
  DOM: makeDOMDriver('.main'),
  NAP: makeNAPDriver()
}



run(main, drivers);

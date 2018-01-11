import xs from "xstream"
import delay from 'xstream/extra/delay'
import { run } from "@cycle/run"
import isolate from "@cycle/isolate"
import { div, p, span, input, ul, li, makeDOMDriver } from "@cycle/dom"
import classnames from "classnames"

import TargetText from "./target_text"
import * as Model from './model'
import TypingAction from "./actions/typing"

// Vélocimètre de frappe.
// Détermine la précision instantanée et la vitesse moyenne de frappe d'un texte.
//
// La précision instantanée est cumulative.
// La vitesse moyenne intègre la gestion d'erreurs (erreurs corrigées ou
// laissées telles quelles).
// Formules : https://www.speedtypingonline.com/typing-equations



// TODO: allow user to set custom text.
const input_text = 'Un texte'
Model.Singleton.set({text: new TargetText(input_text)})



// Intent: compute mutation proposals based on raw events.
function intent(dom_source) {
  const new_char$ = dom_source
    .select('document').events('keydown')
    .filter(e => !/^(Control|Alt|Shift|Meta).*/.test(e.code))
    .map(e => e.key)

  const mutation_proposal$ = new_char$
    .map(new_char => {
      return (new TypingAction).process(new_char)
    })

  return mutation_proposal$
}



// Model: mutate app state based on proposed mutation.
// Elm/foldp & SAM inspired.
function model(mutation_proposal) {
  return mutation_proposal
    .fold((model: Model.Singleton, mutation_proposal: Model.AppState) => {
      // Basically auto-accept proposed mutations for now.
      return Model.Singleton.set(mutation_proposal)
    }, Model.Singleton.get())


}



// View: decorate app state and re-render in place, while handling
// next-action-predicate logic (internal side-effects).
// SAM inspired.
function view(app_state$) {
  return app_state$
    .map(app_state => (new Model.Decorator(app_state)).decorate())
    .map(attributes =>
      div([
        div([
          p('.original-text', attributes.text.wrap((char) => {
            if (char.isValid)
              return span('.char.valid', char.char)
            else if (char.isError)
              return span('.char.error', char.char)
            else
              return span('.char', char.char)
          })),
          span(classnames('progress', {wip: !attributes.done}).split(' ').map(x => '.' + x).join(' '), ' Done!')
        ]),
        ul('.metrics', [
          li('.accuracy', 'Accuracy: ' + attributes.accuracy + '%'),
          li('.wpm', 'Net WPM: ' + attributes.wpm + ' words/minute')
        ])
      ])
    )
}


// next-action-predicate aka. internal side-effect handler.
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



// Main: wire everything up with cyclic streams.
// Note: next-action-predicates bypass the intent() layer.
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
  DOM: makeDOMDriver('#main'),
  NAP: makeNAPDriver()
}



run(main, drivers);

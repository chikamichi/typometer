import xs from "xstream"
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
Model.Singleton.set({text: new TargetText('Un texte facile à retaper.')})
// Model.Singleton.set({text: new TargetText('Un')})



// Intent: compute mutation proposals based on raw events.
function intent(sources) {
  const new_char$ = sources.DOM
    .select('document').events('keydown')
    .filter(e => !/^(Control|Alt|Shift|Meta).*/.test(e.code))
    .map(e => e.key)

  const mutation_proposal$ = xs.combine(new_char$, sources.NAP)
    .map(([new_char, side_effect]) => {
      if (side_effect) {
        return side_effect
      } else {
        const new_char_typed = new TypingAction
        return new_char_typed.process(new_char)
      }
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



// Compute any required side-effect as an internally triggered mutation proposal.
function nap(app_state$) {
  const compute_wpm = app_state$
    .filter(_ => {
      return Model.Singleton.get().isDone() && !Model.Singleton.get().attributes.stop
    })
    .map(app_state => (new TypingAction).process())

  // Combine with other side-effects if need be.
  return xs.merge(compute_wpm, xs.empty())
    .startWith(null)
}



// Main: wire everything up with cyclic streams.
function main(sources) {
  const mutation_proposals = intent(sources)
  const app_state$ = model(mutation_proposals)
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

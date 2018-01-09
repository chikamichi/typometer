import xs from "xstream"
import { run } from "@cycle/run"
import isolate from "@cycle/isolate"
import { div, p, span, input, ul, li, makeDOMDriver } from "@cycle/dom"

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

// Intent: compute mutation proposals based on raw events.
function intent(sources) {
  const keydown$ = sources.DOM.select('document').events('keydown')

  const char_attempt$ = keydown$
    .filter(e => !/^(Control|Alt|Shift|Meta).*/.test(e.code))

  const char$ = char_attempt$
    .map(e => e.key)

  return char$
    .map(char => {
      const new_char_typed = new TypingAction
      return new_char_typed.process(char)
    })
    // .debug('typing$')
}

// Model: mutate app state based on proposed mutation.
// Elm/foldp & SAM inspired.
function model(mutation_proposal$) {
  return mutation_proposal$
    .fold((model: Model.Singleton, mutation_proposal: Model.AppState) => {
      // Basically auto-accept proposed mutations for now.
      return Model.Singleton.set(mutation_proposal)
    }, Model.Singleton.get())
    .debug('model')
}

// View: decorate app state and re-render in place.
// SAM inspired.
function view(app_state$) {
  return app_state$
    // .debug('app_state$')
    .map(app_state => (new Model.Decorator(app_state)).decorate())
    // .debug('decorated_state$')
    // .map(decorated_state => decorated_state)
    .map(attributes =>
      div([
        p('.original-text', Model.Singleton.get().attributes.text.wrap((char) => {
          if (char.isValid)
            return span('.char.valid', char.char)
          else if (char.isError)
            return span('.char.error', char.char)
          else
            return span('.char', char.char)
        })),
        ul('.metrics', [
          li('.accuracy', 'Accuracy: ' + attributes.accuracy + '%'),
          li('.wpm', 'Net WPM: ' + attributes.wpm)
        ])
      ])
  )
}

// Main: wire everything up with cyclic streams.
function main(sources) {
  const mutation_proposals = intent(sources)
  const app_state$ = model(mutation_proposals)
  const vtree$ = view(app_state$)
  return {
    DOM: vtree$
  }
}

// Drivers: raw events streams hooked with the intent layer through main().
const drivers = {
  DOM: makeDOMDriver('#main')
}

run(main, drivers);

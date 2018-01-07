import { run } from "@cycle/run"
import isolate from "@cycle/isolate"
import { div, p, input, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

// DOM WRITE: Display a checkbox and a on/off sentence
// DOM READ: Toggling the checkbox should switch the sentence

function intent(sources) {
  return sources.DOM.select('.checkbox').events('change')
    .map(ev => ev.target.checked).startWith(false)
}

function model(actions$) {
  return actions$.map(toggled =>
    toggled ? 'on' : 'off'
  )
}

function view(state$) {
  return state$.map(state =>
    div([
      input('.checkbox', {attrs: {type: 'checkbox', checked: false}}),
      p('The checkbox is ' + state)
    ])
  )
}

function main(sources) {
  const action$ = intent(sources)
  const state$ = model(action$)
  const vdom$ = view(state$)
  const sinks = {
    DOM: vdom$
  }
  return sinks
}

// Shared sources automatically injected within main() as "sources" as a result
// of calling run(): allows for inheritance within the nested components.
const drivers = {
  DOM: makeDOMDriver('#main')
}

run(main, drivers);

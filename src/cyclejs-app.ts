import { run } from "@cycle/run"
import { div, label, input, h2, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

// Reusable component (a slider input)

function intent(domSource) {
  const changeValue$ = domSource.select('.slider').events('input').map(ev => ev.target.value)
  return {changeValue$}
}

function model(actions, props$) {
  const {changeValue$} = actions
  return props$.map(props => {
    return changeValue$.startWith(props.init)
      .map(value => {
        return {
          value,
          label: props.label,
          unit: props.unit,
          min: props.min,
          max: props.max
        }
      })
  }).flatten()
}

function view(state$) {
  return state$.map(state =>
    div('.labeled-slider', [
      label('.label', state.label + ':' + state.value + state.unit),
      input('.slider', {attrs: {type: 'range', min: state.min, max: state.max, value: state.value}})
    ])
  )
}

function labeledSlider(sources) {
  const props$ = sources.props
  const actions = intent(sources.DOM)
  const state$ = model(actions, props$)
  const vdom$ = view(state$)

  return {
    DOM: vdom$
  }
}

function main(sources) {
  const weightProps$ = xs.of({
    label: 'Weight',
    unit: 'kg',
    min: 40,
    max: 150,
    init: 65
  })
  const heightProps$ = xs.of({
    label: 'Height',
    unit: 'cm',
    min: 140,
    max: 240,
    init: 175
  })
  const weightSinks = labeledSlider({...sources, props: weightProps$})
  const heightSinks = labeledSlider({...sources, props: heightProps$})
  return weightSinks
}

const drivers = {
  DOM: makeDOMDriver('#main'),
}

run(main, drivers);

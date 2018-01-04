import { run } from "@cycle/run"
import isolate from "@cycle/isolate"
import { div, label, input, h2, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

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

// Reusable component (a slider input).
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
  // Initial components' states.
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

  // Pre-post-processing: limit scope of DOM sources based on specific selectors.
  const weightSlider = isolate(labeledSlider, '.weight')
  const heightSlider = isolate(labeledSlider, '.height')

  // Create two slider components targeting their specific DOM area.
  const weightSinks = weightSlider({...sources, props: weightProps$})
  const heightSinks = heightSlider({...sources, props: heightProps$})

  const vdom$ = xs.combine(weightSinks.DOM, heightSinks.DOM)
    .map(([weightVDOM, heightVDOM]) =>
      div([
        weightVDOM,
        heightVDOM
      ])
    )

  return {
    DOM: vdom$
  }
}

// Shared sources automatically injected within main() as "sources" as a result
// of calling run(): allows for inheritance within the nested components.
const drivers = {
  DOM: makeDOMDriver('#main')
}

run(main, drivers);

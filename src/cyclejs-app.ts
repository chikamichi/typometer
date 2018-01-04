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

  // Pre-processing: limit scope of DOM sources based on specific selectors.
  const weightDOMsource = sources.DOM.select('.weight')
  const heightDOMsource = sources.DOM.select('.height')

  // Create two slider components targeting their specific DOM area.
  const weightSinks = labeledSlider({...sources, DOM: weightDOMsource, props: weightProps$})
  const heightSinks = labeledSlider({...sources, DOM: heightDOMsource, props: heightProps$})

  // Post-processing: assign selectors to components.
  const weightVDOM$ = weightSinks.DOM.map(vdom => {
    vdom.sel += '.weight'
    return vdom
  })
  const heightVDOM$ = heightSinks.DOM.map(vdom => {
    vdom.sel += '.height'
    return vdom
  })

  const vdom$ = xs.combine(weightVDOM$, heightVDOM$)
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

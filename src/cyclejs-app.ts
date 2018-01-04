import { run } from "@cycle/run"
import { button, p, div, label, makeDOMDriver } from "@cycle/dom"
import xs from "xstream"

function main(sources) {
  const decClick$ = sources.DOM.select('.dec').events('click')
  const incClick$ = sources.DOM.select('.inc').events('click')

  const dec$ = decClick$.map(() => -1)
  const inc$ = incClick$.map(() => +1)

  const number$;

  return {
    DOM: number$.map(number =>
      div([
        button('.dec', 'Decrement'),
        button('.inc', 'Increment'),
        p([
          label('count: ' + number)
        ])
      ])
    )
  }
}

const drivers = {
  DOM: makeDOMDriver('#main')
}

run(main, drivers);

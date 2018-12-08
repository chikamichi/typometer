import xs, { Stream } from "xstream"
import { div, span, h3, a, input } from "@cycle/dom"

import { AppState } from "typometer/types"
import Model, { SuperState } from "typometer/models/Model"


interface sources {
  state$: Stream<AppState>,
  wpm$: Stream<string>
}

export default function view({ state$, wpm$ }: sources) {
  return xs.combine(state$, wpm$)
    .map(([state, wpm]) => [Model(<AppState>state), wpm])
    .map(([state, wpm]) =>
      div('.ta-setting  .ta-replay-settings', [
        h3('.ta-setting__title', [
          a({attrs: {href: "https://en.wikipedia.org/wiki/Words_per_minute", target: "_blank"}}, [
            span({attrs: {title: "Words per minute"}}, 'WPM'),
          ])
        ]),
        div('.ta-setting-slider', [
          input('.ta-slider  .ta-setting__slider  .ta-replay-settings__range', {
            attrs: {
              type: 'range',
              min: 1,
              max: 150,
              disabled: !(<SuperState>state).isNew()
            }
          }),
          span('.ta-setting__value  .ta-replay-settings__speed', wpm)
        ])
      ])
    )
}

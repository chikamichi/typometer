import xs, { Stream, MemoryStream } from "xstream"
import { div, span, h3, a, input } from "@cycle/dom"

import State from "typometer/models/State"


interface RythmSources {
  state$: MemoryStream<State>,
  wpm$: Stream<string>
}

export default function view(sources: RythmSources) {
  return xs.combine(sources.state$, sources.wpm$)
    .map(([state, wpm]) =>
      div('.ta-setting  .ta-tick-settings', [
        h3('.ta-setting__title', [
          a({attrs: {href: "https://en.wikipedia.org/wiki/Words_per_minute", target: "_blank"}}, [
            span({attrs: {title: "Words per minute"}}, 'WPM'),
          ])
        ]),
        div('.ta-setting-slider', [
          input('.ta-slider  .ta-setting__slider  .ta-tick-settings__range', {
            attrs: {
              type: 'range',
              min: 1,
              max: 150,
              disabled: !state.isNew()
            }
          }),
          span('.ta-setting__value  .ta-tick-settings__speed', wpm)
        ])
      ])
    )
}

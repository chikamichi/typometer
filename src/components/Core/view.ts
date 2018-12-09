import xs, { Stream, MemoryStream } from "xstream"
import { VNode, h1, p, div } from "@cycle/dom"

import State from "typometer/models/State"
import { APP_TITLE, APP_MOTTO } from "typometer/utils"


interface sources {
  state$: MemoryStream<State>
  contentVDom$: Stream<VNode>
  replayVDom$: Stream<VNode>
  metricsVDom$: Stream<VNode>
}

export default function view(sources: sources): Stream<VNode> {
  const { state$, contentVDom$, replayVDom$, metricsVDom$ } = sources
  return xs.combine(state$, contentVDom$, replayVDom$, metricsVDom$)
    .map(([state, content, replaySettings, metrics]) => {
      return div('.typing-app.ta', {
        class: {
          'ta-text-status--editing': state.textBeingEdited(),
          'ta-text-status--failed': state.hasError(),
          'ta-text-status--success': state.isSuccess()
        }
      }, [
        div('.ta-header', [
          div('.ta-header-spacer'),
          div('.ta-welcome', [
            h1('.ta-title', APP_TITLE),
            p('.ta-motto', APP_MOTTO)
          ]),
          div('.ta-metrics-area', [
            metrics
          ])
        ]),
        div('.ta-main', [
          div('.ta-settings', [
            replaySettings
          ]),
          content
        ])
      ])
    })
}

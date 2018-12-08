import xs, { Stream } from "xstream"
import { VNode, h1, p, div } from "@cycle/dom"

import Model from "typometer/models/Model"
import { AppState } from "typometer/types"
import { APP_TITLE, APP_MOTTO } from "typometer/utils"


interface sources {
  state$: Stream<AppState>
  contentVDom$: Stream<VNode>
  replayVDom$: Stream<VNode>
  metricsVDom$: Stream<VNode>
}

export default function view(sources: sources): Stream<VNode> {
  const { state$, contentVDom$, replayVDom$, metricsVDom$ } = sources
  return xs.combine(state$, contentVDom$, replayVDom$, metricsVDom$)
    .map(([state, content, replaySettings, metrics]) => {
      const s = Model(state)
      return div('.typing-app.ta', {
        class: {
          'ta-text-status--editing': s.textBeingEdited(),
          'ta-text-status--failed': s.hasError(),
          'ta-text-status--success': s.isSuccess()
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

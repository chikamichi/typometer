import xs, { Stream } from "xstream"
import { VNode, h1, p, div } from "@cycle/dom"

import { APP_TITLE, APP_MOTTO } from "typometer/utils"


interface sources {
  textStatusEditing$: Stream<boolean>
  textStatusKO$: Stream<boolean>
  textStatusOK$: Stream<boolean>
  contentVDom$: Stream<VNode>
  replayVDom$: Stream<VNode>
  metricsVDom$: Stream<VNode>
}

export default function view(sources: sources): Stream<VNode> {
  const { textStatusEditing$, textStatusKO$, textStatusOK$, contentVDom$, replayVDom$, metricsVDom$ } = sources
  return xs.combine(textStatusEditing$, textStatusKO$, textStatusOK$, contentVDom$, replayVDom$, metricsVDom$)
    .map(([textStatusEditing, textStatusKO, textStatusOK, content, replaySettings, metrics]) => {
      return div('.typing-app.ta', {
        class: {
          'ta-text-status--editing': textStatusEditing,
          'ta-text-status--failed': textStatusKO,
          'ta-text-status--success': textStatusOK
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

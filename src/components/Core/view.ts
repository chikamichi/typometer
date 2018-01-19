import xs from "xstream"
import { h1, p, div } from "@cycle/dom"

import { APP_TITLE, APP_MOTTO } from "typometer/utils"


export default function view(textStatusEditing$, textStatusKO$, textStatusOK$, contentVDom$, replayVDom$, metricsVDom$) {
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

import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"

export default function view(textStatusKO$, textStatusOK$, liveTextVDom$, customTextVDom$): Stream<VNode> {
  return xs.combine(textStatusKO$, textStatusOK$, liveTextVDom$, customTextVDom$)
    .map(([textStatusKO, textStatusOK, liveText, customText]) => {
      return div('.ta-content', {
        attrs: {tabindex: 0},
        class: {
          'ta-text-status--failed': textStatusKO,
          'ta-text-status--success': textStatusOK
        }
      }, [
        liveText,
        customText
      ])
  })
}

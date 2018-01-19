import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"

export default function view(liveTextVDom$, customTextVDom$): Stream<VNode> {
  return xs.combine(liveTextVDom$, customTextVDom$)
    .map(([liveText, customText]) => {
      return div('.ta-content', {
        attrs: {tabindex: 0}
      }, [
        liveText,
        customText
      ])
  })
}

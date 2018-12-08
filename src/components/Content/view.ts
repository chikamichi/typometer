import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"


interface sources {
  liveTextVDom$: Stream<VNode>,
  customTextVDom$: Stream<VNode>,
}

export default function view(sources: sources): Stream<VNode> {
  const { liveTextVDom$, customTextVDom$ } = sources
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

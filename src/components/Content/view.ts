import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"


interface sources {
  liveTextVDom$: Stream<VNode>,
  editorVDom$: Stream<VNode>,
}

export default function view(sources: sources): Stream<VNode> {
  const { liveTextVDom$, editorVDom$ } = sources
  return xs.combine(liveTextVDom$, editorVDom$)
    .map(([liveText, editor]) => {
      return div('.ta-content', {
        attrs: {tabindex: 0}
      }, [
        liveText,
        editor
      ])
    })
}

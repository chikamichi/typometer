import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"


interface sources {
  LiveTextVDom$: Stream<VNode>,
  EditorVDom$: Stream<VNode>,
}

export default function view(sources: sources): Stream<VNode> {
  const { LiveTextVDom$, EditorVDom$ } = sources
  return xs.combine(LiveTextVDom$, EditorVDom$)
    .map(([LiveText, Editor]) => {
      return div('.ta-content', {
        attrs: {tabindex: 0}
      }, [
        LiveText,
        Editor
      ])
    })
}

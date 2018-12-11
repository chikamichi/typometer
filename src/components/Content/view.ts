import xs, { Stream } from "xstream"
import { div, VNode } from "@cycle/dom"

import { View } from 'typometer/types'


interface ContentViewSources {
  LiveTextVDom$: Stream<VNode>,
  EditorVDom$: Stream<VNode>
}

const view: View = (sources: ContentViewSources) => {
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

export default view

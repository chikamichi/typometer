import { Stream } from "xstream"
import { h, div, h2, input, textarea, label, VNode } from "@cycle/dom"

import { AppState } from "types"

export default function view(state$: Stream<AppState>): Stream<VNode> {
  return state$
    .map(state => {
      return h('div.ta-custom-text', {
          class: {active: state.text.editing},
          hook: {
            update: (_, vnode) => {
              const textarea = vnode.elm.querySelectorAll(':scope > textarea')[0]
              textarea.focus()
            }
          }
        }, [
          h2('.toto', 'Edit text'),
          textarea({attrs: {rows: 5, tabindex: 0}}, [
            state.text.raw
          ])
      ])
    })
}

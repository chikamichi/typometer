import { Stream } from "xstream"
import { h, textarea, VNode } from "@cycle/dom"

import { AppState } from "typometer/types"

export default function view(state$: Stream<AppState>): Stream<VNode> {
  return state$
    .map(state => {
      return h('div.ta-custom-text', {
          class: {active: state.text.editing},
          hook: {
            update: (_, vnode) => {
              const el = <HTMLElement>vnode.elm
              const textarea = <HTMLTextAreaElement>el.querySelectorAll(':scope > textarea')[0]
              textarea.focus()
            }
          }
        }, [
          // h2('.ta-custom-text__edit', 'Edit text'),
          textarea({attrs: {rows: 5, tabindex: 0}}, [
            state.text.raw
          ])
      ])
    })
}

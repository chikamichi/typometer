import { Stream, MemoryStream } from "xstream"
import { h, textarea, VNode } from "@cycle/dom"

import State from 'typometer/models/State'

export default function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state => {
      return h('div.ta-custom-text', {
          class: {active: state.data.text.editing},
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
            state.data.text.raw
          ])
      ])
    })
}

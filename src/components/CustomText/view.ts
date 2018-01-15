import { Stream } from "xstream"
import { div, h2, input, textarea, label, VNode } from "@cycle/dom"

import { AppState } from "types"

export default function view(state$: Stream<AppState>): Stream<VNode> {
  return state$
    .map(state => {
      return div('.ta-custom-text', [
        label({attrs: {for: "ta-custom-text"}}, 'Edit text'),
        input('.ta-custom-text__toggler', {attrs: {type: "checkbox", style: "display: none;", id: "ta-custom-text", checked: "checked"}}),
        textarea({attrs: {rows: 5, tabindex: 0}}, [
          state.text.raw
        ])
      ])
    })
}

import classnames from "classnames"
import { p, span, Stream, VNode } from "@cycle/dom"

import { AppState, CharState } from "typometer/types"
import TargetText from "typometer/models/TargetText"


function build_char(char: CharState): VNode {
  const kls = classnames('.ta-char', {
    '.ta-char--valid': char.isValid,
    '.ta-char--error': char.isError,
    '.ta-char--replay': char.isReplayed,
    '.ta-char--next': char.isNext
  })
  return span(kls, char.char)
}


export default function view(state$: Stream<AppState>): Stream<VNode> {
  return state$.map(state => {
    const text = new TargetText(state.text.raw, state)
    const chars = text.wrap(build_char)
    return p('.ta-target-text', {
      style: {display: state.text.editing ? 'none' : 'initial' },
      attrs: {tabindex: 0}
    }, chars)
  })
}

import { MemoryStream } from "xstream"
import { p, span, VNode } from "@cycle/dom"
import classnames from "classnames"

import { View, CharState } from "typometer/types"
import State from 'typometer/models/State'
import TargetText from "typometer/models/TargetText"


function build_char(char: CharState): VNode {
  const kls = classnames('.ta-char', {
    '.ta-char--valid': char.isValid,
    '.ta-char--error': char.isError,
    '.ta-char--tick': char.isTick,
    '.ta-char--next': char.isNext
  })
  return span(kls, char.char)
}

const view: View = (state$: MemoryStream<State>) => {
  return state$.map(state => {
    const text = new TargetText(state.data)
    const chars = text.map(build_char)
    // Re-rendering all characters (made efficient by the virtual DOM engine).
    return p('.ta-target-text', {
      style: { display: state.data.text.editing ? 'none' : 'initial' },
      attrs: { tabindex: 0 }
    }, chars)
  })
}

export default view

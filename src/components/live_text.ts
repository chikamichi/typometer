import xs, { Stream } from "xstream"
import { h, p, span, VNode } from "@cycle/dom"
import classnames from "classnames"

import { AppState, Singleton } from "../model"

interface Sources {
  app_state$: Stream<AppState>,
  replay$: {
    TICKS: Stream<number>
  }
}

function build_char(char): VNode {
  const kls = classnames('.ta-char', {
    '.ta-char--valid': char.isValid,
    '.ta-char--error': char.isError,
    '.ta-char--replay': char.isReplayed
  })
  return span(kls, char.char)
}

export default function LiveText(sources: Sources): Stream<VNode> {
  const vdom$ = xs.merge(sources.app_state$, sources.replay$.TICKS)
    .map(event => {
      const chars = Singleton.get().attributes.text.wrap(build_char)
      return p('.ta-target-text', {tabindex: 0}, chars)
    })

  return {
    DOM: vdom$
  }
}

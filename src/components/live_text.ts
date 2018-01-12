import Stream from "xstream"
import VNode from "@cycle/dom"
import { p, span } from "@cycle/dom"

import { AppState } from "../model"

interface Sources {
  app_state$: Stream<AppState>
}

export default function LiveText(sources: Sources): Stream<VNode> {
  // No logic for now. TODO:
  // 1. Filter app_state$ for those states where the AppState has a non-empty
  //    record. Map to a periodic stream which must emit a letter in such a way
  //    that the last emitted letter will be triggered exactly at the end of the
  //    duration of stop - start as reported by the matching AppState.
  // 2. Filter app_state$ for those states where the AppState has a non-empty
  //    start field, but is really new (may need to add use a dedicate stream
  //    as a pub-sub actually). Start the periodic stream by combining the two
  //    streams.
  // 3. The DOM should take the periodic "ghost" stream into account to render
  //    the letters, adding .ta-char--replay classes.
  return {
    DOM: sources.app_state$.map(app_state =>
      p('.ta-target-text', {tabindex: 0}, app_state.attributes.text.wrap((char) => {
        if (char.isValid)
          return span('.ta-char  .ta-char--valid', char.char)
        else if (char.isError)
          return span('.ta-char  .ta-char--error', char.char)
        else
          return span('.ta-char', char.char)
      }))
    )
  }
}

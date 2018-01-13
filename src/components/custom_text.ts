import { Stream } from "xstream"
import { div, h2, textarea, VNode } from "@cycle/dom"
import classnames from "classnames"

import { AppState } from "../model"

interface Sources {
  app_state$: Stream<AppState>
}

function view(sources) {
  return sources.app_state$
    .map(app_state =>
      div('.ta-custom-text', [
        h2('Enter some custom text:'),
        textarea({tabindex: 0}, [
          app_state.attributes.text
        ])
      ])
    )
}

export default function CustomText(sources: Sources): Stream<VNode> {
  const vdom$ = view(sources)

  return {
    DOM: vdom$
  }
}

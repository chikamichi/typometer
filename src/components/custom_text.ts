import xs, { Stream } from "xstream"
import { div, h2, textarea, VNode } from "@cycle/dom"
import classnames from "classnames"

import { AppState } from "../model"


interface Sources {
  app_state$: Stream<AppState>
}


function message(type, value) {
  return {
    type: type,
    data: value
  }
}


function intent(sources) {
  const focus$ = sources.DOM.select('textarea').events('focus').mapTo(true)
  const blur$ = sources.DOM.select('textarea').events('blur').mapTo(false)
  const focus_state$ = xs.merge(focus$, blur$)
    .map(focus_state => message('custom_text.focus', focus_state))
    .debug('focus_state$')
    .startWith(false) // focused$
  const edited$ = sources.DOM.select('textarea').events('change')
    .map(e => message('custom_text.edited', e.target.value.trim()))
    .debug('edited$')
  return {
    BUS: xs.merge(focus_state$, edited$),
    FOCUS: focus_state$
  }
}


function view(sources) {
  // return sources.app_state$
  //   .map(app_state =>
  return xs.combine(sources.focus_state$, sources.app_state$)
    .debug('CustomText.view')
    .map(([focus_state, app_state]) =>
      div('.ta-custom-text', [
        h2('Enter some custom text:'),
        textarea({tabindex: 0}, [
          app_state.attributes.text
        ])
      ])
    )
}

export default function CustomText(sources: Sources): Stream<VNode> {
  // const vdom$ = view(sources)
  const {BUS: bus$, FOCUS: focus_state$} = intent(sources)
  const vdom$ = view({...sources, ...{focus_state$: focus_state$}}).debug('CustomText/view$')

  return {
    DOM: vdom$,
    BUS: bus$
  }
}

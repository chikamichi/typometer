import xs, { Stream } from "xstream"
import isolate from "@cycle/isolate"
import { div, VNode } from "@cycle/dom"

import { Sources, Sinks } from "types"
import Model from "model"
import CustomText from "components/CustomText"
import LiveText from "components/LiveText"


function view(textStatusKO$, textStatusOK$, liveTextVDom$, customTextVDom$): Stream<VNode> {
  return xs.combine(textStatusKO$, textStatusOK$, liveTextVDom$, customTextVDom$)
    .map(([textStatusKO, textStatusOK, liveText, customText]) => {
      return div('.ta-content', {
        attrs: {tabindex: 0},
        class: {
          'ta-text-status--failed': textStatusKO,
          'ta-text-status--success': textStatusOK
        }
      }, [
        liveText,
        customText
      ])
  })
}


export default function LiveText(sources: Sources): Sinks {
  const state$ = sources.onion.state$

  const textStatusKO$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.hasError()
    })
    .startWith(false)

  const textStatusOK$ = state$
    .map(state => {
      const model = Model(state)
      return !!model.isSuccess()
    })
    .startWith(false)

  // CustomText
  const CustomTextLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const customTextSinks = isolate(CustomText, {onion: CustomTextLens})(sources)

  // LiveText
  const LiveTextLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const liveTextSinks = isolate(LiveText, {onion: LiveTextLens})(sources)

  const componentsReducer$ = xs.merge(
    customTextSinks.onion,
    liveTextSinks.onion
  )

  const vdom$ = view(
    textStatusKO$,
    textStatusOK$,
    liveTextSinks.DOM,
    customTextSinks.DOM
  )

  return {
    DOM: vdom$,
    onion: componentsReducer$
  }
}

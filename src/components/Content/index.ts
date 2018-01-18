import xs from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks } from "typometer/types"
import Model from "typometer/models/Model"
import CustomText from "typometer/components/CustomText"
import LiveText from "typometer/components/LiveText"
import view from "./view"


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

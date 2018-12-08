import xs, { Stream } from "xstream"
import isolate from "@cycle/isolate"

import { Sources, Sinks, Reducer } from "typometer/types"
import CustomText from "typometer/components/CustomText"
import LiveText from "typometer/components/LiveText"
import view from "./view"


export default function Content(sources: Sources): Sinks {
  // CustomText
  const CustomTextLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const customTextSinks = isolate(CustomText, {state: CustomTextLens})(sources)

  // LiveText
  const LiveTextLens = {
    get: (state) => state,
    set: (_, componentState) => componentState
  }
  const liveTextSinks = isolate(LiveText, {state: LiveTextLens})(sources)

  const componentsReducer$ = xs.merge(
    customTextSinks.state as Stream<Reducer>,
    liveTextSinks.state as Stream<Reducer>
  )

  const vdom$ = view(
    liveTextSinks.dom,
    customTextSinks.dom
  )

  return {
    dom: vdom$,
    state: componentsReducer$
  }
}

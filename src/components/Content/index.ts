import xs, { Stream, MemoryStream } from "xstream"
import { DOMSource } from '@cycle/dom'
import isolate from "@cycle/isolate"

import { Sinks, Reducer, ComponentSources, ComponentLens } from "typometer/types"
import CustomText from "typometer/components/CustomText"
import LiveText from "typometer/components/LiveText"
import view from "./view"


export default function Content(sources: ComponentSources): Sinks {
  // CustomText
  // const CustomTextLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const customTextSinks = isolate(CustomText, {state: CustomTextLens})(sources)

  // // LiveText
  // const LiveTextLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const liveTextSinks = isolate(LiveText, {state: LiveTextLens})(sources)

  // TODO: check isolate again, is it required?
  const customTextSinks = CustomText(sources)
  const liveTextSinks = LiveText(sources)

  const componentsReducer$ = xs.merge(
    customTextSinks.state as Stream<Reducer>,
    liveTextSinks.state as Stream<Reducer>
  )

  const liveTextVDom$ = liveTextSinks.dom
  const customTextVDom$ = customTextSinks.dom
  const vdom$ = view({
    liveTextVDom$,
    customTextVDom$
  })

  return {
    dom: vdom$,
    state: componentsReducer$
  }
}

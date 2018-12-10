import xs, { Stream } from "xstream"

import { Sinks, Reducer, Sources } from "typometer/types"
import isolateComponent from "typometer/utils/isolateComponent"
import Editor from "typometer/components/Editor"
import LiveText from "typometer/components/LiveText"
import view from "./view"


export default function Content(sources: Sources): Sinks {
  const editorSinks = isolateComponent(Editor, sources)
  const liveTextSinks = isolateComponent(LiveText, sources)

  const componentsReducer$ = xs.merge(
    editorSinks.state as Stream<Reducer>,
    liveTextSinks.state as Stream<Reducer>
  )

  const liveTextVDom$ = liveTextSinks.dom
  const editorVDom$ = editorSinks.dom
  const vdom$ = view({
    liveTextVDom$,
    editorVDom$
  })

  return {
    dom: vdom$,
    state: componentsReducer$
  }
}

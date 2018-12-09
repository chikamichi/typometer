import xs, { Stream, MemoryStream } from "xstream"
import { DOMSource } from '@cycle/dom'
import isolate from "@cycle/isolate"

import { Sinks, Reducer, ComponentSources, ComponentLens } from "typometer/types"
import Editor from "typometer/components/Editor"
import LiveText from "typometer/components/LiveText"
import view from "./view"


export default function Content(sources: ComponentSources): Sinks {
  // Editor
  // const EditorLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const editorSinks = isolate(Editor, {state: EditorLens})(sources)

  // // LiveText
  // const LiveTextLens: ComponentLens = {
  //   get: (state) => state,
  //   set: (_, componentState) => componentState
  // }
  // const liveTextSinks = isolate(LiveText, {state: LiveTextLens})(sources)

  // TODO: check isolate again, is it required?
  const editorSinks = Editor(sources)
  const liveTextSinks = LiveText(sources)

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

import xs from "xstream"

import { Sinks, Sources } from "typometer/types"
import { addComponents } from "typometer/utils"
import Editor from "typometer/components/Editor"
import LiveText from "typometer/components/LiveText"
import view from "./view"


export default function Content(sources: Sources): Sinks {
  const components = addComponents(Editor, LiveText)(sources)

  const vdom$ = view(components.dom$)

  return {
    dom: vdom$,
    state: components.reducers$
  }
}

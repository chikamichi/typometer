import { Component } from "typometer/types"
import { addComponents } from "typometer/utils"

import Editor from "typometer/components/Editor"
import LiveText from "typometer/components/LiveText"
import view from "./view"


const Content: Component = (sources) => {
  const components = addComponents(Editor, LiveText)(sources)

  const vdom$ = view(components.dom$)

  return {
    dom: vdom$,
    state: components.reducers$
  }
}

Content.cname = 'Content'

export default Content

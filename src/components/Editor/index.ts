import { Component } from "typometer/types"
import intent from "./intent"
import model from "./model"
import view from "./view"


const Editor: Component = (sources) => {
  const actions = intent(sources.dom)
  const reducer$ = model(actions)
  const vdom$ = view(sources.state.stream)

  return {
    dom: vdom$,
    state: reducer$
  }
}

Editor.cname = 'Editor'

export default Editor

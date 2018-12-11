import xs from "xstream"

import { Model } from "typometer/types"
import * as Actions from 'typometer/actions/Editor'
import { EditorActions } from "./intent"


const model: Model = (actions: EditorActions) => {
  return xs.merge(...[
    actions.focus$.map(Actions.Focus),
    actions.blur$.map(Actions.Blur),
    actions.toggle$.map(Actions.Toggle)
  ])
}

export default model

import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import * as Actions from 'typometer/actions/Editor'
import { EditorActions } from "./intent"


export default function model(actions: EditorActions): Stream<Reducer> {
  return xs.merge(...[
    actions.focus$.map(Actions.Focus),
    actions.blur$.map(Actions.Blur),
    actions.toggle$.map(Actions.Toggle)
  ])
}

import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import { Focus } from "typometer/reducers/Editor"


export default function EditorFocus(_: boolean) {
  return function EditorFocusReducer(prevState: State) {
    return Focus(prevState)
  } as Reducer
}

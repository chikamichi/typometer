import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import { Toggle } from "typometer/reducers/Editor"


export default function EditorToggle(toggling: boolean) {
  return function EditorToggleReducer(prevState: State) {
    return Toggle(prevState, toggling)
  } as Reducer
}

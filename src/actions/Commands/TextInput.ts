import { Action } from 'typometer/types'
import TextInput from "typometer/reducers/Text/Input"


const action: Action = (newChar: string) => {
  return function newCharReducer(state) {
    if (!state) return
    if (state.textBeingEdited()) return state
    return TextInput(state, newChar)
  }
}

export default action

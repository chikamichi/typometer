import { Reducer, KeyMapping } from "typometer/types"
import State from "typometer/models/State"


const mapping = {
  Backspace: processBackspace,
} as KeyMapping


export default (function TextInput(state: State, char: string): State {
  if (state.textBeingEdited()) return state
  return (mapping[char] || processLetter)(state, char)
}) as Reducer


function processLetter(state: State, char: string): State {
  return state.newCharMutation(char)
}


function processBackspace(state: State, _: string): State {
  return state.eraseCharMutation()
}

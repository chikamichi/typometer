import { Reducer, KeyMapping } from "typometer/types"
import State from "typometer/models/State"


const mapping = {
  Backspace: processBackspace,
} as KeyMapping


const TextInput: Reducer = (state, char) => {
  return (mapping[char] || processLetter)(state!, char)
}

export default TextInput


function processLetter(state: State, char: string): State {
  return state.newCharMutation(char)
}


function processBackspace(state: State, _: string): State {
  return state.eraseCharMutation()
}

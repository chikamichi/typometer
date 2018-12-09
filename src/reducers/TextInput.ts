import { Reducer, KeyMapping } from "typometer/types"
import State from "typometer/models/State"
import { INITIAL_APP_STATE } from "typometer/utils"


const mapping = {
  Backspace: processBackspace,
  Escape: processEscape
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


function processEscape(state: State, _: string): State {
  return State.from({
    ...INITIAL_APP_STATE,
    ...{
      text: {
        ...INITIAL_APP_STATE.text,
        raw: state.data.text.raw
      },
      records: {
        ...state.data.records,
        pending: true
      }
    }
  })
}

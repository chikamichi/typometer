import Model from "typometer/models/Model"
import { AppState, Reducer, KeyMapping } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"


const mapping = {
  Backspace: processBackspace,
  Escape: processEscape
} as KeyMapping


export default (function(state: AppState, char: string): AppState {
  if (Model(state).textBeingEdited()) return state
  return (mapping[char] || processLetter)(state, char)
}) as Reducer


function processLetter(state: AppState, char: string): AppState {
  return Model(state).newCharMutation(char)
}


function processBackspace(state: AppState): AppState {
  return Model(state).eraseCharMutation()
}


function processEscape(state: AppState): AppState {
  let t = state.text
  return {
    ...INITIAL_APP_STATE,
    ...{
      text: {
        ...INITIAL_APP_STATE.text,
        raw: t.raw
      },
      records: {
        ...state.records,
        pending: true
      }
    }
  }
}

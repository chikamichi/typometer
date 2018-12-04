import Model from "typometer/models/Model"
import { AppState } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"


const mapping = {
  Backspace: processBackspace,
  Escape: processEscape
}


export default function TypingAction(char: string, state: AppState): AppState {
  return (mapping[char] || processLetter)(state, char)
}


function processLetter(state: AppState, char: string): AppState {
  // TODO: Model(state).mutations.newChar(char)
  const mutation = Model(state).newCharMutation(char)
  return {...state, ...mutation}
}


function processBackspace(state: AppState): AppState {
  const mutation = Model(state).eraseCharMutation()
  return {...state, ...mutation}
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

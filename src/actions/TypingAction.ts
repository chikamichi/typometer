import xs from "xstream"

import Model from "typometer/model"
import { AppState } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"


export default function TypingAction(char: string, state: AppState): AppState {
  if (state.text.editing) return state
  switch (char) {
    case 'Backspace':
      return processBackspace(state)
    case 'Escape':
      return processEscape(state)
    default:
      return processLetter(char, state)
  }
}


function processLetter(char: string, state: AppState): AppState {
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

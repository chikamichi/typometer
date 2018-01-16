import xs from "xstream"

import Model from "model"
import { AppState } from "types"
import { INITIAL_APP_STATE } from "utils"


function processLetter(char: string, state: AppState): AppState {
  const mutation = Model(state).newCharMutation(char)
  return {...state, ...mutation}
}


// Backspace only wipes out a typed character, valid or invalid, but does not
// alter cumulative metrics.
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
      }
    }
  }
}


// TypingAction: handles actions related to the user typing text.
// Compute an app state's mutation proposal after a valid key was pressed.
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

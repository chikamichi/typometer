import xs from "xstream"

import Model from "model"
import { AppState } from "types"
import { INITIAL_APP_STATE } from "utils"


function processLetter(char: string, state: AppState): AppState {
  let m = state.metrics
  let t = state.text
  let metricsMutation = {}
  const S = Model(state)

  // if (!m.start) // first char was typed!
  if (S.isNew())
    metricsMutation['start'] = new Date()

  if (S.isDone())
    metricsMutation['stop'] = new Date()

  metricsMutation['current_char'] = char
  metricsMutation['keystrokes_nb'] = m.keystrokes_nb + 1

  // TODO: hide in Model getters to improve readibility
  if (t.raw[m.valid_nb] == char && m.error == undefined) {
    metricsMutation['valid_nb'] = m.valid_nb + 1
  } else {
    metricsMutation['errors_nb'] = m.errors_nb + 1
    metricsMutation['error'] = m.error || ''
    metricsMutation['error'] += char
  }

  const metrics = {...m, ...metricsMutation}
  return {...state, metrics}
}


// Backspace only wipes out a typed character, valid or invalid, but does not
// alter cumulative metrics.
function processBackspace(state: AppState): AppState {
  let m = state.metrics
  let t = state.text
  let metricsMutation = {}

  if (m.error) {
    const new_error = m.error.substring(0, m.error.length-1)
    metricsMutation['error'] = new_error.length ? new_error : undefined
  } else {
    metricsMutation['valid_nb'] = m.valid_nb > 0 ? m.valid_nb - 1 : 0
  }

  const metrics = {...m, ...metricsMutation}
  return {...state, metrics}
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
  switch (char) {
    case 'Backspace':
      return processBackspace(state)
    case 'Escape':
      return processEscape(state)
    default:
      return processLetter(char, state)
  }
}

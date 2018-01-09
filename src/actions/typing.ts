import xs from "xstream"

import * as Model from '../model'

// TypingAction: handles actions related to the user typing text.
export default class TypingAction {
  // Compute an app state's mutation proposal.
  process(char) {
    if (char == 'Backspace') {
      return this.process_backspace()
    } else {
      return this.process_letter(char)
    }
  }

  private process_letter(char) {
    const app_state = Model.Singleton.get().attributes
    let mutation = {}
    mutation['keystrokes_nb'] = app_state.keystrokes_nb + 1
    if (app_state.text.text[app_state.valid_nb] == char && app_state.error == undefined) {
      mutation['valid_nb'] = app_state.valid_nb + 1
    } else {
      mutation['errors_nb'] = app_state.errors_nb + 1
      mutation['error'] = app_state.error || ''
      mutation['error'] += char
    }
    return {...app_state, ...mutation}
  }

  private process_backspace() {
    const app_state = Model.Singleton.get().attributes
    let mutation = {}
    mutation['keystrokes_nb'] = app_state.keystrokes_nb > 0 ? app_state.keystrokes_nb - 1 : 0
    mutation['errors_nb'] = app_state.errors_nb > 0 ? app_state.errors_nb - 1 : 0
    if (app_state.error) {
      const new_error = app_state.error.substring(0, app_state.error.length-1)
      mutation['error'] = new_error.length ? new_error : undefined
    } else {
      mutation['valid_nb'] = app_state.valid_nb > 0 ? app_state.valid_nb - 1 : 0
    }
    return {...app_state, ...mutation}
  }
}

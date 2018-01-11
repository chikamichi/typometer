import xs from "xstream"

import * as Model from '../model'

// TypingAction: handles actions related to the user typing text.
export default class TypingAction {
  readonly app_state: Model.Singleton

  constructor() {
    this.app_state = Model.Singleton.get()
  }

  // Compute an app state's mutation proposal.
  process(char?) {
    if (this.app_state.isDone()) {
      if (this.app_state.attributes.stop) return this.app_state.attributes
      return {...this.app_state.attributes, ...{stop: new Date()}}
    }
    if (char == 'Backspace') {
      return this.process_backspace()
    } else {
      return this.process_letter(char)
    }
  }

  private process_letter(char) {
    let mutation = {}
    const app_state = this.app_state.attributes
    if (!app_state.start)
      mutation['start'] = new Date()
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
    let mutation = {}
    const app_state = this.app_state.attributes
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

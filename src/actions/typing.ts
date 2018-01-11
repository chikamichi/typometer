import xs from "xstream"

import * as Model from '../model'

// TypingAction: handles actions related to the user typing text.
export default class TypingAction {
  readonly app_state: Model.Singleton
  char: string

  constructor(char?: string) {
    this.app_state = Model.Singleton.get()
    this.char = char
  }

  // Compute an app state's mutation proposal after a valid key was pressed.
  process() {
    if (this.app_state.isDone()) {
      if (this.app_state.attributes.stop) return this.app_state.attributes
      return {...this.app_state.attributes, ...{stop: new Date()}}
    }
    switch (this.char) {
      case 'Backspace':
        return this.process_backspace()
      case 'Escape':
        return this.process_escape()
      default:
        return this.process_letter()
    }
  }

  private process_letter() {
    let mutation = {}
    const a = this.app_state.attributes
    if (!a.start)
      mutation['start'] = new Date()
    mutation['keystrokes_nb'] = a.keystrokes_nb + 1
    if (a.text.text[a.valid_nb] == this.char && a.error == undefined) {
      mutation['valid_nb'] = a.valid_nb + 1
    } else {
      mutation['errors_nb'] = a.errors_nb + 1
      mutation['error'] = a.error || ''
      mutation['error'] += this.char
    }
    return {...a, ...mutation}
  }

  private process_backspace() {
    let mutation = {}
    const a = this.app_state.attributes
    mutation['keystrokes_nb'] = a.keystrokes_nb > 0 ? a.keystrokes_nb - 1 : 0
    mutation['errors_nb'] = a.errors_nb > 0 ? a.errors_nb - 1 : 0
    if (a.error) {
      const new_error = a.error.substring(0, a.error.length-1)
      mutation['error'] = new_error.length ? new_error : undefined
    } else {
      mutation['valid_nb'] = a.valid_nb > 0 ? a.valid_nb - 1 : 0
    }
    return {...a, ...mutation}
  }

  private process_escape() {
    return Model.Singleton.clear()
  }
}

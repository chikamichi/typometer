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

    // if (!a.start) // first char was typed!
    if (this.app_state.isNew())
      mutation['start'] = new Date()

    if (this.app_state.isDone())
      mutation['stop'] = new Date()

    mutation['keystrokes_nb'] = a.keystrokes_nb + 1

    // TODO: hide in Model getters to improve readibility
    if (a.text.text[a.valid_nb] == this.char && a.error == undefined) {
      mutation['valid_nb'] = a.valid_nb + 1
    } else {
      mutation['errors_nb'] = a.errors_nb + 1
      mutation['error'] = a.error || ''
      mutation['error'] += this.char
    }

    return {...a, ...mutation}
  }


  // Backspace only wipes out a typed character, valid or invalid, but does not
  // alter cumulative metrics.
  private process_backspace() {
    let mutation = {}
    const a = this.app_state.attributes

    if (a.error) {
      const new_error = a.error.substring(0, a.error.length-1)
      mutation['error'] = new_error.length ? new_error : undefined
    } else {
      mutation['valid_nb'] = a.valid_nb > 0 ? a.valid_nb - 1 : 0
    }

    return {...a, ...mutation}
  }


  private process_escape() {
    return Model.Singleton.stop()
  }
}

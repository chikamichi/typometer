import xs from "xstream"

import TargetText from "../target_text"
import * as Model from '../model'

export class NewTextAction {
  text: string

  constructor(text: string) {
    this.text = text
  }

  process() {
    const new_text = new TargetText(this.text)
    console.log('action/new_text')
    Model.Singleton.clear(new_text)
  }
}

// TypingAction: handles actions related to the user typing text.
export class TypingAction {
  readonly app_state: Model.Singleton
  char: string

  constructor(char?: string) {
    this.app_state = Model.Singleton.get()
    this.char = char
  }

  // Compute an app state's mutation proposal.
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
    const app_state = this.app_state.attributes
    if (!app_state.start)
      mutation['start'] = new Date()
    mutation['keystrokes_nb'] = app_state.keystrokes_nb + 1
    if (app_state.text.text[app_state.valid_nb] == this.char && app_state.error == undefined) {
      mutation['valid_nb'] = app_state.valid_nb + 1
    } else {
      mutation['errors_nb'] = app_state.errors_nb + 1
      mutation['error'] = app_state.error || ''
      mutation['error'] += this.char
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

  private process_escape() {
    console.log('action/new_char/process_escape')
    return Model.Singleton.clear()
  }
}

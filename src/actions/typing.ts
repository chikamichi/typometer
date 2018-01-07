import xs from "xstream"

import * as Model from '../model'

// TypingAction: handles actions related to the user typing text.
export default class TypingAction {
  static void() {
    return Model.INITIAL_APP_STATE
  }

  // Compute an app state's mutation proposal.
  process(text, char) {
    const dataset = Model.Singleton.get().attributes
    let new_dataset = {}
    new_dataset['keystrokes_nb'] = dataset.keystrokes_nb + 1
    if (text[dataset.valid_nb] == char) {
      new_dataset['valid_nb'] = dataset.valid_nb + 1
    } else {
      new_dataset['errors_nb'] = dataset.errors_nb + 1
    }
    return {...dataset, ...new_dataset}
  }
}

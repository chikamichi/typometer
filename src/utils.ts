import { AppState } from "typometer/types"

export const APP_TITLE = "typometer"

export const APP_MOTTO = "Can you type that fast?"

// export const DEFAULT_TEXT: string = "Quelle est la planète dont les habitants ne préfèreraient pas une croyance confortable, douillette et bien rodée, si illogique soit-elle, aux vents frisquets de l'incertitude ?"
export const DEFAULT_TEXT: string = "A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable."
// export const DEFAULT_TEXT: string = "test"

// A word is 5 consecutive characters. WPM convention.
// @see https://en.wikipedia.org/wiki/Words_per_minute
export const WORD_LENGTH = 5

export const INITIAL_APP_STATE: AppState = {
  text: {
    raw: DEFAULT_TEXT,
    editing: false
  },
  metrics: {
    start: undefined,
    stop: undefined,
    current_char: undefined,
    keystrokes_nb: 0,
    valid_nb: 0,
    errors_nb: 0,
    replay_nb: 0,
    error: ''
  },
  records: {
    pending: true,
    accuracy: 0,
    wpm: 0
  }
}

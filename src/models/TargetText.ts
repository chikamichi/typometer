import xs, { Stream } from "xstream"

import { AppState, CharState } from "typometer/types"

export default class TargetText {
  text: string
  state: AppState

  constructor(text: string, state: AppState) {
    this.text = text
    this.state = state
  }

  // TODO: the logic in as_stream() and wrap() doesn't really belong to
  // TargetText: it's all about making the text live, so LiveText instead?
  as_stream(): Stream<CharState> {
    const m = this.state.metrics
    const tuples = [] as CharState[]

    for (let char of this.text.substring(0, m.valid_nb))
      tuples.push({char: char, isValid: true, isError: false})

    if (m.error)
      for (let char of m.error)
        tuples.push({char: char, isValid: false, isError: true})

    for (let char of this.text.substring(m.valid_nb, this.text.length))
     tuples.push({char: char, isValid: false, isError: false})

    tuples.forEach((tuple, index) => {
      tuple['isReplayed'] = index < m.replay_nb + (m.error ? m.error.length : 0)
      tuple['isNext'] = m.keystrokes_nb == 0
        ? index == 0
        : index == m.valid_nb + (m.error||'').length
    })

    return xs.fromArray(tuples)
  }

  wrap(callback) {
    const wrapped_text = []

    this.as_stream()
      .fold((acc, char) => {
        acc.push(callback(char))
        return acc
      }, wrapped_text) // so far, a lazy, idle stream…
      .addListener({}) // triggers events emission thus folding of values

    return wrapped_text
  }
}

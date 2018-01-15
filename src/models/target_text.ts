import xs from "xstream"

import * as Model from "model"

export default class TargetText {
  text: string

  constructor(supplied_text: string) {
    this.text = supplied_text
  }

  // TODO: the logic in as_stream() and wrap() doesn't really belong to
  // TargetText: it's all about making the text live, so LiveText instead?
  as_stream() {
    const a = Model.Singleton.get().attributes
    const tuples = []
    for (let char of this.text.substring(0,a.valid_nb))
      tuples.push({char: char, isValid: true, isError: false})
    if (a.error)
      for (let char of a.error)
        tuples.push({char: char, isValid: false, isError: true})
    for (let char of this.text.substring(a.valid_nb,this.text.length))
     tuples.push({char: char, isValid: false, isError: false})
    tuples.forEach((tuple, index) => {
      tuple['isReplayed'] = index < a.replay_nb + (a.error ? a.error.length : 0)
      tuple['isNext'] = a.keystrokes_nb == 0 ? index == 0 : index == a.valid_nb + (a.error||'').length
    })
    return xs.fromArray(tuples)
  }

  // cb receives a tuple {char: string, isValid: bool, isError: bool, isReplayed}.
  wrap(cb) {
    const wrapped_text = []
    this.as_stream()
      .fold((acc, char) => {
        acc.push(cb(char))
        return acc
      }, wrapped_text) // so far, a lazy, idle stream…
      .addListener({}) // triggers events emission thus folding of values
    return wrapped_text
  }
}

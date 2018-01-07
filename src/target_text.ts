import xs from "xstream"

export default class TargetText {
  text: string

  constructor(supplied_text: string) {
    this.text = supplied_text
  }

  stream() {
    return xs.fromArray(Array.from(this.text))
  }

  wrap(valid_char_nb, cb) {
    const wrapped_text = []
    this.stream()
      .fold((acc, char) => {
        const isValid = acc.length < valid_char_nb
        acc.push(cb(char, isValid))
        return acc
      }, wrapped_text) // so far, a lazy, idle stream…
      .addListener({}) // triggers events emission thus folding of values
    return wrapped_text
  }
}

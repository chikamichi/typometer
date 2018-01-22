import xs, { Stream } from "xstream"

import { AppState, CharState } from "typometer/types"

export default class TargetText {
  private _index: number
  private _fullText: string[]

  constructor(readonly state: AppState) {
    this._index = 0
  }

  [Symbol.iterator]() {
    return {
      next: () => {
        if (this._index < this.fullText.length) {
          return {value: this.charStateAt(this._index++), done: false}
        } else {
          this._index = 0
          return {value: undefined, done: true}
        }
      }
    }
  }

  public map(callback: (CharState) => any): CharState[] {
    const chars = []
    for (let char of this) chars.push(callback(char))
    return chars
  }

  public get fullText(): string[] {
    if (this._fullText) return this._fullText
    const m = this.state.metrics
    const text = this.state.text.raw
    return (this._fullText = [
      ...text.substring(0, m.valid_nb),
      ...(m.error||''),
      ...text.substring(m.valid_nb, text.length)
    ])
  }

  private charStateAt(index: number): CharState {
    const m = this.state.metrics
    const error = m.error || '' // FIXME: undefined as a default value is cumbersome
    return {
      char: this._fullText[index],
      isValid: index < m.valid_nb,
      isError: index >= m.valid_nb && index < m.valid_nb + error.length,
      isReplayed: index < m.replay_nb + error.length,
      isNext: index == m.valid_nb + error.length
    }
  }
}

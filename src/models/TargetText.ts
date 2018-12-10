import { AppState, CharState } from "typometer/types"

export default class TargetText {
  private _index: number
  private _fullText!: string[]

  constructor(readonly data: AppState) {
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

  public map(callback: (charState: CharState) => any): CharState[] {
    const chars: CharState[] = []
    for (let char of this) chars.push(callback(char!))
    return chars
  }

  public get fullText(): string[] {
    if (this._fullText) return this._fullText
    const m = this.data.metrics
    const text = this.data.text.raw
    return (this._fullText = [
      ...text.substring(0, m.valid_nb),
      ...m.error,
      ...text.substring(m.valid_nb, text.length)
    ])
  }

  private charStateAt(index: number): CharState {
    const m = this.data.metrics
    return {
      char: this._fullText[index],
      isValid: index < m.valid_nb,
      isError: index >= m.valid_nb && index < m.valid_nb + m.error.length,
      isTick: index < m.ticks + m.error.length,
      isNext: index == m.valid_nb + m.error.length
    }
  }
}

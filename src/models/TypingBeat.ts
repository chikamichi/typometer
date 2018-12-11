import { Listener } from "xstream"
import { WORD_LENGTH } from "typometer/utils"


export default class TypingBeat {
  period: number // ms
  duration: number
  counter: number
  _uuid!: NodeJS.Timeout 

  constructor(wpm: number, duration: number) {
    this.period = Math.round(60000 / (wpm * WORD_LENGTH))
    this.duration = duration // expressed in "characters" unit
    this.counter = 0
  }

  // https://github.com/staltz/xstream#producer
  get producer() {
    return {
      start: (listener: Listener<number>) => {
        const nextTick = () => {
          this.counter++
          if (this.counter >= this.duration) clearInterval(this._uuid)
          listener.next(this.counter)
        }
        this._uuid = setInterval(nextTick, this.period)
      },
      stop: () => {
        clearInterval(this._uuid)
      }
    }
  }
}

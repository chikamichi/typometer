import { WORD_LENGTH } from "typometer/utils"


// TODO: rename to TickProducer
export default class TypingBeat {
  period: number // ms
  duration: number
  counter: number
  _uuid!: NodeJS.Timeout 

  // TODO: take in an AppState and use start/stop metrics to compute the ideal
  // rythm to compete against own previous run's replay
  // => but that would be averaged, it'd be more interesting to have a replica
  // of rythm on top of mean speed => different technic required
  constructor(wpm, duration) {
    this.period = Math.round(60000 / (wpm * WORD_LENGTH))
    this.duration = duration // expressed in "characters" unit
    this.counter = 0
  }

  get producer() {
    return {
      start: listener => {
        this._uuid = setInterval(() => {
          this.counter++
          if (this.counter >= this.duration) clearInterval(this._uuid)
          listener.next(this.counter)
        }, this.period)
      },
      stop: () => {
        clearInterval(this._uuid)
      }
    }
  }
}

export default class TypingBeat {
  period: number // ms
  counter: number
  _uuid: number

  // TODO: take in an AppState and use start/stop metrics to compute the ideal
  // rythm to compete against own previous run's replay
  // => but that would be averaged, it'd be more interesting to have a replica
  // of rythm on top of mean speed => different technic required
  constructor(wpm) {
    // TODO: make 5 a global, WORD_LENGTH
    this.period = Math.round(60000 / (wpm * 5))
    this.counter = 0
  }

  get producer() {
    return {
      start: listener => {
        listener.next(this.counter++)
        this._uuid = setInterval(() => {
          listener.next(this.counter++)
        }, this.period)
      },
      stop: () => {
        clearInterval(this._uuid)
      }
    }
  }
}

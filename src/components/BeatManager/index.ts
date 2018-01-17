import xs from "xstream"

import Model from "model"
import TypingBeat from "models/TypingBeat"

export default function BeatManager(sources) {
  const wpm$ = sources.DOM
    .select('.ta-replay-settings__range').events('input')
    .map(e => e.target.value)
    .startWith(32) // 1000 ms period ie. 1 char/s

  const run$ = sources.onion.state$
    .filter(state => Model(state).isNew() || Model(state).isSuccess())

  const beat$$ = xs.combine(wpm$, run$)
    .map(([wpm, _]) => {
      const beat = new TypingBeat(wpm)
      return xs.create(beat.producer)
    })

  return {
    WPM: wpm$,
    BEAT: beat$$
  }
}

import xs from "xstream"

import { Sources } from 'typometer/types'
import TypingBeat from "typometer/models/TypingBeat"


export default function BeatManager(sources: Sources) {
  const wpm$ = sources.dom
    .select('.ta-tick-settings__range').events('input')
    .map(e => (<HTMLInputElement>e.target).value)
    .startWith("32") // 1000 ms period ie. 1 char/s

  const run$ = sources.state.stream
    .filter(state => state.isNew() || state.isSuccess())

  const beat$$ = xs.combine(wpm$, run$)
    .map(([wpm, state]) => {
      const beat = new TypingBeat(+wpm, state.data.text.raw.length)
      return xs.create(beat.producer)
    })

  return {
    WPM: wpm$,
    BEAT: beat$$
  }
}

import xs, { Stream } from "xstream"

import { Sources, Sinks } from "typometer/types"
import Model from "typometer/models/Model"
import BeatManager from "typometer/components/BeatManager"
import view from "./view"


export default function Replay(sources: Sources): Sinks {
  const state$ = sources.onion.state$
  // Beat source. Starts as a "Null Object".
  let source$ = xs.create()
  // A subscription to the beat source. Start as a no-op on the null object.
  let subscription = source$.subscribe({})
  // A subscription boolean flag for the beat source. Helps with filtering events.
  let subscribed = true
  // Component's reducer tasked with mutating the app state with latest tick.
  const reducer$ = xs.create()

  const {BEAT: beat$$, WPM: wpm$} = BeatManager(sources)

  // The beat manager emits new replays (beat streams) whenever a new run is
  // about to start. Upon emission, let's update the source.
  beat$$.addListener({
    next: newBeatSource$ => {
      source$.shamefullySendComplete()
      subscription.unsubscribe()
      subscribed = false
      source$ = newBeatSource$ // xs' imitate() doesn't quit fit the bill
    }
  })

  // Upon the user getting started with his run, fire up the current replay.
  state$
    .filter(state => Model(state).hasJustStarted() && !subscribed)
    .addListener({
      next: _ => {
        subscription = source$.subscribe({
          next: tick => {
            reducer$.shamefullySendNext(
              (prevState) => {
                const metrics = {...prevState.metrics, replay_nb: tick}
                return {...prevState, metrics}
              }
            )
          }
        })
        subscribed = true
      }
    })

  const vdom$ = view({state$, wpm$})

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

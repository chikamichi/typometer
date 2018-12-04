import xs, { Stream } from "xstream"

import { Sources, Sinks, Reducer } from "typometer/types"
import Model from "typometer/models/Model"
import BeatManager from "typometer/components/BeatManager"
import view from "./view"

// TODO: this is no replay of the user's last run! Let's rename. It's a
// non-graphical component that updates the state based on a click (beat)
// => Rythm

/**
 * Listens to a regular beat controlled by the WPM setting, and updates the
 * state to notify about the progression (number of accumulated ticks).
 */
export default function Replay(sources: Sources): Sinks {
  const state$ = sources.state.stream
  // Beat source. Starts as a "Null Object".
  let source$ = xs.create()
  // A subscription to the beat source. Start as a no-op on the null object.
  let subscription = source$.subscribe({})
  // A subscription boolean flag for the beat source. Helps with filtering events.
  let subscribed = true
  // Component's reducer tasked with mutating the app state with latest tick.
  const reducer$ = xs.create()

  // The Beat manager exposes two streams:
  // - a stream of beats (ie. each value is itself a stream of ticks, aka. a beat)
  // - a steam of values for the WPM setting
  // It monitors the app's state (text status, WPM setting) and updates those streams.
  const {BEAT: beat$$, WPM: wpm$} = BeatManager(sources)

  // The beat manager emits a new beat (ticks stream) upon launching the app,
  // when a run has completed, or when the WPM setting has changed. Source
  // must then be updated.
  beat$$.addListener({
    next: newBeatSource$ => {
      source$.shamefullySendComplete()
      subscription.unsubscribe()
      subscribed = false
      source$ = newBeatSource$ // xs' imitate() doesn't quit fit the bill
    }
  })

  // Upon the user getting started typing, subscribe to the current beat, which
  // effectively starts the beat's tick producer.
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
    dom: vdom$,
    state: <Stream<Reducer>>reducer$
  }
}

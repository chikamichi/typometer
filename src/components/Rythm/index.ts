import xs, { Stream } from "xstream"

import { Sinks, Reducer, Sources } from "typometer/types"
import State from "typometer/models/State"
import BeatManager from "typometer/components/BeatManager"
import view from "./view"


/**
 * Listens to a regular beat controlled by the WPM setting, and updates the
 * state to notify about the progression (number of accumulated ticks).
 */
export default function Rythm(sources: Sources): Sinks {
  const state$ = sources.state.stream
  // Beat source. Starts as a "Null Object".
  let source$: Stream<number> = xs.create()
  // A subscription to the beat source. Start as a no-op on the null object.
  let subscription = source$.subscribe({})
  // A subscription boolean flag for the beat source. Helps with filtering events.
  let subscribed = true
  // Component's reducer tasked with mutating the app state with latest tick.
  const reducer$ = xs.create() as Stream<Reducer>

  // See usage below.
  const refreshSubscription = () => {
    subscription = source$.subscribe({ next: updateTick })
    subscribed = true
  }
  const updateTick = (tick: number) => {
    const reducer = (prevState: State) => {
      const metrics = {...prevState.data.metrics, ticks: tick}
      return State.from({...prevState.data, metrics})
    }
    reducer$.shamefullySendNext(reducer as Reducer)
  }

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
    .filter(state => state.hasJustStarted() && !subscribed)
    .addListener({ next: refreshSubscription })

  const vdom$ = view({state$, wpm$})

  return {
    name: xs.of('Rythm'),
    dom: vdom$,
    state: reducer$
  }
}

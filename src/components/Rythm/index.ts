import xs, { Stream } from "xstream"

import { Component, Reducer } from "typometer/types"
import { Tick } from "typometer/actions/Rythm"
import BeatManager from "typometer/components/BeatManager"
import view from "./view"


/**
 * Listens to a regular beat controlled by the WPM setting, and updates the
 * state to notify about the progression (number of accumulated ticks).
 */
const Rythm: Component = (sources) => {
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
  const updateTick = (tick: number) => reducer$.shamefullySendNext(Tick(tick))

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
    dom: vdom$,
    state: reducer$
  }
}

Rythm.cname = 'Rythm'

export default Rythm

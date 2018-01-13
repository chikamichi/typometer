/*
Une source ReplayTyping. Elle émet périodiquement des évènements sous la forme
d'un compteur : reproduction de la progression du valid_nb.

Attention, la périodicité, le start et le stop sont à gérer à l'extérieur. Il
faut start quand on détecte un hasJustStarted(), stop quand on on détecte un
hasJustStopped(). Donc il y a nécessité d'avoir un sink app_state$.
ReplayTyping doit donc être un component, donc l'output n'est pas du DOM mais un
stream périodique, replay_typing$$

Ce stream est consommé comme une source par TextWrap, en plus de app_state$,
pour refresh le texte live. Le stream replay$$ est en fait un stream de stream
périodique. Lorsqu'un nouvel event arrive sur replay$$, TextWrap doit :
- s'unsubscribe du précédent replay$ (en cours)
- se subscribe (donc démarrer) le dernier replay$ de replay$$
Ça se passe dans le main() de TextWrap. L'effet de bord du subscribe est de
redéclencher un rendering. Le plus simple serait de
return xs.combine(app_state$, replay$).map(([a, r]) => view(a, r)) ce qui permet
d'avoir tout le temps le dernier a et le dernier r, pour reconstruire la vue.
*/

import xs, { Stream } from "xstream"
import { div, input, VNode } from "@cycle/dom"

import { AppState, Singleton } from "../model"

interface Sources {
  app_state$: Stream<AppState>,
  DOM: Stream<VNode>
}

class TypingBeat {
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

function view(sources) {
  return xs.combine(sources.app_state$, sources.wpm$)
    .map(([app_state, wpm]) =>
      div('.ta-replay', [
        input('.ta-replay__range', {
          attrs: {
            type: 'range',
            min: 1,
            max: 250,
            disabled: !app_state.isNew()
          }
        }),
        div('.ta-replay__speed', wpm + 'WPM')
      ])
    )
}

function BeatManager(sources) {
  const wpm$ = sources.DOM
    .select('.ta-replay__range').events('input')
    .map(e => e.target.value)
    .startWith(32) // 1000 ms period ie. 1 char/s

  const run$ = sources.app_state$
    .filter(app_state => app_state.isNew())

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

export default function ReplayTyping(sources: Sources) {
  const {BEAT: beat$$, WPM: wpm$} = BeatManager(sources)
  // A replay "Null Object" to start with.
  let source = xs.create()
  // A subscription pointer to a specific run's replay (internal source).
  let subscription = source.subscribe({})
  // The component's sink exposing replay ticks.
  const replay$ = xs.create()

  function emit_tick(event) {
    replay$.shamefullySendNext(event + 1) // index is 1-based
  }

  beat$$.addListener({
    next: new_beat => {
      subscription.unsubscribe()
      source = new_beat // imitate?
    }
  })

  // replay$ will emit |---1---2---3---> on a regular basis, as configured by
  // the replay WPM setting.
  replay$.addListener({
    next: i => Singleton.set({replay_nb: i})
  })

  // Upon the user getting started, fire up current replay.
  sources.app_state$
    .filter(app_state => app_state.hasJustStarted())
    .addListener({
      next: _ => {
        subscription = source.subscribe({
          next: emit_tick
        })
      }
    })

  // Upon the user succeeding or cancelling, stop current replay.
  sources.app_state$
    .filter(app_state => app_state.hasStopped())
    .addListener({
      next: _ => {
        source.shamefullySendComplete()
        subscription.unsubscribe()
      }
    })

  // TODO:
  // - upon changing the beat, rebuild a producer and rebuild the source stream
  // - express beat in WPM
  // - fix default value which does not render correctly
  // - add metric: % faster than beat
  const vdom$ = view({...sources, ...{wpm$: wpm$}})

  return {
    TICKS: replay$,
    DOM: vdom$
  }
}

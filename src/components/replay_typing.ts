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
import VNode from "@cycle/dom"

import { AppState, Singleton } from "../model"

interface Sources {
  app_state$: Stream<AppState>
}

class TypingBeat {
  // TODO: take in an AppState and use start/stop metrics to compute the ideal
  // rythm
  constructor() {
  }

  get producer() {
    return {
      start: function(listener) {
        this.counter = 0
        listener.next(this.counter++)
        this.id = setInterval(() => {
          listener.next(this.counter++)
        }, 120)
      },
      stop: function() {
        clearInterval(this.id)
      },
      id: 0
    }
  }
}

export default function ReplayTyping(sources: Sources) {
  // subscription pointer to a specific run's replay (internal source)
  let source = {unsubscribe: () => {}}
  // singleton-replay exposed as sink
  const replay$ = xs.create()

  replay$.addListener({
    next: i => Singleton.set({replay_nb: i})
  })

  // Prepare previous run's replay$ upon user starting a new run.
  // Note: replay$ to be actually started upon TargetText subscribing to it.
  sources.app_state$
    .filter(app_state => app_state.hasJustStarted())
    .addListener({
      next: app_state => {
        // TODO: replay replay$ with a periodic stream based on text, start, stop
        // replay$ should stop once done, so actually use a Producer, defining
        // start and stop.
        // It means we need to have access to the previous run start and stop
        // metrics. I guess the simplest is to simply cache previous run's
        // metrics entirely in the current state; or a dedicated stream could
        // be used (memory-stream).
        const beat = new TypingBeat().producer
        source = xs.create(beat).subscribe({
          next: event => replay$.shamefullySendNext(event + 1) // index is 1-based
        })
      }
    })

  // Stop current replay upon user succeeding or cancelling.
  sources.app_state$
    .filter(app_state => app_state.hasJustStopped())
    .addListener({
      next: app_state => source.unsubscribe()
    })

  // Stop current replay upon reaching the end of the text.
  replay$
    .filter(tick => tick == Singleton.get().attributes.text.text.length)
    .addListener({
      next: app_state => source.unsubscribe()
    })

  return {
    TICKS: replay$
  }
}

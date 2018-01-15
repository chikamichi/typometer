import classnames from "classnames"
import xs, { Stream } from "xstream"
import delay from "xstream/extra/delay"
import isolate from "@cycle/isolate"
import { h, h1, h2, div, p, span, input,
  textarea, ul, li, table, thead, tbody, tr, th, td,
  VNode } from "@cycle/dom"

import * as Model from "model"
import TargetText from "models/target_text"
import NewTextAction from "actions/new_text"
import TypingAction from "actions/typing"

import CustomText from "components/custom_text"
import LiveText from "components/live_text"
import ReplayTyping from "components/replay_typing"


const default_text = "Ils se trouvaient dans la salle de radio - dont l'appareillage, par mille détails subtils, donnait déjà l'impression d'être démodé pour être resté inutilisé pendant dix ans avant leur arrivée. Oui, dix ans, sur le plan technique, cela comptait énormément. Il suffisait de comparer Speedy au modèle de 2005. Mais on en était arrivé au stade où les robots se perfectionnaient à une allure ultrarapide. Powell posa un doigt hésitant sur une surface métallique qui avait conservé son poli. L'atmosphère d’abandon qui imprégnait tous les objets contenus dans la pièce - et la Station tout entière - avait quelque chose d’infiniment déprimant."
Model.Singleton.set({text: new TargetText(default_text)})


// Intent: computes mutation proposals based on raw events.
function intent(sources) {
  const new_text$ = sources.CUSTOM_TEXT
    .filter(e => e.type == 'custom_text.edited')
    .map(e => new NewTextAction(e.data))

  const new_char$ = sources.DOM
    .select('document').events('keydown')
    .filter(e => !/^(Dead)/.test(e.key))
    .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
    .map(e => new TypingAction(e.key))

  return xs
    .merge(new_text$, new_char$)
    .map(action => action.process())
}


// Model: mutates app state based on proposed mutation.
function model(mutation_proposal$) {
  return mutation_proposal$
    .map((mutation_proposal: Model.AppState) => {
      // Basically auto-accept proposed mutations for now.
      return Model.Singleton.set(mutation_proposal)
    })
}

interface ViewSources {
  app_state$: Stream<Model.AppState>,
  custom_text$: Stream<VNode>,
  live_text$: Stream<VNode>,
  replay$: Stream<VNode>
}


// View: decorates app state and re-renders in place.
function view(sources: ViewSources) {
  return xs.combine(
    sources.app_state$,
    sources.custom_text$,
    sources.live_text$,
    sources.replay$
  ).map(([app_state, ...remainder]) => [(new Model.Decorator(app_state)).decorate(), ...remainder])
   .map(([
     attributes,
     custom_text,
     live_text,
     replay_settings
   ]) =>
      div('.typing-app.ta', [
        div('.ta-side', [
          h1('.ta-title', 'typometer'),
          div('.ta-settings', [
            h2('Settings'),
            h(replay_settings.sel, replay_settings.data, replay_settings.children),
          ])
        ]), // .ta-side

        div('.ta-main', [

          div('.ta-header', [

            table('.ta-metrics', [
              thead('.ta-metrics__types', [
                tr([
                  th('Metrics:'),
                  th('Accuracy'),
                  th('WPM')
                ])
              ]),
              tbody('.ta-metrics__values', [
                tr('.ta-metrics__best', [
                  td('.ta-metrics__best-value', 'Best:'),
                  td('.ta-metric  .ta-metric--accuracy  .ta-metric__best-value  .ta-metric__best-value--accuracy', attributes.records.accuracy + '%'),
                  td('.ta-metric  .ta-metric--wpm  .ta-metric__best-value  .ta-metric__best-value--wpm', attributes.records.wpm)
                ]),
                tr('.ta-metrics__current', [
                  td('.ta-metrics__current-value', 'Current:'),
                  td('.ta-metric  .ta-metric--accuracy  .ta-metric__current-value  .ta-metric__current-value--accuracy', attributes.accuracy + '%'),
                  td('.ta-metric  .ta-metric--wpm  .ta-metric__current-value  .ta-metric__current-value--wpm', attributes.wpm),
                ])
              ])
            ])

            // div(classnames('.ta-progress .ta-progress--done', {'.u-wip': !attributes.done}), ' Done!')

          ]), // .ta-header

          div('.ta-content', [
            h(live_text.sel, live_text.data, live_text.children),
            h(custom_text.sel, custom_text.data, custom_text.children)
          ]), // .ta-content

        ]) // .ta-main

      ]) // .ta
    )
}


// Next-action-predicate aka. internal side-effect handler.
//
// Computes any required side-effect and pushes it down the pipe.
// A side-effect could be:
// - a mutation proposal
// - an emulated user-action (resulting in a mutation proposal)
// - an effect on some external asset with no internal consequence whatsoever
//
// The last use-case is more suited to sources-less drivers so should be avoided.
// Emulated user-action are better handled outside the intent() function due to
// stream wiring. Therefore, such actions must be pre-processed here as a
// mutation proposal and exposed as such.
function nap(app_state$) {
  // Typing is over but stats (model decoration) are still pending: trigger
  // updates and re-rendering with a fake keypress.
  const compute_wpm$ = app_state$
    .filter(_ => {
      return Model.Singleton.get().isDone()
        && !Model.Singleton.get().attributes.stop
    })
    .map(app_state => (new TypingAction).process())

  // Once everything is over, including stats computation/display, let's reset
  // everything after a short delay so the user may retry.
  const auto_reset$ = app_state$
    .filter(_ => {
      return Model.Singleton.get().isDone()
        && Model.Singleton.get().attributes.stop
    })
    .compose(delay(2000))
    .map(_ => Model.Singleton.clear())

  // User has stopped, must reset state.
  const manual_reset$ = app_state$
    .filter(_ => {
      return Model.Singleton.get().hasStopped()
    })
    .map(_ => Model.Singleton.clear())

  return xs.merge(
    compute_wpm$,
    auto_reset$,
    manual_reset$
  ).startWith(undefined)
}


// Main: wires everything up using circular streams.
// Note: next-action-predicates bypass the intent() layer by design.
export default function Core(sources) {
  // TODO: sources.onion.state$
  let app_state$ = xs.create()
  let custom_text_bus$ = xs.create()
  const action$ = intent({...sources, ...{app_state$: app_state$, CUSTOM_TEXT: custom_text_bus$}})
  const mutation_proposal$ = xs.merge(sources.NAP, action$)

  app_state$.imitate(model(mutation_proposal$))

  const custom_text$ = isolate(CustomText)({app_state$: app_state$, DOM: sources.DOM})
  custom_text_bus$.imitate(custom_text$.BUS)
  const replay$ = isolate(ReplayTyping)({app_state$: app_state$, DOM: sources.DOM})
  const live_text$ = isolate(LiveText)({app_state$: app_state$, replay$: replay$})

  const vtree$ = view({
    app_state$: app_state$,
    custom_text$: custom_text$.DOM,
    live_text$: live_text$.DOM,
    replay$: replay$.DOM
  })

  const nap$ = nap(app_state$)

  return {
    DOM: vtree$,
    NAP: nap$ // next-action-predicate aka. internal side-effects
  }
}

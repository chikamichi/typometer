import xs, { Stream } from "xstream"
import { h, p, span, VNode } from "@cycle/dom"
import classnames from "classnames"

import { AppState, Sources, Sinks, Reducer, CharState } from "types"
import TargetText from "models/target_text"
import TypingAction from "actions/typing"
import Model from "model"

// interface Sources {
//   app_state$: Stream<AppState>,
//   replay$: {
//     TICKS: Stream<number>
//   }
// }


function build_char(char: CharState): VNode {
  const kls = classnames('.ta-char', {
    '.ta-char--valid': char.isValid,
    '.ta-char--error': char.isError,
    '.ta-char--replay': char.isReplayed,
    '.ta-char--next': char.isNext
  })
  return span(kls, char.char)
}


// TODO: extract newChar intent from Core to this component
function intent(sources: Sources) {
  return {
    newChar$: sources.DOM
      .select('document').events('keydown')
      .filter(e => !/^(Dead|F2)/.test(e.key))
      .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
      .map(e => e.key)
  }
}


function model(actions): Stream<Reducer> {
  return actions.newChar$
    .map(newChar => {
      return function newCharReducer(prevState) {
        return TypingAction(newChar, prevState)
      }
    })
}


function view(state$: Stream<AppState>): Stream<VNode> {
  return state$.map(state => {
    const text = new TargetText(state.text.raw, state)
    const chars = text.wrap(build_char)
    return p('.ta-target-text', {attrs: {tabindex: 0}}, chars)
  })
}


export default function LiveText(sources: Sources): Sinks {
  // const vdom$ = xs.merge(sources.app_state$, sources.replay$.TICKS)
  //   .map(event => {
  //     const chars = Singleton.get().attributes.text.wrap(build_char)
  //     return p('.ta-target-text', {tabindex: 0}, chars)
  //   })

  const actions = intent(sources)
  const reducer$ = model(actions)

  const vdom$ = view(sources.onion.state$)

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

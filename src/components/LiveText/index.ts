import { Sources, Sinks } from "typometer/types"
import intent from "./intent"
import model from "./model"
import view from "./view"

// interface Sources {
//   app_state$: Stream<AppState>,
//   replay$: {
//     TICKS: Stream<number>
//   }
// }


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

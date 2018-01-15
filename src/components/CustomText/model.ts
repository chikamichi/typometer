import xs, { Stream } from "xstream"

import { Reducer } from "types"
import { INITIAL_APP_STATE } from "utils"


export default function model(actions): Stream<Reducer> {
  const focusChange$ = actions.focus$
    .map(_ => function focusChange(state) {
      const text = {
        ...INITIAL_APP_STATE.text,
        editing: true
      }
      return {
        ...state,
        text: text
      }
    })

  const blur$ = actions.blur$
    .map(newText => function blur(_) {
      const text = {
        ...INITIAL_APP_STATE.text,
        raw: newText.trim()
      }
      return {
        ...INITIAL_APP_STATE,
        text: text
      }
    })

  return xs.merge(
    focusChange$,
    blur$
  )
}

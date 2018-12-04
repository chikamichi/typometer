import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import Model from "typometer/models/Model"


export default function model(actions): Stream<Reducer> {
  const focusChange$ = actions.focus$
    .map(_ => function focusChange(state) {
      const text = {
        ...state.text,
        editing: true
      }
      return {
        ...state,
        text
      }
    })

  const blur$ = actions.blur$
    .map(newText => function blur(_) {
      newText = newText.trim()
      if (!newText.length) return INITIAL_APP_STATE
      const text = {
        ...INITIAL_APP_STATE.text,
        raw: newText
      }
      return {
        ...INITIAL_APP_STATE,
        text
      }
    })

  const toggleEditor$ = actions.toggleEditor$
    .map(toggling => function openEditor(state) {
      const model = Model(state)
      if (!model.isNew()) return state
      const text = {
        ...state.text,
        editing: toggling
      }
      return {
        ...state,
        text
      }
    })

  return <Stream<Reducer>>xs.merge(
    focusChange$,
    blur$,
    toggleEditor$
  )
}

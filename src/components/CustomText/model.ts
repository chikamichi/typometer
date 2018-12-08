import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import Model from "typometer/models/Model"
import { CustomTextActions } from "./intent"
import { isAppState } from "typometer/utils/guards";


export default function model(actions: CustomTextActions): Stream<Reducer> {
  const reducers: Stream<Reducer>[] = []

  reducers.push(actions.focus$
    .map(_ => function focusChange(state) {
      if (!isAppState(state)) return state
      const text = {
        ...state.text,
        editing: true
      }
      return {
        ...state,
        text
      }
    } as Reducer)
  )

  reducers.push(actions.blur$
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
    } as Reducer)
  )

  reducers.push(actions.toggleEditor$
    .map(toggling => function openEditor(state) {
      if (!isAppState(state)) return state
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
    } as Reducer)
  )

  return xs.merge(...reducers)
}

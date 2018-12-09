import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import State from "typometer/models/State"
import { EditorActions } from "./intent"


export default function model(actions: EditorActions): Stream<Reducer> {
  const reducers: Stream<Reducer>[] = []

  // TODO: extract reducing functions to src/reducers/
  reducers.push(actions.focus$
    .map(_ => function focusChange(state: State) {
      const text = {
        ...state.data.text,
        editing: true
      }
      return State.from({
        ...state.data,
        text
      })
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
      return State.from({
        ...INITIAL_APP_STATE,
        text
      })
    } as Reducer)
  )

  reducers.push(actions.toggleEditor$
    .map(toggling => function openEditor(state: State) {
      if (!state.isNew()) return state
      const text = {
        ...state.data.text,
        editing: toggling
      }
      return State.from({
        ...state.data,
        text
      })
    } as Reducer)
  )

  return xs.merge(...reducers)
}

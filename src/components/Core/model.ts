import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import { CoreActions } from './nap'
import InitialStateReducer from 'typometer/reducers/InitialState'
import * as Actions from 'typometer/actions/Core'

// Model: map actions to state reducers.
export default function model(actions: CoreActions): Stream<Reducer> {
  const initialState$ = xs.of(InitialStateReducer)

  const success$ = actions.success$.map(Actions.Success)

  // // Triggers when the user made a(t least one) mistake while typing the text.
  // const textStatusKO$ = actions.textStatusKO$
  //   .map(_ => {
  //     return ((prevState: State) => {
  //       return prevState
  //     }) as Reducer
  //   })

  // // Triggers when the user starts typing the text.
  // const textStatusEditing$ = actions.textStatusEditing$
  //   .map(_ => {
  //     return ((prevState: State) => {
  //       return prevState
  //     }) as Reducer
  //   })

  const computeRecords$ = actions.computeRecords$.map(Actions.ComputeRecords)

  const reducers: Stream<Reducer>[] = []
  reducers.push(
    initialState$,
    success$,
    // textStatusKO$,
    // textStatusEditing$,
    computeRecords$
  )
  return xs.merge(...reducers)
}

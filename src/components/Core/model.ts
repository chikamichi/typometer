import xs, { Stream } from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'

import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import { CoreActions } from './nap'
import InitialStateReducer from 'typometer/reducers/InitialState'
import * as Actions from 'typometer/actions/Core'

// Model: map actions to state reducers.
export default function model(actions: CoreActions, state$: Stream<State>): Stream<Reducer> {
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

  // const computeRecords$ = actions.computeRecords$.map(Actions.ComputeRecords)
  const computeRecords$ = actions.computeRecords$.compose(sampleCombine(state$))
                                                 .map(([_, state]) => state.data.records)
                                                 .map(Actions.ComputeRecords)

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

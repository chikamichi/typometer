import xs, { Stream } from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'

import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import InitialStateReducer from 'typometer/reducers/InitialState'
import * as Actions from 'typometer/actions/Core'


export interface CoreActions {
  success$: Stream<boolean>,
  computeRecords$: Stream<boolean>
}

type Tuple = [any, State] 

export default function model(actions: CoreActions, state$: Stream<State>): Stream<Reducer> {
  const initialState$ = xs.of(InitialStateReducer)

  const success$ = actions.success$.map(Actions.Success)

  const computeRecords$ = actions.computeRecords$
    .compose(sampleCombine(state$))
    .map(([_, state]: Tuple) => state.data.records)
    .map(Actions.ComputeRecords)

  const reducers: Stream<Reducer>[] = []
  reducers.push(
    initialState$,
    success$,
    computeRecords$
  )
  return xs.merge(...reducers)
}

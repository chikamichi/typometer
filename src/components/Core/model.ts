import xs, { Stream } from "xstream"
import sampleCombine from 'xstream/extra/sampleCombine'

import { Reducer, Model } from "typometer/types"
import State from 'typometer/models/State'
import InitialStateReducer from 'typometer/reducers/InitialState'
import * as Actions from 'typometer/actions/Core'


export interface CoreActions {
  success$: Stream<boolean>,
  computeRecords$: Stream<boolean>,
  reset$: Stream<boolean>
}

type Tuple = [any, State] 

const model: Model = (actions: CoreActions, state$) => {
  const initialState$ = xs.of(InitialStateReducer)

  const success$ = actions.success$.map(Actions.Success)

  const reset$ = actions.reset$.map(Actions.Reset)

  const computeRecords$ = actions.computeRecords$
    .compose(sampleCombine(state$!))
    .map(([_, state]: Tuple) => state.data.records)
    .map(Actions.ComputeRecords)

  const reducers: Stream<Reducer>[] = []
  reducers.push(
    initialState$,
    success$,
    reset$,
    computeRecords$
  )
  return xs.merge(...reducers)
}

export default model

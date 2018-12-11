import xs, { Stream } from "xstream"

import { Reducer, Model } from "typometer/types"
import InitialStateReducer from 'typometer/reducers/InitialState'
import * as Actions from 'typometer/actions/Core'


export interface CoreActions {
  reset$: Stream<boolean>
}

const model: Model = (actions: CoreActions, state$) => {
  return xs.merge(
    xs.of(InitialStateReducer),
    actions.reset$.map(Actions.Reset),
    state$!.map(Actions.nap)
  ) as Stream<Reducer>
}

export default model

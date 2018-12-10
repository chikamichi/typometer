import xs, { Stream } from "xstream"

import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import { CoreActions } from './nap'
import InitialStateReducer from 'typometer/reducers/InitialState'

// Model: map actions to state reducers.
export default function model(actions: CoreActions): Stream<Reducer> {
  const initialState$ = xs.of(InitialStateReducer)

  // Triggers when the user is done typing the whole text \o/
  const textStatusOK$ = actions.textStatusOK$
    .map(_ => {
      return ((prevState: State) => {
        const metrics = {...prevState.data.metrics, stop: new Date()}
        return State.from({...prevState.data, metrics})
      }) as Reducer
    })

  // // Triggers when the user made a(t least one) mistake while typing the text.
  // const textStatusKO$ = actions.textStatusKO$
  //   .map(_ => {
  //     return ((prevState: AppState) => {
  //       return prevState
  //     }) as Reducer
  //   })

  // // Triggers when the user starts typing the text.
  // const textStatusEditing$ = actions.textStatusEditing$
  //   .map(_ => {
  //     return ((prevState: AppState) => {
  //       return prevState
  //     }) as Reducer
  //   })

  const computeRecords$ = actions.computeRecords$
    .map(records => {
      return ((prevState: State) => {
        return State.from({
          ...prevState.data,
          records
        })
      }) as Reducer
    })

  const reducers: Stream<Reducer>[] = []
  reducers.push(
    initialState$,
    textStatusOK$,
    // textStatusKO$,
    // textStatusEditing$,
    computeRecords$
  )
  return xs.merge(...reducers)
}

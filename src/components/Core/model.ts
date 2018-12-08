import xs, { Stream } from "xstream"

import { Reducer, AppState } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import { CoreActions } from './nap'

// Model: map actions to state reducers.
export default function model(actions: CoreActions) {
  const initialState$ = xs.of(function initialReducer(prevState: AppState) {
    if (prevState)
      return prevState
    else
      return INITIAL_APP_STATE
  } as Reducer)

  // Triggers when the user is done typing the whole text \o/
  // const textStatusOK$ = actions.textStatusOK$
  //   .map(_ => {
  //     return ((prevState: AppState) => {
  //       const metrics = {...prevState.metrics, stop: new Date()}
  //       return {...prevState, metrics}
  //     }) as Reducer
  //   })

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

  // const computeRecords$ = actions.computeRecords$
  //   .map(records => {
  //     console.log('REDUCER computeRecords$', records)
  //     return ((prevState: AppState) => {
  //       return {
  //         ...prevState,
  //         records
  //       }
  //     }) as Reducer
  //   })

  const reducers: Stream<Reducer>[] = []
  reducers.push(
    initialState$,
    // textStatusOK$,
    // textStatusKO$,
    // textStatusEditing$,
    // computeRecords$
  )
  return xs.merge(...reducers)
}

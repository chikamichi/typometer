import xs, { Stream } from "xstream"

import { Model } from "typometer/types"
import * as Actions from 'typometer/actions/Metrics'


export interface MetricsActions {
  resetRecords$: Stream<boolean>
}

const model: Model = (actions: MetricsActions) => {
  return xs.merge(...[
    actions.resetRecords$.map(Actions.ResetRecords)
  ])
}

export default model

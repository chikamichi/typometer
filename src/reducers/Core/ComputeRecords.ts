import { reduce } from 'ramda'

import State from 'typometer/models/State'
import * as fn from 'typometer/models/Metrics'
import { Reducer, TypingRecords, RecordComputation } from 'typometer/types'


type Records = Record<string, number> // Record aka. Object ^^

/**
 * Run is over and records must be computed.
 *
 * Let's compare latestRecords against run's new metrics. If a metric (or
 * more accurately the potentially new record derived from metric(s)) is
 * greater than the last known record, update its value.
 * 
 * Mutations:
 * - records: default/latest value -> new value (if need be, for each record)
 */
function ComputeRecords(state: State, latestRecords: TypingRecords): State {
  const recordMetrics = Object.keys(latestRecords)
  let records: TypingRecords // updated records, to be computed below

  function updateRecord(acc: Records, metric: string): Records {
    const fnName = 'compute' + metric[0].toUpperCase() + metric.substring(1, metric.length)
    const recordComputation = fn[fnName] as RecordComputation
    if (!recordComputation) return acc
    const newVal = recordComputation(state)
    if (newVal > latestRecords[metric]) acc[metric] = newVal
    return acc
  }

  const newValues = reduce(updateRecord , {} as Records, recordMetrics)
  records = { ...latestRecords, ...newValues, pending: false }

  return State.from({
    ...state.data,
    records
  })
}

export default ComputeRecords as Reducer

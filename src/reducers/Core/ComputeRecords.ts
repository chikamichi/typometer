import { reduce } from 'ramda'

import State from 'typometer/models/State'
import * as fn from 'typometer/models/Metrics'
import { Reducer, TypingRecords, MetricComputation, MetricsObject } from 'typometer/types'


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
const ComputeRecords: Reducer = (state, latestRecords: TypingRecords) => {
  function updateRecord(acc: MetricsObject, metric: string): MetricsObject {
    const fnName = 'compute' + metric[0].toUpperCase() + metric.substring(1, metric.length)
    const metricComputation = fn[fnName] as MetricComputation
    if (metricComputation) {
      const newVal = metricComputation(state!)
      if (newVal > latestRecords[metric]) acc[metric] = newVal
    }
    return acc
  }

  const recordMetrics = Object.keys(latestRecords)
  const newValues = reduce(updateRecord , {} as MetricsObject, recordMetrics)

  return State.from({
    ...state!.data,
    records: { ...latestRecords, ...newValues, pending: false } as TypingRecords
  })
}

export default ComputeRecords

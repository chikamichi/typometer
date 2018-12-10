import { reduce } from 'ramda'

import State from 'typometer/models/State'
import * as fn from 'typometer/models/Metrics'
import { MetricComputation, MetricsObject, DecoratedRunMetrics } from 'typometer/types'


/**
 * Run is ongoing and extended metrics must be computed.
 */
function withExtendedMetrics(state: State): State {
  function updateRecord(acc: MetricsObject, metric: string): MetricsObject {
    const fnName = 'compute' + metric[0].toUpperCase() + metric.substring(1, metric.length)
    const metricComputation = fn[fnName] as MetricComputation
    if (metricComputation) acc[metric] = metricComputation(state)
    return acc
  }

  const extendedMetrics = Object.keys(state.data.records)
  const newValues = reduce(updateRecord , {} as MetricsObject, extendedMetrics)

  return State.from({
    ...state.data,
    metrics: { ...state.data.metrics, ...newValues } as DecoratedRunMetrics
  })
}

export default withExtendedMetrics

import { Stream, MemoryStream } from "xstream"
import { table, thead, tbody, tr, th, td, VNode } from "@cycle/dom"

import State from 'typometer/models/State'


export default function view(state$: MemoryStream<State>): Stream<VNode> {
  return state$
    .map(state => state.decorate().data)
    .map(state => {
      return table('.ta-metrics', [
        thead('.ta-metrics__types', [
          tr([
            th(),
            th('Accuracy'),
            th('WPM')
          ])
        ]),
        tbody('.ta-metrics__values', [
          tr('.ta-metrics__best', [
            td('.ta-metrics__best-value', 'Best:'),
            td('.ta-metric  .ta-metric--accuracy  .ta-metric__best-value  .ta-metric__best-value--accuracy', state.records.accuracy + '%'),
            td('.ta-metric  .ta-metric--wpm  .ta-metric__best-value  .ta-metric__best-value--wpm', state.records.wpm)
          ]),
          tr('.ta-metrics__current', [
            td('.ta-metrics__current-value', 'Current:'),
            td('.ta-metric  .ta-metric--accuracy  .ta-metric__current-value  .ta-metric__current-value--accuracy', state.metrics.accuracy + '%'),
            td('.ta-metric  .ta-metric--wpm  .ta-metric__current-value  .ta-metric__current-value--wpm', state.metrics.wpm),
          ])
        ])
      ])
    })
  }

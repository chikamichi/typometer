import { MemoryStream } from "xstream"

import { WORD_LENGTH } from "typometer/utils"
import { TypingRecords } from "typometer/types"
import State from "typometer/models/State"


export default { // Metrics
  Records: function(state$: MemoryStream<State>): TypingRecords {
    return {
      pending: false,
      accuracy: getMax(state$, 'accuracy', computeAccuracy),
      wpm: getMax(state$, 'wpm', computeWpm)
    }
  },

  Current: function(state: State): TypingRecords {
    return {
      pending: false,
      accuracy: computeAccuracy(state),
      wpm: computeWpm(state)
    }
  }
}

function getMax(state$: MemoryStream<State>, metric: string, f?: (attributes: State) => number): number {
  let record: unknown
  let lastRecord: unknown
  state$
    .subscribe({next: lastState => lastRecord = lastState.data.records[metric]})
    .unsubscribe()
  state$
    .fold((max, state: State) => {
      const new_val = f ? f(state) : state.data.metrics[metric]
      return new_val > (max as number) ? new_val : max
    }, lastRecord || 0)
    .subscribe({next: value => record = value})
    .unsubscribe()
  return record as number
}

export function computeAccuracy(state: State): number {
  if (state.isNew()) return 0
  return Math.round((1 - state.data.metrics.errors_nb / state.data.metrics.keystrokes_nb) * 100)
}

export function computeWpm(state: State): number {
  if (!state.isDoneDone()) return 0
  const nb_words = state.data.metrics.keystrokes_nb / WORD_LENGTH
  const elapsed = (state.data.metrics.stop!.getTime() - state.data.metrics.start!.getTime()) / 1000.0 / 60.0 // ms -> mn
  return Math.round(nb_words / elapsed)
}

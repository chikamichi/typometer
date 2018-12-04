import { Stream } from "xstream"

import { WORD_LENGTH } from "typometer/utils"
import { AppState, TypingRecords } from "typometer/types"
import Model from "typometer/models/Model"


export default { // Metrics
  Records: function(state$: Stream<AppState>): TypingRecords {
    return {
      pending: false,
      accuracy: getMax(state$, 'accuracy', computeAccuracy),
      wpm: getMax(state$, 'wpm', computeWPM)
    }
  },

  Current: function(state: AppState): TypingRecords {
    return {
      pending: false, // FIXME: ajouté mais pas présent à la base
      accuracy: computeAccuracy(state),
      wpm: computeWPM(state)
    }
  }
}

function getMax(state$, metric: string, f?: (attributes?: AppState) => number): number {
  let record, lastRecord
  state$
    .subscribe({next: lastState => lastRecord = lastState.records[metric]})
    .unsubscribe()
  state$
    .fold((max, state) => {
      const new_val = f ? f(state) : state.metrics[metric]
      return new_val > max ? new_val : max
    }, lastRecord || 0)
    .subscribe({next: value => record = value})
    .unsubscribe()
  return record
}

function computeAccuracy(state: AppState): number {
  const model = Model(state)
  if (model.isNew()) return 0
  return Math.round((1 - state.metrics.errors_nb / state.metrics.keystrokes_nb) * 100)
}

function computeWPM(state: AppState): number {
  const model = Model(state)
  if (!model.isSuccess()) return 0
  const nb_words = state.metrics.keystrokes_nb / WORD_LENGTH
  const elapsed = (state.metrics.stop!.getTime() - state.metrics.start!.getTime()) / 1000.0 / 60.0 // ms -> mn
  return Math.round(nb_words / elapsed)
}

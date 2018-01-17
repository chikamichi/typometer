import { Stream } from "@cycle/dom"
import { AppState, TypingRecords } from "types"
import Model from "model"

// TODO: at the end of a run:
// - compute run's metrics with Records(state$.last()) (basically)
// - compute overall metrics with Records(state$)
export default function Records(state$: Stream<AppState>): TypingRecords {
  return {
    pending: false,
    accuracy: getMax(state$, 'accuracy', computeAccuracy),
    wpm: getMax(state$, 'wpm', computeWPM)
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
  if (!model.isSuccess()) return 0
  return Math.round((1 - state.metrics.errors_nb / state.metrics.keystrokes_nb) * 100)
}

function computeWPM(state?: AppState): number {
  const model = Model(state)
  if (!model.isSuccess()) return 0
  const nb_words = state.metrics.keystrokes_nb / 5
  const elapsed = (state.metrics.stop.getTime() - state.metrics.start.getTime()) / 1000.0 / 60.0 // ms -> mn
  return Math.round(nb_words / elapsed)
}
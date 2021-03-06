import { WORD_LENGTH } from "typometer/utils"
import State from "typometer/models/State"


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

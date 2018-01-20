import xs from "xstream"

import { AppState, DecoratedAppState } from "typometer/types"
import Metrics from "typometer/models/Metrics"


// Main "model" for the app, ie. wraps the raw app state, exposing methods for
// state management (mutators, accessors…).
export default function Model(state: AppState): SuperState {
  return new SuperState(state)
}


class SuperState {
  constructor(readonly state: AppState) {
  }

  public newCharMutation(char: string): AppState {
    let m = this.state.metrics
    let metricsMutation = {}

    if (this.hasStopped()) {
      return this.state
    }

    metricsMutation['current_char'] = char
    metricsMutation['keystrokes_nb'] = m.keystrokes_nb + 1

    if (this.isNew())
      metricsMutation['start'] = new Date()

    if (this.isValidChar(char)) {
      metricsMutation['valid_nb'] = m.valid_nb + 1

      if (this.isAboutDone())
        metricsMutation['stop'] = new Date()

    } else {
      metricsMutation['errors_nb'] = m.errors_nb + 1
      metricsMutation['error'] = m.error || ''
      metricsMutation['error'] += char
    }

    const metrics = {...m, ...metricsMutation}
    return {...this.state, metrics}
  }

  public eraseCharMutation(): AppState {
    let m = this.state.metrics
    let metricsMutation = {}

    if (this.hasStopped())
      return this.state

    if (m.error) {
      const new_error = m.error.substring(0, m.error.length-1)
      metricsMutation['error'] = new_error.length ? new_error : undefined
    } else {
      metricsMutation['valid_nb'] = m.valid_nb > 0 ? m.valid_nb - 1 : 0
    }

    const metrics = {...m, ...metricsMutation}
    return {...this.state, metrics}
  }

  public isValidChar(char: string): boolean {
    const t = this.state.text
    const m = this.state.metrics
    return t.raw[m.valid_nb] == char && m.error == undefined
  }

  public isNew(): boolean {
    const m = this.state.metrics
    return !m.start && !m.stop
  }

  // public isRunning(): boolean {
  //   const m = this.state.metrics
  //   return !!m.start && !m.stop
  // }

  // // Upon first character
  public hasJustStarted(): boolean {
    const m = this.state.metrics
    return !!m.start && m.keystrokes_nb == 1
  }

  // Basically done successfully and halted, but on next "frame" update.
  // Useful in edge cases.
  public isAboutDone(): boolean {
    const t = this.state.text
    const m = this.state.metrics
    return t.raw.length == m.valid_nb + 1 && !m.stop
  }

  // Done successfully and halted.
  public isSuccess(): boolean {
    const t = this.state.text
    const m = this.state.metrics
    return t.raw.length == m.valid_nb
  }

  // Done successfully but not yet halted.
  public isDone(): boolean {
    const m = this.state.metrics
    return this.isSuccess() && !m.stop
  }

  public textBeingEdited(): boolean {
    return this.state.text.editing
  }

  // Halted, no matter the outcome.
  public hasStopped(): boolean {
    const m = this.state.metrics
    return !!m.start && !!m.stop // !! Date -> boolean logic
  }

  public hasNoStats(): boolean {
    return this.state.records.pending
  }

  // Running, has error(s).
  public hasError(): boolean {
    const m = this.state.metrics
    return !!m.error
  }

  public decorate(): DecoratedAppState {
    const newMetrics = Metrics.Current(this.state)
    const metrics = {
      ...this.state.metrics,
      accuracy: newMetrics.accuracy,
      wpm: newMetrics.wpm
    }
    return {
      ...this.state,
      metrics
    }
  }
}

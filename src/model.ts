import xs from "xstream"

import { AppState, DecoratedAppState } from "typometer/types"
import Metrics from "typometer/models/Metrics"


export default function Model(state) {
  return new SuperState(state)
}


class SuperState {
  state: AppState

  constructor(state) {
    this.state = state
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

  public eraseCharMutation() {
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
    // return (new Decorator(this)).decorate()
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


export class Decorator {
  model: SuperState

  constructor(model: SuperState) {
    this.model = model
  }

  public decorate(): DecoratedAppState {
    const m = this.model
    const metrics = {
      ...m.state.metrics,
      accuracy: this.compute_accuracy(),
      done: m.isDone() || m.hasStopped(),
      wpm: this.compute_wpm(),
    }
    return {
      ...m.state,
      metrics
    }
  }

  private compute_accuracy(state?: AppState): number {
    const m = state || this.model
    if (m.isNew()) return 0
    return Math.round((1 - m.state.metrics.errors_nb / m.state.metrics.keystrokes_nb) * 100)
  }

  private compute_wpm(state?: AppState): number {
    const m = state || this.model
    if (!m.hasStopped()) return 0
    // nb_words takes into account errors, as keystrokes_nb does not distinguish
    // between valid and invalid characters. This is by design so the WPM is
    // an accurate estimate of efficiency: less errors => better wpm, at
    // constant time.
    const nb_words = m.state.metrics.keystrokes_nb / 5 // bug, see https://github.com/chikamichi/typometer/issues/1
    const elapsed = (m.state.metrics.stop.getTime() - m.state.metrics.start.getTime()) / 1000.0 / 60.0 // ms -> mn
    return Math.round(nb_words / elapsed)
  }
}

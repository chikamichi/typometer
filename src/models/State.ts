import { AppState, DecoratedAppState, DecoratedRunMetrics } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import Metrics from "typometer/models/Metrics"


// A mutation is described as a free-form object… for now.
// TODO: define specific interfaces for each supported mutations.
interface Mutation {
  [key: string]: any
}

export default class State {
  readonly data: AppState

  static from(data: any): State {
    return new State(data)
  }

  constructor(data: AppState) {
    this.data = data
  }

  public newCharMutation(char: string): State {
    let m = this.data.metrics
    let metricsMutation = {} as Mutation

    if (this.hasStopped()) {
      return this
    }

    metricsMutation['current_char'] = char
    metricsMutation['keystrokes_nb'] = m.keystrokes_nb + 1

    if (this.isNew()) metricsMutation['start'] = new Date()

    if (this.isValidChar(char)) {
      metricsMutation['valid_nb'] = m.valid_nb + 1
    } else {
      metricsMutation['errors_nb'] = m.errors_nb + 1
      metricsMutation['error'] = m.error
      metricsMutation['error'] += char
    }

    const metrics = {...m, ...metricsMutation}
    return State.from({...this.data, metrics})
  }

  public eraseCharMutation(): State {
    let m = this.data.metrics
    let metricsMutation = {} as Mutation

    if (this.hasStopped())
      return this

    if (this.hasError()) {
      const new_error = m.error.substring(0, m.error.length-1)
      metricsMutation['error'] = new_error.length ? new_error : INITIAL_APP_STATE.metrics.error
    } else {
      metricsMutation['valid_nb'] = m.valid_nb > 0 ? m.valid_nb - 1 : 0
    }

    const metrics = {...m, ...metricsMutation}
    return State.from({...this.data, metrics})
  }

  public isValidChar(char: string): boolean {
    if (this.hasError()) return false
    const t = this.data.text
    const m = this.data.metrics
    return t.raw[m.valid_nb] == char
  }

  public isNew(): boolean {
    // if (!this.state) return true
    const m = this.data.metrics
    return !m.start && !m.stop
  }

  // public isRunning(): boolean {
  //   const m = this.state.metrics
  //   return !!m.start && !m.stop
  // }

  // // Upon first character
  public hasJustStarted(): boolean {
    const m = this.data.metrics
    return !!m.start && m.keystrokes_nb == 1
  }

  // Basically done successfully and halted, but on next "frame" update.
  // Useful in edge cases.
  // public isAboutDone(): boolean {
  //   const t = this.state.text
  //   const m = this.state.metrics
  //   return t.raw.length == m.valid_nb + 1 && !m.stop
  // }

  // Done successfully, no matter if halted or not.
  public isSuccess(): boolean {
    const t = this.data.text
    const m = this.data.metrics
    return t.raw.length == m.valid_nb
  }

  // Done successfully, yet not halted.
  public isDone(): boolean {
    return this.isSuccess() && !this.hasStopped()
  }

  // Done successfully and halted.
  public isDoneDone(): boolean {
    return this.isSuccess() && this.hasStopped()
  }

  // Text is currently being edited.
  public textBeingEdited(): boolean {
    return this.data.text.editing
  }

  // Halted, no matter the outcome.
  public hasStopped(): boolean {
    const m = this.data.metrics
    return !!m.start && !!m.stop
  }

  // Stats pending
  public hasNoStats(): boolean {
    return this.data.records.pending
  }

  // Check whether has error(s).
  public hasError(): boolean {
    return !!this.data.metrics.error
  }

  // TODO: remove the decorating layer.
  public decorate(): DecoratedAppState {
    const newMetrics = Metrics.Current(this)
    const metrics = <DecoratedRunMetrics>{
      ...this.data.metrics,
      accuracy: newMetrics.accuracy,
      wpm: newMetrics.wpm
    }
    return {
      // ...State.from(this.data).data,
      ...this.data,
      metrics
    }
  }
}

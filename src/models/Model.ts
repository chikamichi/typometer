import { AppState, DecoratedAppState, DecoratedRunMetrics } from "typometer/types"
import { INITIAL_APP_STATE } from "typometer/utils"
import Metrics from "typometer/models/Metrics"


// Main "model" for the app, ie. wraps the raw app state, exposing methods for
// state management (mutators, accessors…).
export default function Model(state: AppState): SuperState {
  return new SuperState(state)
}

// A mutation is described as a free-form object… for now.
// TODO: define specific interfaces for each supported mutations.
interface Mutation {
  [key: string]: any
}

export class SuperState {
  constructor(readonly state: AppState) {
  }

  public newCharMutation(char: string): AppState {
    let m = this.state.metrics
    let metricsMutation = {} as Mutation

    if (this.hasStopped()) {
      return this.state
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
    return {...this.state, metrics}
  }

  public eraseCharMutation(): AppState {
    let m = this.state.metrics
    let metricsMutation = {} as Mutation

    if (this.hasStopped())
      return this.state

    if (this.hasError()) {
      const new_error = m.error.substring(0, m.error.length-1)
      metricsMutation['error'] = new_error.length ? new_error : INITIAL_APP_STATE.metrics.error
    } else {
      metricsMutation['valid_nb'] = m.valid_nb > 0 ? m.valid_nb - 1 : 0
    }

    const metrics = {...m, ...metricsMutation}
    return {...this.state, metrics}
  }

  public isValidChar(char: string): boolean {
    if (this.hasError()) return false
    const t = this.state.text
    const m = this.state.metrics
    return t.raw[m.valid_nb] == char
  }

  public isNew(): boolean {
    // if (!this.state) return true
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
  // public isAboutDone(): boolean {
  //   const t = this.state.text
  //   const m = this.state.metrics
  //   return t.raw.length == m.valid_nb + 1 && !m.stop
  // }

  // Done successfully, no matter if halted or not.
  public isSuccess(): boolean {
    const t = this.state.text
    const m = this.state.metrics
    return t.raw.length == m.valid_nb
  }

  // Done successfully, yet not halted yet.
  public isDone(): boolean {
    const m = this.state.metrics
    return this.isSuccess() && !m.stop
  }

  // Done successfully and halted.
  public isDoneDone(): boolean {
    return this.isSuccess() && this.hasStopped()
  }

  // Text is currently being edited.
  public textBeingEdited(): boolean {
    return this.state.text.editing
  }

  // Halted, no matter the outcome.
  public hasStopped(): boolean {
    const m = this.state.metrics
    return !!m.start && !!m.stop
  }

  // Done successfully, yet no stats computed yet.
  public hasNoStats(): boolean {
    // const m = this.state.metrics
    // const r = this.state.records
    // return this.isSuccess() && !!m.stop && r.pending
    return this.state.records.pending
  }

  // Running, has error(s).
  public hasError(): boolean {
    return !!this.state.metrics.error
  }

  public decorate(): DecoratedAppState {
    const newMetrics = Metrics.Current(this.state)
    const metrics = <DecoratedRunMetrics>{
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

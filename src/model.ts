import TargetText from "./target_text"
import xs, { MemoryStream } from "xstream"

export interface AppState {
  text: TargetText|undefined,
  start: Date|undefined,
  stop: Date|undefined,
  current_char: string|undefined,
  keystrokes_nb: number,
  valid_nb: number,
  errors_nb: number,
  error: string|undefined,
  records: {
    accuracy: number,
    wpm: number
  }|{}
}

export const INITIAL_APP_STATE = {
  text: undefined,
  start: undefined,
  stop: undefined,
  current_char: undefined,
  keystrokes_nb: 0,
  valid_nb: 0,
  errors_nb: 0,
  error: undefined,
  records: {}
}



export class Singleton {
  private static _instance: Singleton;

  attributes$: MemoryStream<AppState>
  attributes: AppState // Last-known, current state. Acts as an getter/accessor.

  constructor(attributes: AppState) {
    this.attributes$ = xs.createWithMemory().startWith(attributes)
    this.attributes$.addListener({
      next: (state) => this.attributes = state
    })
  }

  static set(attributes) {
    this.get()
    // Don't want to import a fullfledged event emitter lib, so shamefully:
    this._instance.attributes$.shamefullySendNext({...this._instance.attributes, ...attributes})
    return this._instance
  }

  static get() {
    this._instance || (this._instance = new this(INITIAL_APP_STATE));
    return this._instance
  }

  isDone() {
    return this.attributes.text.text.length == this.attributes.valid_nb
  }

  static clear() {
    const records = (new Decorator(this._instance)).compute_records()
    const clear_state = {
      ...INITIAL_APP_STATE,
      ...{
        text: this._instance.attributes.text,
        records: records
      }
    }
    this._instance.attributes$.shamefullySendNext(clear_state)
    return this._instance.attributes
  }
}



export class Decorator {
  model: Singleton

  constructor(model: Singleton) {
    this.model = model
  }

  decorate() {
    const a = this.model.attributes
    return {
      ...a,
      ...{
        accuracy: this.compute_accuracy(),
        done: (a.text.text.length == a.valid_nb),
        wpm: this.compute_wpm(),
        records: a.records
      }
    }
  }

  private compute_accuracy(attributes?: AppState): number {
    const a = attributes || this.model.attributes
    if (a.keystrokes_nb == 0) return 0
    return Math.round(a.valid_nb / a.keystrokes_nb * 100)
  }

  private compute_wpm(attributes?: AppState): number {
    const a = attributes || this.model.attributes
    if (!a.stop) return 0
    return Math.round((a.keystrokes_nb / 5) / ((a.stop.getTime() - a.start.getTime()) / 1000 / 60))
  }

  public compute_records() {
    const a$ = this.model.attributes$
    const get_max = (key: string, f?: (attributes?: AppState) => number) => {
      let record = 0;
      a$
        .fold((max, attributes) => {
          const new_val = f ? f(attributes) : attributes[key]
          return new_val > max ? new_val : max
        }, 0)
        .map(max => record = max)
        .addListener({})
      return record
    }
    const records = {
      accuracy: get_max('accuracy', this.compute_accuracy),
      wpm: get_max('wpm', this.compute_wpm)
    }
    return records
  }
}

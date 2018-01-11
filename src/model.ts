import TargetText from "./target_text"
import xs, { MemoryStream } from "xstream"

export interface TypingRecords {
  accuracy: number,
  wpm: number
}

export interface AppState {
  text: TargetText|undefined,
  start: Date|undefined,
  stop: Date|undefined,
  current_char: string|undefined,
  keystrokes_nb: number,
  valid_nb: number,
  errors_nb: number,
  error: string|undefined,
  records: TypingRecords|{}
}

export interface DecoratedAppState extends AppState {
  accuracy: number,
  wpm: number,
  done: boolean
}

export const INITIAL_APP_STATE: AppState = {
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

  attributes$: MemoryStream<AppState> // History of states.
  attributes: AppState // Last-known, current state. Acts as an getter/accessor.

  constructor(attributes: AppState) {
    this.attributes$ = xs.createWithMemory().startWith(attributes)
    this.attributes$.addListener({
      // TODO: could be replaced with get attributes() which would simply fetch
      // the last value from the attributes$ memory-stream
      next: (state) => this.attributes = state
    })
  }

  static set(attributes) {
    if (!attributes || !Object.keys(attributes).length)
      return this._instance
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

  static clear(text?: TargetText) {
    const records = (new Decorator(this._instance)).compute_records()
    const clear_state = {
      ...INITIAL_APP_STATE,
      ...{
        text: text || this._instance.attributes.text,
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

  decorate(): DecoratedAppState {
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

  // Fetch the max value for a specific attribute as cached over time.
  // Decoration attributes are dynamically computed.
  private get_max(key: string, f?: (attributes?: AppState) => number): number {
    const a$ = this.model.attributes$
    let record, last
    const last$ = a$
      .fold((_, attributes) => attributes.records[key], 0)
      .subscribe({next: value => last = value})
    // It's important to unsubscribe ie. destroy stream$ otherwise the
    // computation would be triggered each time a new event is forwarded by
    // this.model.attributes$, with multiple stream$ objects piling up as
    // compute_record() is called.
    last$.unsubscribe()
    const record$ = a$
      .fold((max, attributes) => {
        const new_val = f ? f(attributes) : attributes[key]
        return new_val > max ? new_val : max
      }, last || 0)
      .subscribe({next: value => record = value})
    record$.unsubscribe()
    return record
  }

  public compute_records(): TypingRecords {
    return {
      accuracy: this.get_max('accuracy', this.compute_accuracy),
      wpm: this.get_max('wpm', this.compute_wpm)
    }
  }
}

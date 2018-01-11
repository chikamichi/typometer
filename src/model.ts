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
  error: string|undefined
}

export const INITIAL_APP_STATE = {
  text: undefined,
  start: undefined,
  stop: undefined,
  current_char: undefined,
  keystrokes_nb: 0,
  valid_nb: 0,
  errors_nb: 0,
  error: undefined
}



export class Singleton {
  private static _instance: Singleton;

  attributes$: MemoryStream<AppState>
  attributes: AppState // Last-known, current state. Acts as an getter/accessor.

  constructor(attributes: AppState) {
    this.attributes$ = xs.createWithMemory().startWith(attributes)
    this.attributes$.addListener({
      next: (state) => this.attributes = state,
      error: (err) => console.log(`AppState not persisted: ${err}`),
      complete: () => console.log(`AppState gone.`)
    })
  }

  static set(attributes) {
    this.get()
    // Don't want to import a fullfledged event emitter lib, so shamefully:
    this._instance.attributes$.shamefullySendNext({...this._instance.attributes, ...attributes})
    return this._instance
  }

  static get() {
    return this._instance || (this._instance = new this(INITIAL_APP_STATE));
  }

  isDone() {
    return this.attributes.text.text.length == this.attributes.valid_nb
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
        wpm: this.compute_wpm()
      }
    }
  }

  private compute_accuracy() {
    const a = this.model.attributes
    if (a.keystrokes_nb == 0) return 0
    return Math.round(a.valid_nb / a.keystrokes_nb * 100)
  }

  private compute_wpm() {
    const a = this.model.attributes
    if (!a.stop) return 0
    return Math.round((a.keystrokes_nb / 5) / ((a.stop.getTime() - a.start.getTime()) / 1000 / 60))
  }
}

import TargetText from "./target_text"

export type CurrentChar = string|undefined

export interface AppState {
  text: TargetText|undefined,
  current_char: CurrentChar,
  keystrokes_nb: number,
  valid_nb: number,
  errors_nb: number,
  error: string|undefined
}

export const INITIAL_APP_STATE = {
  text: undefined,
  current_char: '',
  keystrokes_nb: 0,
  valid_nb: 0,
  errors_nb: 0,
  error: undefined
}



export class Singleton {
  private static _instance: Singleton;

  attributes: AppState

  constructor(attributes: AppState) {
    this.attributes = attributes
  }

  public static set(attributes) {
    this.get()
    this._instance.attributes = {...this._instance.attributes, ...attributes}
    return this._instance
  }

  public static get() {
    return this._instance || (this._instance = new this(INITIAL_APP_STATE));
  }
}



export class Decorator {
  model: Singleton

  constructor(model: Singleton) {
    this.model = model
  }

  decorate() {
    return {
      ...this.model.attributes,
      ...{
        accuracy: (() => {
          if (this.model.attributes.keystrokes_nb == 0) return 0
          return Math.round(this.model.attributes.valid_nb / this.model.attributes.keystrokes_nb * 100)
        })()
      }
    }
  }
}

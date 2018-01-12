import xs from "xstream"

import TargetText from "../target_text"
import * as Model from '../model'

export default class NewTextAction {
  text: string

  constructor(text: string) {
    this.text = text
  }

  process() {
    const new_text = new TargetText(this.text)
    Model.Singleton.clear(new_text)
  }
}

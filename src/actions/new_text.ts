import xs from "xstream"

import TargetText from "../models/target_text"
import * as Model from '../model'

export default class NewTextAction {
  text: string

  constructor(text: string) {
    this.text = text
  }

  process() {
    const new_text = new TargetText(this.text)
    // TODO: FIXME: should send .stop() and the text should be picked up
    // automatically in the main view?
    // Also, the text shouldn't be editable during a run => make a CustomText
    // component to handle stuff.
    Model.Singleton.clear(new_text, {records: false})
  }
}

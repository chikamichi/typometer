import xs from "xstream"

import TargetText from "models/TargetText"
import Model from "model"

export default class NewTextAction {
  text: string

  constructor(text: string) {
    this.text = text
  }

  process() {
    const new_text = new TargetText(this.text)
    // TODO: the text shouldn't be editable during a run, handle in CustomText
    return Model.Singleton.clear_mutation(new_text, {records: false})
  }
}

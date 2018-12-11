import xs, { Stream } from "xstream"
import { DOMSource } from "@cycle/dom"

import { LiveTextActions } from './model'


export default function intent(domSource: DOMSource): LiveTextActions {
  const doc = domSource.select('document')
  return {
    newChar$: xs.merge(
      doc.events('keypress'),
      doc.events('keydown').filter(e => /^(Escape|Backspace).*/.test(e.code))
    ).map(e => e.key)
  }
}

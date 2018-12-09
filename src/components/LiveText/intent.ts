import { Stream } from "xstream"
import { DOMSource } from "@cycle/dom"


export interface LiveTextActions {
  newChar$: Stream<string>
}

export default function intent(domSource: DOMSource): LiveTextActions {
  return {
    newChar$: domSource
      .select('document').events('keydown')
      .filter(e => !/^(Dead|F2)/.test(e.key))
      .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
      .map(e => e.key)
  }
}

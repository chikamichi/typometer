import { Stream } from "xstream"
import { Sources } from "typometer/types"


export interface LiveTextActions {
  newChar$: Stream<string>
}

export default function intent(sources: Sources): LiveTextActions {
  return {
    newChar$: sources.dom
      .select('document').events('keydown')
      .filter(e => !/^(Dead|F2)/.test(e.key))
      .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
      .map(e => e.key)
  }
}

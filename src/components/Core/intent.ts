import { Stream } from "xstream"

import { Intent } from 'typometer/types'


export interface CoreActions {
  reset$: Stream<boolean>,
}

const intent: Intent = (domSource): CoreActions => {
  return {
    reset$: domSource
      .select('document').events('keydown')
      .filter(e => e.key == "Escape")
      .map(_ => true)
  }
}

export default intent

import xs from "xstream"

import { Intent } from 'typometer/types'
import { LiveTextActions } from './model'


const intent: Intent = (domSource): LiveTextActions => {
  const doc = domSource.select('document')
  return {
    newChar$: xs.merge(
      doc.events('keypress'),
      doc.events('keydown').filter(e => /^(Escape|Backspace).*/.test(e.code))
    ).map(e => e.key)
  }
}

export default intent

import State from 'typometer/models/State'
import { INITIAL_APP_STATE } from 'typometer/utils'


export default function Blur(newText: string): State {
  newText = newText.trim()

  if (!newText.length) return State.from(INITIAL_APP_STATE)

  const text = {
    ...INITIAL_APP_STATE.text,
    raw: newText
  }

  return State.from({
    ...INITIAL_APP_STATE,
    text
  })
}
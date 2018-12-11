import { Reducer } from 'typometer/types'
import State from 'typometer/models/State'
import { INITIAL_APP_STATE } from 'typometer/utils'


const Blur: Reducer = (_, newText: string) => {
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

export default Blur

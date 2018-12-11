import { Reducer } from 'typometer/types'
import State from 'typometer/models/State'


const Toggle: Reducer = (state, toggling: boolean) => {
  const text = {
    ...state!.data.text,
    editing: toggling
  }

  return State.from({
    ...state!.data,
    text
  })
}

export default Toggle

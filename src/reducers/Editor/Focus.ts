import { Reducer } from 'typometer/types'
import State from 'typometer/models/State'


const Focus: Reducer = (state) => {
  const text = {
    ...state!.data.text,
    editing: true
  }

  return State.from({
    ...state!.data,
    text
  })
}

export default Focus

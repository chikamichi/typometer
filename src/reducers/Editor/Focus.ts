import State from 'typometer/models/State'


export default function Focus(state: State): State {
  const text = {
    ...state.data.text,
    editing: true
  }

  return State.from({
    ...state.data,
    text
  })
}

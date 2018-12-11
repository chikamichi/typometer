import State from 'typometer/models/State'


export default function Toggle(state: State, toggling: boolean): State {
  if (state.isRunning()) return state

  const text = {
    ...state.data.text,
    editing: toggling
  }

  return State.from({
    ...state.data,
    text
  })
}

import { Action } from "typometer/types"
import Toggle from "typometer/reducers/Editor/Toggle"


const action: Action = (toggling: boolean) => {
  return function EditorToggleReducer(state) {
    if (!state) return
    if (state.isRunning()) return state
    return Toggle(state, toggling)
  }
}

export default action

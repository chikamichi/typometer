import { Action } from "typometer/types"
import Focus from "typometer/reducers/Editor/Focus"


const action: Action = () => {
  return function(state) {
    if (!state) return
    return Focus(state)
  }
}

export default action

import { Action } from "typometer/types"
import Blur from "typometer/reducers/Editor/Blur"


const action: Action = (newText: string) => {
  return function(state) {
    return Blur(state, newText)
  }
}

export default action

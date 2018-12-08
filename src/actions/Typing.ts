import { Reducer, AppState } from "typometer/types"
import TextInput from "typometer/reducers/TextInput"


export default function TypingAction(newChar: string) {
  return function newCharReducer(prevState: AppState) {
    return TextInput(prevState, newChar)
  } as Reducer
}

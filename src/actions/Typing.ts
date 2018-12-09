import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import TextInput from "typometer/reducers/TextInput"


export default function TypingAction(newChar: string) {
  return function newCharReducer(prevState: State) {
    return TextInput(prevState, newChar)
  } as Reducer
}

import State from 'typometer/models/State'
import TextInput from "typometer/reducers/Text/Input"


export default function TypingAction(newChar: string) {
  return function newCharReducer(prevState: State) {
    return TextInput(prevState, newChar)
  }
}

import { Reducer } from "typometer/types"
import State from 'typometer/models/State'
import { Blur } from "typometer/reducers/Editor"


export default function EditorBlur(newText: string) {
  return function EditorBlurReducer(_: State) {
    return Blur(newText)
  } as Reducer
}

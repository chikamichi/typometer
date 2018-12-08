import xs, { Stream } from "xstream"
import { DOMSource } from "@cycle/dom"


export interface CustomTextActions {
  focus$: Stream<boolean>,
  blur$: Stream<string>,
  toggleEditor$: Stream<boolean>
}

export default function intent(domSource: DOMSource): CustomTextActions {
  const toggleEditorWithKeyboard$ = domSource
    .select('document').events('keydown')
    .filter(e => (e.key == "F2") || (e.key == "Enter" && e.ctrlKey))

  const toggleEditorByClicking$ = domSource
    .select('.ta-custom-text__edit').events('click')

  return {
    focus$: domSource.select('textarea').events('focus').mapTo(true),

    blur$: domSource.select('textarea').events('blur')
      .map(e => (<HTMLInputElement>e.target).value),

    toggleEditor$: xs.merge(toggleEditorWithKeyboard$, toggleEditorByClicking$)
      .fold((toggling, _) => (!toggling), false)
  }
}

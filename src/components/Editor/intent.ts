import xs, { Stream } from "xstream"
import { DOMSource } from "@cycle/dom"


export interface EditorActions {
  focus$: Stream<boolean>,
  blur$: Stream<string>,
  toggle$: Stream<boolean>
}

export default function intent(domSource: DOMSource): EditorActions {
  const toggleEditorWithKeyboard$ = domSource
    .select('document').events('keydown')
    .filter(e => (e.key == "F2") || (e.key == "Enter" && e.ctrlKey))

  const toggleEditorByClicking$ = domSource
    .select('.ta-custom-text__edit').events('click')

  return {
    focus$: domSource.select('textarea').events('focus').mapTo(true),

    blur$: domSource.select('textarea').events('blur')
      .map(e => (<HTMLInputElement>e.target).value),

    toggle$: xs.merge(toggleEditorWithKeyboard$, toggleEditorByClicking$)
      // Note: using fold() triggers an initial UI refresh due to seed value
      .fold((toggling, _) => (!toggling), false)
  }
}

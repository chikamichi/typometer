import xs from "xstream"
import { DOMSource } from "@cycle/dom"

export default function intent(domSource: DOMSource) {
  const toggleEditorWithKeyboard$ = domSource
    .select('document').events('keydown')
    .filter(e => (e.key == "F2") || (e.key == "Enter" && e.ctrlKey))

  const toggleEditorByClicking$ = domSource
    .select('.ta-custom-text__edit').events('click')

  return {
    focus$: domSource.select('textarea').events('focus').mapTo(true),

    blur$: domSource.select('textarea').events('blur')
      .map(e => e.target.value),

    toggleEditor$: xs.merge(toggleEditorWithKeyboard$, toggleEditorByClicking$)
      .fold((toggling, _) => (!toggling), false)
  }
}

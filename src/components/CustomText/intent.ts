import { DOMSource } from "@cycle/dom"

export default function intent(domSource: DOMSource) {
  return {
    focus$: domSource.select('textarea').events('focus').mapTo(true),
    blur$: domSource.select('textarea').events('blur')
      .map(e => e.target.value)
  }
}

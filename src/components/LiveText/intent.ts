import { Sources } from "typometer/types"


export default function intent(sources: Sources) {
  return {
    newChar$: sources.DOM
      .select('document').events('keydown')
      .filter(e => !/^(Dead|F2)/.test(e.key))
      .filter(e => !/^(Tab|Control|Alt|Shift|Meta).*/.test(e.code))
      .map(e => e.key)
  }
}

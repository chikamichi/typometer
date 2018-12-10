import isolate from "@cycle/isolate"

import { Sources, Component, ComponentLens } from 'typometer/types'


/*
 * TODO: just sharing the whole state with child components for the time
 * being, must check what's really required and scope accordingly.
 * For the time being, components are responsible for providing reducers
 * which update the whole state object, hence set() is reusing componentState
 * directly.
 */
export const componentLens: ComponentLens = {
  get: (state) => state,
  set: (_, componentState) => componentState
}

export default function(component: Component, sources: Sources) {
  return isolate(component, {state: componentLens})(sources)
}

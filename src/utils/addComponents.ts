import xs, { Stream } from 'xstream'
import { reduce, pluck } from 'ramda'
import { VNode } from '@cycle/dom'

import { Sources, Reducer, Component } from 'typometer/types'
import { isolateComponent } from 'typometer/utils'


type ComponentsList = Record<string, Component>
type VNode$List = Record<string, Stream<VNode>>

type ComponentsBinder = (sources: Sources) => ComponentsProxy

interface Acc {
  sources: Sources,
  components: ComponentsList
}

class ComponentsProxy {
  list: ComponentsList

  constructor(readonly components: Component[], readonly sources: Sources) {
    const acc = {sources, components: {}}
    this.list = reduce(this.addComponent, acc, components).components
  }

  get reducers$(): Stream<Reducer> {
    const componentsState = pluck('state')(Object.values(this.list))
    return xs.merge(...componentsState) as Stream<Reducer>
  }

  get dom$(): Record<string, Stream<VNode>> {
    return reduce(
      (VDom$: VNode$List, component: Component) => {
        VDom$[component.cname + 'VDom$'] = this.list[component.name].dom
        return VDom$
      },
      {},
      this.components
    )
  }

  private addComponent(acc: Acc, component: Component): Acc {
    acc.components[component.name] = isolateComponent(component, acc.sources) as unknown as Component
    return acc
  }
}

const addComponents = (...components: Component[]): ComponentsBinder => {
  return (sources: Sources): ComponentsProxy => {
    return new ComponentsProxy(components, sources)
  }
}

export default addComponents
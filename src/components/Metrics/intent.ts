import { Intent } from 'typometer/types'
import { MetricsActions } from './model'


const intent: Intent = (domSource): MetricsActions => {
  return {
    resetRecords$: domSource
      .select('.ta-metric-reset--wpm').events('click')
      .map(_ => true)
  }
}

export default intent

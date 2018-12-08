import { AppState } from 'typometer/types'

export function isAppState(obj: any): obj is AppState {
  return obj && obj.text && obj.metrics && obj.records
}
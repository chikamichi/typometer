import { Stream, MemoryStream } from "xstream"
import { DOMSource, VNode } from "@cycle/dom"
import { StateSource } from "@cycle/state"

import State from "typometer/models/State"


export interface Actions {
  [key: string]: Stream<any>
}

export interface Model {
  (actions: any, state$?: MemoryStream<State>): Stream<Reducer>
}

export interface View {
  (sources: any): Stream<VNode>
}

export interface Intent {
  (domSource: DOMSource): Actions
}

export interface NAP {
  (state$: MemoryStream<State>): Actions
}

export interface Action {
  (...args: any[]): Reducer
}

export interface Reducer {
  (prev?: State, ...args: any[]): State|undefined
}

export interface MetricComputation {
  (state: State): number
}

export interface MetricsObject {
  [key: string]: number
}

export interface Sources {
  dom?: DOMSource,
  state: StateSource<State>
}

export interface Sinks {
  [key: string]: Stream<any>
}

export interface Component {
  (sources: Sources): Sinks
  cname: string // mandatory component name that's not uglified by code minifiers
}

export interface Text {
  raw: string,
  editing: boolean
}

export interface RunMetrics {
  start: Date|undefined,
  stop: Date|undefined,
  current_char: string|undefined,
  keystrokes_nb: number,
  valid_nb: number,
  errors_nb: number,
  ticks: number,
  error: string
  [key: string]: any
}

export interface TypingRecords {
  pending: boolean,
  accuracy: number|undefined,
  wpm: number|undefined,
  [key: string]: any
}

export interface AppState {
  text: Text,
  metrics: RunMetrics,
  records: TypingRecords
}

export interface CharState {
  char: string,
  isValid: boolean,
  isError: boolean,
  isNext: boolean,
  isTick: boolean
}

export interface DecoratedRunMetrics extends RunMetrics {
  accuracy: number,
  wpm: number
}

export interface DecoratedAppState extends AppState {
  metrics: DecoratedRunMetrics
}

export interface ComponentLens {
  get: (state: State) => State,
  set: (parentState: State, childState: State) => State
}

export interface KeyMapping {
  [key: string]: (state: State, char?: string) => State
}
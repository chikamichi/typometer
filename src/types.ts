import { Stream, MemoryStream } from "xstream"
import { DOMSource, VNode } from "@cycle/dom"
import { StateSource } from "@cycle/state"

import State from "typometer/models/State"


export type Reducer = (prev?: State) => State | undefined

export interface Sources {
  dom: DOMSource,
  state: StateSource<State>
}

export interface ComponentSources {
  dom?: DOMSource,
  state$: MemoryStream<State>
}

export type Sinks = {
  dom: Stream<VNode>
  state: Stream<Reducer>
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
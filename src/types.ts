import { DOMSource, Stream, VNode } from "@cycle/dom"

import { AppState } from "typometer/types"


type Reducer = (prev?: AppState) => AppState | undefined

export interface Sources {
  DOM: DOMSource,
  onion: Stream<Reducer>
}

export type Sinks = {
  DOM: Stream<VNode>
  onion: Stream<Reducer>
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
  replay_nb: number,
  error: string|undefined
}

export interface TypingRecords {
  pending: boolean,
  accuracy: number|undefined,
  wpm: number|undefined
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
  isReplayed: boolean
}

export interface DecoratedRunMetrics extends RunMetrics {
  accuracy: number,
  wpm: number
}

export interface DecoratedAppState extends AppState {
  metrics: DecoratedRunMetrics
}

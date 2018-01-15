import { DOMSource, Stream, VNode } from "@cycle/dom"
import { AppState } from "types"

type Reducer = (prev?: AppState) => AppState | undefined

interface Sources {
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
  accuracy: number,
  wpm: number
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

export interface DecoratedAppState extends AppState {
  accuracy: number,
  wpm: number,
  done: boolean
}

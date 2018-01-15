import { AppState } from "types"

export default function Model(state) {
  return new SuperState(state)
}

class SuperState {
  state: AppState

  constructor(state) {
    this.state = state
  }

  // public stop() {
  //   return {
  //     ...this.state,
  //     ...{
  //       stop: new Date()
  //     }
  //   }
  // }

  // public clear_mutation(text?: TargetText, opts = {}): AppState {
  //   const options = {
  //     ...{
  //       records: true
  //     },
  //     opts
  //   }
  //   const records = (new Decorator(this.state)).compute_records()
  //   return {
  //     ...INITIAL_APP_STATE,
  //     ...{
  //       text: text || this.state.text,
  //       records: options.records ? records : {}
  //     }
  //   }
  // }

  // public clear(text?: TargetText, opts = {}): AppState {
  //   const clear_state = this.clear_mutation(text, opts)
  //   this.state$.shamefullySendNext(clear_state)
  //   return this.state
  // }

  public isNew(): boolean {
    const m = this.state.metrics
    return !m.start && !m.stop
  }

  // public isRunning(): boolean {
  //   return !!this.state.start && !this.state.stop
  // }
  //
  // public hasJustStarted(): boolean {
  //   return !!this.state.start && this.state.keystrokes_nb == 1
  // }

  public isDone(): boolean {
    const t = this.state.text
    const m = this.state.metrics
    return t.raw.length == m.valid_nb && !m.stop
  }

  // public hasStopped(): boolean {
  //   const a = this.attributes
  //   const res = !!a.start && !!a.stop
  //   return res
  // }
}
//
//
//
// export class Decorator {
//   model: Singleton
//
//   constructor(model: Singleton) {
//     this.model = model
//   }
//
//   decorate(): DecoratedAppState {
//     const a = this.model.attributes
//     return {
//       ...a,
//       ...{
//         accuracy: this.compute_accuracy(),
//         done: (a.text.text.length == a.valid_nb),
//         wpm: this.compute_wpm(),
//         records: a.records
//       }
//     }
//   }
//
//   get word_length(): number {
//     return 5
//   }
//
//   private compute_accuracy(attributes?: AppState): number {
//     const a = attributes || this.model.attributes
//     if (a.keystrokes_nb == 0) return 0
//     return Math.round((1 - a.errors_nb / a.keystrokes_nb) * 100)
//   }
//
//   private compute_wpm(attributes?: AppState): number {
//     const a = attributes || this.model.attributes
//     if (!a.start || !a.stop) return 0
//     // nb_words takes into account errors, as keystrokes_nb does not distinguish
//     // between valid and invalid characters. This is by design so the WPM is
//     // an accurate estimate of efficiency: less errors => better wpm, at
//     // constant time.
//     const nb_words = a.keystrokes_nb / 5 // bug, see https://github.com/chikamichi/typometer/issues/1
//     const elapsed = (a.stop.getTime() - a.start.getTime()) / 1000.0 / 60.0 // ms -> mn
//     return Math.round(nb_words / elapsed)
//   }
//
//   // Fetch the max value for a specific attribute as cached over time.
//   // Decoration attributes are dynamically computed.
//   private get_max(key: string, f?: (attributes?: AppState) => number): number {
//     const a$ = this.model.attributes$
//     let record, last
//     const last$ = a$
//       .fold((_, attributes) => attributes.records[key], 0)
//       .subscribe({next: value => last = value})
//     // It's important to unsubscribe ie. destroy stream$ otherwise the
//     // computation would be triggered each time a new event is forwarded by
//     // this.model.attributes$, with multiple stream$ objects piling up as
//     // compute_record() is called.
//     last$.unsubscribe()
//     const record$ = a$
//       .fold((max, attributes) => {
//         const new_val = f ? f(attributes) : attributes[key]
//         return new_val > max ? new_val : max
//       }, last || 0)
//       .subscribe({next: value => record = value})
//     record$.unsubscribe()
//     return record
//   }
//
//   public compute_records(): TypingRecords {
//     return {
//       accuracy: this.get_max('accuracy', this.compute_accuracy),
//       wpm: this.get_max('wpm', this.compute_wpm)
//     }
//   }
// }

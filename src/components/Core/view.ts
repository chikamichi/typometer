import xs from "xstream"
import { h1, h2, div } from "@cycle/dom"

export default function view(contentVDom$, metricsVDom$) {
  return xs.combine(contentVDom$, metricsVDom$)
    .map(([content, metrics]) => {
      return div('.typing-app.ta', [
        div('.ta-side', [
          h1('.ta-title', 'typometer'),
          div('.ta-settings', [
            h2('Settings'),
            // h(replay_settings.sel, replay_settings.data, replay_settings.children),
          ])
        ]), // .ta-side

        div('.ta-main', [

          div('.ta-header', [
            metrics

            // div(classnames('.ta-progress .ta-progress--done', {'.u-wip': !attributes.done}), ' Done!')

          ]), // .ta-header

          content

        ]) // .ta-main

      ]) // .ta
    })
}

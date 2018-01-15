/***
 * Typometer — typing-abilities speedometer
 *
 * Tracks instant accuracy and averaged speed on any text:
 * - instant accuracy is refined as you type.
 * - averaged speed is expressed as Words per minute, with a hardcoded
 *   convention of 5 letters per word.
 *
 * Formula: https://www.speedtypingonline.com/typing-equations
 *
 ***/

import { makeDOMDriver } from "@cycle/dom"
import { run } from "@cycle/run"

import Core from "components/Core"


// The NAP driver is merely a proxy for pre-computed side-effects aka. triggered
// mutation proposals.
function makeNAPDriver() {
  return function NAPDriver(side_effect$) {
    return side_effect$
  }
}

// Drivers: raw events streams hooked with the intent layer through main().
const drivers = {
  DOM: makeDOMDriver('.main'),
  NAP: makeNAPDriver()
}

run(Core, drivers);

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
import onionify from "cycle-onionify"

import Core from "typometer/components/Core"


const main = onionify(Core)


// Drivers: raw events streams hooked with the intent layer through main().
const drivers = {
  DOM: makeDOMDriver('.main')
}


run(main, drivers);

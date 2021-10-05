// CODE FOR CONSTANTS AND OTHER PRE-MAIN INITIALIZATIONS.
const $ = (x) => {
  return document.getElementById(x)
}
const print = (x) => { return console.log(x) }

let DOCKTAG_DB      = null
let CSV_UPDATED     = none(false)
let SAVED_MANIFESTS = []
let LAST_MANIFEST   = undefined
let OUTPUT_VISIBLE  = none(false)
let OUTPUT_MAIN     = ''
let OUTPUT_CSV      = ''
let INVALID_CSV     = true
let CURRENT_SCREEN  = 'MAIN'
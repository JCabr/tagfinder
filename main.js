function setRequestStatus(message, style = undefined) {
  let requestMessage = $('request-status-message')
  requestMessage.innerHTML = message

  requestMessage.setAttribute('class', '')
  requestMessage.classList.add(style)

  requestMessage.style.transition = 'opacity 1s'
  requestMessage.style.opacity = '1'

  return null
}

function requestStatusClearIn(ms, currentMessage) {
  return setTimeout(_ => {
    msgBox = $('request-status-message')

    if (msgBox.innerHTML == currentMessage) {
      msgBox.style.transition = 'opacity 2s'
      msgBox.style.opacity = '0'
    }
  }, ms)
}

function gotoCSV() {
  //print('csv')
  $('input-row').style.display = 'none'
  $('csv-row').style.display   = 'inline'

  if (CURRENT_SCREEN == 'CSV' && DOCKTAG_DB === null) {
    loadNewCSV()
  }

  switchOutputMode('CSV')

  CURRENT_SCREEN = 'CSV'
}

function gotoMain() {
  // print('main')

  // If display is inline, then already have main tab open.
  if (CURRENT_SCREEN == 'MAIN') {
    barcodeWipePrompt()
    return
  }

  CSV_UPDATED.ifSomething(_ => { loadNewCSV() })

  switchOutputMode('MAIN')
  $('input-row').style.display = 'inline'
  $('csv-row').style.display = 'none'

  CURRENT_SCREEN = 'MAIN'
}

function barcodeWipePrompt() {
  let barcodeData = maybe(OUTPUT_MAIN, nothing = '')

  barcodeData
  .ifSomething(_ => {
    let choice = confirm("Do you want to wipe docktag barcode list?")

    if (choice) {
      OUTPUT_MAIN = ''
      $('output-column').innerHTML = ''
      LAST_MANIFEST = undefined
    }
  })
}

function switchOutputMode(mode) {
  outputColumn  = $('output-column')
  outputStyle   = outputColumn.style
  csvRowStyle   = $('csv-row') 

  if (mode ==='CSV') {
    if ($('csv-input').value == '') { OUTPUT_CSV = '' }
    
    outputColumn.innerHTML  = OUTPUT_CSV

    // print(OUTPUT_CSV)

    outputStyle.minWidth    = '50vw'
    outputStyle.maxWidth    = '50vw'
    outputStyle.border      = 'none'
  }
  else {
    outputColumn.innerHTML    = OUTPUT_MAIN

    outputStyle.border        = '2px solid var(--wm-blue)'
    outputStyle.borderBottom  = 'none'
    outputStyle.borderRight   = 'none'
    outputStyle.borderTop     = 'none'
    outputStyle.minWidth      = '50.1%'
    outputStyle.maxWidth      = '50.1%'
  }
}
function detectEnter(_) {
  if (event.key == 'Enter') {
    searchDocktags()
  }
}

function wipeDocktagList() {
  $('output-column').innerHTML = ''
}

function wipeHistoryList() {
  $('history-list').innerHTML = ''
  LAST_MANIFEST = null
}

function wipeCSVData() {
  $('csv-input').value = ''
  DOCKTAG_DB = null
}

function barcodeImageFor(id) {
  return "https://www.cognex.com/api/Sitecore/Barcode/Get?data=" +
    id +
    "&code=BCL_CODE128" +
    "&width=" +
    300 +
    "&imageType=JPG" +
    "&foreColor=%23" +
    '252626' + 
    "&backColor=%23" +
    'C5C5C5' +
    "&rotation=RotateNoneFlipNone"
}

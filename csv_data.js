function csvUpdateSignal() {
  CSV_UPDATED= some(true)
}

function loadNewCSV() {
  docktagData = maybe($('csv-input').value, nothing='')

  docktagData
  .ifSomething(data => {
    // print(`CSV DATA:\n${data}`)

    // Get lines; clear out any leading and trailing space first.
    rawLines = data.replace(/^\s+/, '').replace(/\s+$/, '').split("\n")
    // First two lines are not needed.
    rawLines = rawLines.splice(2)
    // Convert line strings to comma-separated arrays.
    items = rawLines.map(item => { return item.split(',') })
    // Compact docktag info arrays to only needed items.
    items = items.map(item => { return [ item[0], item[4] ] })
    // Strip newlines
    items = items.map(item => {
      return item.map(x => { return x.replace(/["]+/g, '') })
    })

    // Either no data was loaded, or invalid format was given.
    if (items.length == 0) {
      INVALID_CSV = true
      OUTPUT_CSV  = "<div class='csv-output-invalid'>NO DATA FOUND</div>"
      DOCKTAG_DB  = null
      
      if (CURRENT_SCREEN == 'CSV') {
        $('output-column').innerHTML = OUTPUT_CSV
      }

      return
    }

    itemDB = {}

    items.map(pair => {
      let docktag  = pair[0]
      let manifest = pair[1]

      manifest in itemDB ?
        itemDB[manifest].push(docktag) :
        itemDB[manifest] = [docktag]
    })

    DOCKTAG_DB = itemDB
    
    //  print(DOCKTAG_DB)

    generateManifestData()

    LAST_MANIFEST = null
  })
  .ifNothing(_ => {
    // print(`NO CSV DATA`)
    INVALID_CSV = false
    OUTPUT_CSV = ''
  })

  CSV_UPDATED = none(false)
}

function generateManifestData() {
  result = ''

  for (const man in DOCKTAG_DB) {
    result += `<div class='csv-output-manifest'>
      Manifest ${man}:
    </div>`

    DOCKTAG_DB[man].forEach(docktag => {
      result += `<div class='csv-output-docktag'>
        ${docktag}
      </div>
    `
    })
  }

  OUTPUT_CSV = result
}

function searchDocktags() {
  searchManifest = maybe($('manifest-input').value, nothing='')

  searchManifest
  .ifSomething(manifest => {
    //let mainOutput = maybe(OUTPUT_MAIN, nothing = '')

    if (manifest === LAST_MANIFEST) {
      msg = "Manifest is the same as last one"
      setRequestStatus(msg, 'status-message-bad')
      requestStatusClearIn(5000, msg)
      return
    }

    docktags = DOCKTAG_DB ? maybe(DOCKTAG_DB[manifest]) : none()
    success = false

    docktags
    .ifSomething(list => {
      //print("DOCKTAGS FOUND: " + list)
      success = true

      wipeDocktagList()
      list.forEach(docktag => { generateDocktag(docktag) })

      msg = "Docktags Loaded"
      setRequestStatus(msg, 'status-message-good')
      requestStatusClearIn(5000, msg)
    })
    .ifNothing(_ => {
      msg = "No Docktags Found"
      setRequestStatus(msg, 'status-message-bad')
      requestStatusClearIn(5000, msg)
    })

    OUTPUT_MAIN = $('output-column').innerHTML
    addToHistory(manifest, success)
  })
  .ifNothing(_ => {
    msg = "No manifest given."
    setRequestStatus(msg, 'status-message-bad')
    requestStatusClearIn(5000, msg)
  })
}

function generateDocktag(id) {
  let docktagLabel= document.createElement('div')
  docktagLabel.innerHTML = id
  docktagLabel.classList.add('docktag-barcode-label')

  $('output-column').appendChild(docktagLabel)

  let generatedImage = document.createElement('img')
  generatedImage.src = barcodeImageFor(id)
  generatedImage.classList.add('docktag-barcode')

  $('output-column').appendChild(generatedImage)
}

function csvWipePrompt() {
  let csvText = maybe($('csv-input').value, nothing = '')

  csvText
  .ifSomething(_ => {
    let choice = confirm("Would you like to clear entered CSV text?")

    if (choice) {
      $('csv-input').value = ''
      OUTPUT_CSV = ''
      DOCKTAG_DB = null
      $('output-column').innerHTML = ''
    }
  })
  .ifNothing(_ => {
    alert("There is no CSV text to clear.")
  })
}
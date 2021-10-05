function addToHistory(manifest, successful = false) {
  let historyItem = document.createElement('div')
  historyItem.classList.add('history-item')

  historyItem.classList.add(successful ? 
    'history-item-success' :
    'history-item-failure'
  )
  historyItem.innerHTML = successful ?
    `Docktag Found &nbsp;&nbsp;&nbsp;&nbsp; ${manifest}` :
    `No Docktag Found &nbsp; ${manifest}`

  let list = $('history-list')
  list.insertBefore(historyItem, list.firstChild)

  LAST_MANIFEST = manifest
}

function historyWipePrompt() {
  let historyItems = maybe($('history-list').innerHTML, nothing = '')
  // print(historyItems)

  historyItems
  .ifSomething(_ => {
    let choice = confirm("Would you like to wipe manifest history?")

    if (choice) {
      wipeHistoryList()
    }
  })
  .ifNothing(_ => {
    alert("There is no manifest history to clear.")
  })
}
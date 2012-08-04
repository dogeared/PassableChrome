var keyMap = {
  'Control+Option+Command+A': { fn: 'hex_sha1', half: false },
  'Control+Option+Command+S': { fn: 'b64_sha1', half: false },
  'Control+Option+Command+D': { fn: 'hex_sha1', half: true },
  'Control+Option+Command+F': { fn: 'b64_sha1', half: true }
}

function setSelectedElement(val) {
  var focused = document.activeElement
  if (focused) {
    try {
      focused.focus()
      focused.value = val
    }
    catch (err) {
      console.log(err.message)
    }
  }
}

function onExtensionMessage(request) {
  if (request['fillFocus'] !== undefined) {
    setSelectedElement(request['fillFocus'])
  } 
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage)

  document.addEventListener('keydown', function(evt) {
    var keyStr = keyEventToString(evt)
    var keys = Object.keys(keyMap)
    if (keys.indexOf(keyStr) < 0) { return true }
    chrome.extension.sendRequest(
      {'nickname': document.activeElement.value, proc: keyMap[keyStr]}, 
      onExtensionMessage
    )
    evt.stopPropagation()
    evt.preventDefault()
    return false
  }, false)
}

initContentScript()

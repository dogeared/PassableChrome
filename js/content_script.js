var keyMap = {}

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
  if (request.fillFocus) {
    setSelectedElement(request.fillFocus)
  } else if (request.keyMap) {
    keyMap = request.keyMap
  } else if (request.error) {
    chrome.extension.sendRequest({showOptions: true, error: request.error})
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage)
  chrome.extension.sendRequest({initKeyMap: true}, onExtensionMessage);

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

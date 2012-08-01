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
  if (request['fillFocus'] != undefined) {
    setSelectedElement(request['fillFocus'])
  }
}

function initContentScript() {
  chrome.extension.onRequest.addListener(onExtensionMessage)
}

initContentScript()

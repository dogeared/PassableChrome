var savedSecret = ""
var intervalFunc

function getKeyMap() {
  var defaultKeyStrings = getDefaultKeyStrings()
  var keyMap = {}
  strengths.forEach(function(strength) {
    var keyString = localStorage[strength]||defaultKeyStrings[strength]
    keyMap[keyString] = keyMap[keyString]||{}
    if (strength === 'superman' || strength === 'very') {
      keyMap[keyString].fn = 'hex_sha1'
    } else {
      keyMap[keyString].fn = 'b64_sha1'
    }

    if (strength === 'superman' || strength === 'extremely') {
      keyMap[keyString].half = false
    } else {
      keyMap[keyString].half = true
    }
  })
  return keyMap
}

function updateInterval() {
  var multiplier = (localStorage.units && localStorage.units === 'minutes')?
    1000*60:1000*60*60
  var interval = (localStorage.secret_interval)?
    parseInt(localStorage.secret_interval)*multiplier:24*1000*60*60
  if (intervalFunc) clearInterval(intervalFunc)
  intervalFunc = setInterval(function() {
    savedSecret = ""
  }, interval)
}

function init() {
  var self = this

  var curVersion = chrome.app.getDetails().version
  var prevVersion = localStorage.version||"0.0"
  var firstTime = localStorage.firstTime||true

  //alert("cur: " + curVersion + ", pre: " + prevVersion + ", first: " + firstTime + ", options?: " + (firstTime || (prevVersion !== curVersion)))

  if (firstTime || (prevVersion !== curVersion)) {
    localStorage.version = curVersion
    localStorage.firstTime = false
    chrome.tabs.create({url: "../html/options.html"});
  }

  updateInterval()

  sendKeysToAllTabs(getKeyMap())

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request.showOptions) {
        chrome.tabs.create({url: "../html/options.html"});
      }
      else if (request.initKeyMap) {
        sendResponse({keyMap: getKeyMap()})
      }
      else if (request.nickname) {
        var secret = request.secret||savedSecret
        if (!secret || secret.length === 0) {
          sendResponse({error: 'Please set a secret before generating your password.'})
        } else {
          var pw = self[request.proc.fn](secret+request.nickname)
          pw = (request.proc.half) ? pw.substring(0,pw.length/2) : pw
          sendResponse({fillFocus: pw})
        }
      }
    }
  )
}

init()

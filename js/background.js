var savedSecret = ""
var intervalFunc

function init() {
  var self = this
  var interval = (localStorage['secret_interval'])?
    parseInt(localStorage['secret_interval'])*1000*60:1000*60*30
  var doInterval = JSON.parse(localStorage['secret_timeout']||true)
  if (doInterval) {
    intervalFunc = setInterval(function() {
      savedSecret = ""
    }, interval)
  } else if (intervalFunc) {
    clearInterval(intervalFunc)
  }

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request['nickname']) {
        var pw = self[request.proc.fn](savedSecret+request['nickname'])
        pw = (request.proc.half) ? pw.substring(0,pw.length/2) : pw
        sendResponse({'fillFocus': pw})
      }
    }
  )
}

init()

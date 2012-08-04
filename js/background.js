var savedSecret = ""

function init() {
  var self = this

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request.nickname) {
        var secret = request.secret||savedSecret
        var pw = self[request.proc.fn](secret+request.nickname)
        pw = (request.proc.half) ? pw.substring(0,pw.length/2) : pw
        sendResponse({fillFocus: pw})
      }
    }
  )
}

init()

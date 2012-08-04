function processClick(proc) {
  chrome.extension.sendRequest(
    {'nickname': $('#nickname').val(), secret: $('#secret').val(), proc: proc},
    function(request) {
      if (request.fillFocus) { $('#password').val(request.fillFocus) }
    }
  )
}

$(document).ready(function() {
  $('#superman').click(function() {
    processClick({fn: 'hex_sha1', half: false})
  })

  $('#extremely').click(function() {
    processClick({fn: 'b64_sha1', half: false})
  })

  $('#very').click(function() {
    processClick({fn: 'hex_sha1', half: true})
  })

  $('#strong').click(function() {
    processClick({fn: 'b64_sha1', half: true})
  })

  // This doesn't work. Don't know why
  /*
   *$('#secret').keyDown(function() {
   *  chrome.extension.getBackgroundPage().savedSecret = $('#secret').val()
   *})
   */

  document.getElementById('secret').addEventListener('keydown', function() { 
    chrome.extension.getBackgroundPage().savedSecret = $('#secret').val()
  })

  var savedSecret = chrome.extension.getBackgroundPage().savedSecret
  if (savedSecret && savedSecret.length > 0)  {
    $('#secret').val(chrome.extension.getBackgroundPage().savedSecret)
    // don't like this, but focus doesn't work otherwise
    setTimeout(function() { $('#nickname').focus() }, 10)
  }
})

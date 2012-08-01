function doPass(func, half) {
  var pw = func.apply(this,[$('#secret').val()+$('#nickname').val()])
  pw = (half) ? pw.substring(0,pw.length/2) : pw
  if (localStorage['show_password'] === 'true') $('#password').val(pw)
  if (localStorage['save_secret'] === 'true')
    chrome.extension.getBackgroundPage().savedSecret = $('#secret').val()
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {fillFocus: pw})
    if (localStorage['close_popup'] === 'true')
      chrome.tabs.update(tab.id, {selected: true})
  })
}

$(document).ready(function() {
  $('#superman').click(function() {
    doPass(hex_sha1)
  })

  $('#extremely').click(function() {
    doPass(b64_sha1)
  })

  $('#very').click(function() {
    doPass(hex_sha1, true)
  })

  $('#strong').click(function() {
    doPass(b64_sha1, true)
  })

  var savedSecret = chrome.extension.getBackgroundPage().savedSecret
  if (savedSecret && savedSecret.length > 0)  {
    $('#secret').val(chrome.extension.getBackgroundPage().savedSecret)
    // don't like this, but focus doesn't work otherwise
    setTimeout(function() { $('#nickname').focus() }, 10)
  }
})

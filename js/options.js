function showEmptyMessage() {
  if ($('#secret').val().length <= 0) {
    $('#empty_message').show()
  } else {
    $('#empty_message').hide()
  }
}

function load() {
  $('#secret_interval').
    val(localStorage.secret_interval||24)
  $('input:radio[value='+(localStorage.units||'hours')+']').attr('checked', true)
  
  document.getElementById('secret_interval').addEventListener('keyup', function() { 
    localStorage.secret_interval = $('#secret_interval').val()
    chrome.extension.getBackgroundPage().updateInterval()
  })
  
  document.getElementById('secret').addEventListener('keyup', function() { 
    chrome.extension.getBackgroundPage().savedSecret = $('#secret').val()
    showEmptyMessage()
  })

  $('#secret').val(chrome.extension.getBackgroundPage().savedSecret)
  $('#secret').focus()
  showEmptyMessage()

  $('#units_hours').click(function() {
    localStorage.units = 'hours'
    chrome.extension.getBackgroundPage().updateInterval()
  })

  $('#units_minutes').click(function() {
    localStorage.units = 'minutes'
    chrome.extension.getBackgroundPage().updateInterval()
  })

  var defaultKeyStrings = getDefaultKeyStrings()

  strengths.forEach(function(strength) {
    var hotKeyElement = document.getElementById(strength)
    hotKeyElement.value = localStorage[strength]||defaultKeyStrings[strength]
    hotKeyElement.addEventListener('keydown', function(evt) {
      switch (evt.keyCode) {
        case 27:  // Escape
          evt.stopPropagation()
          evt.preventDefault()
          hotKeyElement.blur()
          return false
        case 8:   // Backspace
        case 46:  // Delete
          evt.stopPropagation()
          evt.preventDefault()
          hotKeyElement.value = ''
          localStorage[strength] = ''
          return false
        case 9:  // Tab
          return false
        case 16:  // Shift
        case 17:  // Control
        case 18:  // Alt/Option
        case 91:  // Meta/Command
          evt.stopPropagation()
          evt.preventDefault()
          return false
      }
      var keyStr = keyEventToString(evt)
      if (keyStr) {
        hotKeyElement.value = keyStr
        localStorage[strength] = keyStr
        sendKeysToAllTabs(chrome.extension.getBackgroundPage().getKeyMap())
      }
      evt.stopPropagation()
      evt.preventDefault()
      return false
    }, true)
  })
}

$(document).ready(function() {
  load();
  var tour = setupTour();
  tour.start(true);
})

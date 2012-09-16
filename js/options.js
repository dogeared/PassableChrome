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

function getGuiderObj(_id, _next, options) {
  function guideShow() {
    $('#tour').hide();
  }

  function guideHide() {
    $('#tour').show();
  }

  var prev = {name: "Prev", onclick: guiders.prev};
  var next = {name: "Next", onclick: guiders.next};
  var end = {name: "End Tour", onclick: guiders.hideAll};

  var ret= {
    buttons: [prev, next, end],
    position: 3,
    width: 200,
    onShow: guideShow,
    onHide: guideHide,
    id: _id,
    next: _next
  }
  $.extend(ret, options);
  return ret;
}

function setupTour() {
  var welcome = getGuiderObj("first", "second", {
    width: 600,
    overlay: true,
    description: "Passable",
    title: "Welcome to Passable Chrome",
  });
  // delet prev button
  welcome.buttons.splice(0,1);
  guiders.createGuider(welcome);

  var secret = getGuiderObj("second", "third", {
    attachTo: ".tour_secret",
    description: "Secret",
    title: "Secret",
  });
  guiders.createGuider(secret);

  var secret2 = getGuiderObj("third", "fourth", {
    attachTo: ".tour_secret",
    description: "Secret",
    title: "Secret",
    overlay: true,
    highlight: "#secret"
  });
  guiders.createGuider(secret2);
 
  var timeout = getGuiderObj("fourth", "fifth", {
    attachTo: ".tour_timeout",
    description: "Timeout",
    title: "Timeout",
  });
  guiders.createGuider(timeout);
 
  var strength = getGuiderObj("fifth", "sixth", {
    attachTo: ".tour_strength",
    position: 7,
    description: "Strength",
    title: "Strength",
  });
  guiders.createGuider(strength);

  var superman = getGuiderObj("sixth", "seventh", {
    attachTo: ".tour_superman",
    description: "Superman",
    title: "Superman",
  });
  guiders.createGuider(superman);

  var extremely = getGuiderObj("seventh", "eigth", {
    attachTo: ".tour_extremely",
    description: "Extremely",
    title: "Extremely",
  });
  guiders.createGuider(extremely);

  var very = getGuiderObj("eigth", "ninth", {
    attachTo: ".tour_very",
    description: "Very",
    title: "Very",
  });
  guiders.createGuider(very);

  var strong = getGuiderObj("ninth", "", {
    attachTo: ".tour_strong",
    description: "Strong",
    title: "Strong",
  });
  // delete next button
  strong.buttons.splice(1,1);
  guiders.createGuider(strong);
  
  $('#tour').click(function(){guiders.show('first')});

  if (!$.cookie('has_seen_tour')) {
    $.cookie('has_seen_tour', 'true');
    guiders.show('first');
  }
}

(function($) {
  load();
  setupTour();
})(jQuery)

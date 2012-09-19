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
    width: 325,
    onShow: guideShow,
    onHide: guideHide,
    id: _id,
    next: _next
  }
  $.extend(ret, options);
  return ret;
}

function setupTour() {
  var supermanStr = getDefaultKeyStrings().superman;

  var welcomeDesc = "<p>Passable empowers you to have different, high strength passwords for every website you visit.<br>" + 
    "<p>All you need is a long secret phrase and then a nickname for each website you want a password for.</p>" +
    "<p><b>You don't ever have to remember the password</b>. All you need to remember is the nickname. Your secret phrase is stored "+
    "(temporarily) and Passable does the rest.</p>" + 
    "<p><b>How it works</b></p>" +
    "<ol><li>Set your secret passphrase on this options page." + 
    "<li>In the password field on a webpage, enter your nickname for that website." +
    "<li>Hit the hotkey for the password strength desired." +
    "<li>The nickname will automatically be replaced with the generated password.</ol>" +
    "<p>There is a live example of interacting with Passable at the end of the tour.</p>";
  var welcome = getGuiderObj("first", "second", {
    width: 600,
    overlay: true,
    description: welcomeDesc,
    title: "Welcome to Passable Chrome",
  });
  // delete prev button
  welcome.buttons.splice(0,1);
  // add button
  welcome.buttons.splice(1,0, { name: 'Jump to Live Example', 
    onclick: function() {guiders.hideAll(); guiders.show('tenth')} });
  guiders.createGuider(welcome);

  var secretDesc = "<p>Your secret is a long phrase that you will remember. All standard characters and symbols (including spaces) " +
    "are valid.</p><p>When generating a password, you will not have to enter you secret phrase again.</p>";
  var secret = getGuiderObj("second", "third", {
    attachTo: ".tour_secret",
    description: secretDesc,
    title: "Secret",
  });
  guiders.createGuider(secret);

  var secret2Desc = "<p>Take a moment to enter a secret phrase now.</p>";
  var secret2 = getGuiderObj("third", "fourth", {
    attachTo: ".tour_secret",
    description: secret2Desc,
    title: "Secret",
    overlay: true,
    highlight: "#secret"
  });
  guiders.createGuider(secret2);

  var timeoutDesc = "<p>In order for Passable to be secure, your secret passphrase will be reset at an interval you specify here. " +
    "When the secret is reset and you attempt to generate a password, the options screen will automatically popup so that you can " +
    "re-enter your secret phrase.</p>"; 
  var timeout = getGuiderObj("fourth", "fifth", {
    attachTo: ".tour_timeout",
    description: timeoutDesc,
    title: "Timeout",
  });
  guiders.createGuider(timeout);

  var strengthDesc = "<p>Since different websites have different password requirements, Passable lets you generate passwords of varying " +
    "strengths.</p><p>Whenever possible, you should use the Superman Strength password.</p>";
  var strength = getGuiderObj("fifth", "sixth", {
    attachTo: ".tour_strength",
    position: 7,
    description: strengthDesc,
    title: "Strength",
  });
  guiders.createGuider(strength);

  var supermanDesc = "<p>The hotkey to generate Superman Strong passwords is set to the left. Click in the field to the left and " +
    "hit any key sequence to replace the default hotkey with a custom value of your choosing.</p>";
  var superman = getGuiderObj("sixth", "seventh", {
    attachTo: ".tour_superman",
    description: supermanDesc,
    title: "Superman",
  });
  guiders.createGuider(superman);

  var extremelyDesc = "<p>The hotkey to generate Extremely Strong passwords is set to the left. Click in the field to the left and " +
    "hit any key sequence to replace the default hotkey with a custom value of your choosing.</p>";
  var extremely = getGuiderObj("seventh", "eigth", {
    attachTo: ".tour_extremely",
    description: extremelyDesc,
    title: "Extremely",
  });
  guiders.createGuider(extremely);

  var veryDesc = "<p>The hotkey to generate Very Strong passwords is set to the left. Click in the field to the left and " +
    "hit any key sequence to replace the default hotkey with a custom value of your choosing.</p>";
  var very = getGuiderObj("eigth", "ninth", {
    attachTo: ".tour_very",
    description: veryDesc,
    title: "Very",
  });
  guiders.createGuider(very);

  var strongDesc = "<p>The hotkey to generate Strong passwords is set to the left. Click in the field to the left and " +
    "hit any key sequence to replace the default hotkey with a custom value of your choosing.</p>";
  var strong = getGuiderObj("ninth", "tenth", {
    attachTo: ".tour_strong",
    description: strongDesc,
    title: "Strong",
  });
  guiders.createGuider(strong);

  var exampleDesc = 
    '<div class="table table-stripe">' +
    '<table><tbody>' +
    '<tr><td>Secret</td>' +
    '<td><input id="secret-help" class="input-xlarge" placeholder="Type a secret phrase"></td></tr>' +
    '<tr><td>Nickname</td>' +
    '<td><input id="nick-help" class="input-xlarge" placeholder="Type a nickname">' + 
    '<div id="nick-help-info"></div></td></tr>' +
    '</tbody></table>' +
    '</div>';
  var example = getGuiderObj("tenth", "", {
    width: 500,
    overlay: true,
    description: exampleDesc,
    title: "Passable Live Example",
  });
  // delete next button
  example.buttons.splice(1,1);
  guiders.createGuider(example);


  var nickHelpText = 
    'Now, press the hotkey combination for a superman strong password: ' + 
    '<span style="color: red">' + supermanStr + '</span>';
  var passHelpText = 
    '<p>The nickname you typed has now been replaced by the generated password.</p>' +
    '<p>When logging in to a website, you would put your nickname in the password ' +
    'field and press the appropriate hotkey combination, just like you did here. ' +
    'The generated password would replace the nickname and you would be ready to ' +
    'log into the website.';

  $('#nick-help-info').hide();
  $('#nick-help-info').html(nickHelpText);
  
  document.addEventListener('keydown', function(evt) {
    var keyStr = keyEventToString(evt);
    if (keyStr !== supermanStr) { return true }
    $('#nick-help').val(hex_sha1($('#secret-help').val()+$('#nick-help').val()));
    $('#nick-help-info').html(passHelpText);
    evt.stopPropagation()
    evt.preventDefault()
    return false
  }, false);

  document.getElementById('nick-help').addEventListener('keyup', function() { 
    if ($('#nick-help').val().length > 0) {
      $('#nick-help-info').show()
    } else {
      $('#nick-help-info').html(nickHelpText);
      $('#nick-help-info').hide()
    }
  });

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

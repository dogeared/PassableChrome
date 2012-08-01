function load() {
  $('#save_secret').
    attr('checked', JSON.parse(localStorage['save_secret']||false))
  $('#secret_timeout').
    attr('checked', JSON.parse(localStorage['secret_timeout']||true))
  $('#secret_interval').
    val(localStorage['secret_interval']||30)
  $('#close_popup').
    attr('checked', JSON.parse(localStorage['close_popup']||true))
  $('#show_password').
    attr('checked', JSON.parse(localStorage['show_password']||false))
}

function save() {
  localStorage['save_secret'] = $('#save_secret').attr('checked')
  localStorage['secret_timeout'] = $('#secret_timeout').attr('checked')
  localStorage['secret_interval'] = $('#secret_interval').val()
  localStorage['close_popup'] = $('#close_popup').attr('checked')
  localStorage['show_password'] = $('#show_password').attr('checked')
  chrome.extension.getBackgroundPage().init()
}

$(document).ready(function() {
  $('#save').click(function() {
    save()
  })

  load()
})

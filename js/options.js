function load() {
}

function save() {
  chrome.extension.getBackgroundPage().init()
}

$(document).ready(function() {
  $('#save').click(function() {
    save()
  })

  load()
})

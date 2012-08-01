var savedSecret = ""
var intervalFunc

function init() {
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
}

init()

function sendKeysToAllTabs(keyMap) {
  chrome.windows.getAll({'populate': true}, function(windows) {
    for (var i = 0; i < windows.length; i++) {
      var tabs = windows[i].tabs;
      for (var j = 0; j < tabs.length; j++) {
        chrome.tabs.sendRequest(
          tabs[j].id,
          {'keyMap': keyMap}
        )
      }
    }
  });
}

var scriptUrl = '//editor.unlayer.com/embed.js?2';
var callbacks = [];
var loaded = false;

var isScriptInjected = function isScriptInjected() {
  var scripts = document.querySelectorAll('script');
  var injected = false;

  scripts.forEach(function (script) {
    if (script.src.includes(scriptUrl)) {
      injected = true;
    }
  });

  return injected;
};

var addCallback = function addCallback(callback) {
  callbacks.push(callback);
};

var runCallbacks = function runCallbacks() {
  if (loaded) {
    var callback = void 0;

    while (callback = callbacks.shift()) {
      callback();
    }
  }
};

export var loadScript = function loadScript(callback) {
  addCallback(callback);

  if (!isScriptInjected()) {
    var embedScript = document.createElement('script');
    embedScript.setAttribute('src', scriptUrl);
    embedScript.onload = function () {
      loaded = true;
      runCallbacks();
    };
    document.head.appendChild(embedScript);
  } else {
    runCallbacks();
  }
};
// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"visualization.js":[function(require,module,exports) {
document.addEventListener("DOMContentLoaded", function () {
  var width = 800;
  var height = 600;
  var container = d3.select("#viz");
  var svg = container.append("svg").attr("width", width).attr("height", height).style("background-color", "#f5f3ef");
  d3.json("/cantons.json").then(function (cantons) {
    d3.csv("/referendum.csv").then(function (yesVotes) {
      var tooltip = container.append("div").style("opacity", 0).style("position", "fixed").style("background", "rgba(255,255,255,0.8)").style("padding", "0.5rem").style("padding-top", "0.1rem").style("padding-bottom", "0.1rem").style("pointer-events", "none").style("font-size", 18 + "px");
      var percent = container.append("div").style("opacity", 0).style("position", "absolute").style("padding", "0.5rem").style("padding-top", "0.1rem").style("padding-bottom", "0.1rem").style("pointer-events", "none").style("left", 20 + "px").style("top", 100 + "px").style("font-size", 42 + "px").style("font-weight", "700");
      var yespercent = container.append("div").style("opacity", 0).style("position", "absolute").style("padding", "0.5rem").style("padding-top", "0.1rem").style("padding-bottom", "0.1rem").style("pointer-events", "none").style("left", 20 + "px").style("top", 180 + "px").style("font-size", 42 + "px").style("font-weight", "700");
      var rectpercent = svg.append("rect").style("opacity", 0).attr("x", 10).attr("y", 105).attr("width", 120).attr("height", 4).attr("fill", "#008100");
      var rectyes = svg.append("rect").style("opacity", 0).attr("x", 10).attr("y", 185).attr("width", 120).attr("height", 4).attr("fill", "#9c0303");
      var textpercent = svg.append("text").style("opacity", 0).attr("x", 10).attr("y", 100).attr("font-size", 20).attr("font-family", "Cairo").attr("fill", "#000000").style("font-weight", "700").attr("fill", "#008100").text("Ja");
      var textyes = svg.append("text").style("opacity", 0).attr("x", 10).attr("y", 180).attr("font-size", 20).attr("font-family", "Cairo").attr("fill", "#9c0303").style("font-weight", "700").text("Nein");
      var textheadline = svg.append("text").attr("x", 10).attr("y", 40).attr("font-size", 30).attr("font-family", "Cairo").attr("font-weight", "400").text("Bundesbeschluss über Biometrische Pässe");
      var texttest = container.selectAll("div").style("font-family", "Cairo");
      var projection = d3.geoAlbers().center([-0.2, 47]).rotate([-9, 0, 0]).parallels([40, 50]).scale(12500);
      var pathGenerator = d3.geoPath().projection(projection);
      var globe = svg.selectAll("path").data(cantons.features).enter().append("path").attr("d", function (d) {
        return pathGenerator(d);
      }).on("mouseenter", function (d) {
        tooltip.style("opacity", 1).style("color", "#000000").html(d.name);
        percent.style("opacity", 1).style("color", "#000000").html(100 - d.ja_anteil + "%");
        yespercent.style("opacity", 1).style("color", "#000000").html(d.ja_anteil + "%");
        textpercent.style("opacity", 1);
        textyes.style("opacity", 1);
        rectyes.style("opacity", 1);
        rectpercent.style("opacity", 1);
      }).on("mousemove", function (d) {
        tooltip.style("left", d3.event.pageX + 5 + "px").style("top", d3.event.pageY + 5 + "px");
      }).on("mouseleave", function (d) {
        tooltip.style("opacity", 0);
      }).on("mouseleave", function (d) {
        yespercent.style("opacity", 0);
        percent.style("opacity", 0);
        yespercent.style("opacity", 0);
        textpercent.style("opacity", 0);
        textyes.style("opacity", 0);
        rectyes.style("opacity", 0);
        rectpercent.style("opacity", 0);
      }).attr("fill", "#ceccc0").attr("stroke", "#f5f3ef").attr("fill", function (d) {
        var yescount = yesVotes.find(function (yes) {
          return yes.id == d.properties.id;
        });
        var colorScale = d3.scaleThreshold().domain([45, 47.5, 50, 52.5, 55]).range(['#003d00', '#008100', '#43c834', '#ffa19b', '#d74860', '#880033']);
        return colorScale(yescount.ja_anteil);
      });
      console.log(cantons.features);
      console.log(yesVotes);
      console.log(yesVotes[1].ja_anteil);
      /* results */

      var results = svg.selectAll("path").data(yesVotes).enter();
      /* results */

      var rect = svg.append("rect").attr("x", 10).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#880033");
      var recttwo = svg.append("rect").attr("x", 70).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#d74860");
      var rectthree = svg.append("rect").attr("x", 130).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#ffa19b");
      var rectfour = svg.append("rect").attr("x", 190).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#43c834");
      var rectfive = svg.append("rect").attr("x", 250).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#008100");
      var rectsix = svg.append("rect").attr("x", 310).attr("y", 550).attr("width", 60).attr("height", 10).attr("fill", "#003d00");
      var textnumber = svg.append("text").attr("x", 10).attr("y", 540).attr("font-size", 14).attr("font-family", "Cairo").text("Prozent Ja-Stimmen");
      var textone = svg.append("text").attr("x", 10).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<45%");
      var texttwo = svg.append("text").attr("x", 70).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<47.5%");
      var textthree = svg.append("text").attr("x", 130).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<50%");
      var textfour = svg.append("text").attr("x", 190).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<52.5%");
      var textfive = svg.append("text").attr("x", 250).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<55%");
      var textsix = svg.append("text").attr("x", 310).attr("y", 580).attr("font-size", 14).attr("font-family", "Cairo").text("<57.5%");
      var textquellen = svg.append("text").attr("x", 650).attr("y", 580).attr("font-size", 12).attr("font-family", "Cairo").attr("fill", "#838383").text("Quelle: atlas.bfs.admin.ch");
      /*
      return yescount.ja_anteil >= 50 ? #76c770 : #d90f0f;
      */
      // ====================
      // Visualisierung...
      // ====================
    });
  });
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49605" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","visualization.js"], null)
//# sourceMappingURL=/visualization.6e720a66.js.map
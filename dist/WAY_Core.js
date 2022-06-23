/* eslint no-use-before-define: 0 */
// ===========================================================================
// WAY_Core.js
// ===========================================================================

/*:
@plugindesc v2.0.0 WAY Core Utility Plugin. Place it above all WAY plugins. <WAY_Core>
@author waynee95

@help
==============================================================================
 ■ Information
==============================================================================
WAY Core is a Utility plugin for RPG Maker MV Plugin Developement. This plugin
is required for all my plugins. Place above all WAY plugins.

==============================================================================
 ■ Terms of Use
==============================================================================
This work is licensed under the MIT license.

More info here: https://github.com/waynee95/mv-plugins/blob/master/LICENSE

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Imported = window.Imported || {}; //============================================================================
// WAYModuleLoader
//============================================================================

var WAYModuleLoader = function () {
  var plugins = {};

  function parseParameters(params) {
    if (WAY === undefined) {
      return params;
    }

    return WAY.Util.parseParameters(params);
  }

  function compareVersions(currentVersion) {
    var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "==";
    var requiredVersion = arguments.length > 2 ? arguments[2] : undefined;
    var length = Math.max(currentVersion.length, requiredVersion.length);
    var compare = 0;
    var operation = {
      "<": function _() {
        return compare < 0;
      },
      "<=": function _() {
        return compare <= 0;
      },
      "==": function _() {
        return compare === 0;
      },
      ">": function _() {
        return compare > 0;
      },
      ">=": function _() {
        return compare >= 0;
      }
    };

    for (var i = 0; i < length; i += 1) {
      if (currentVersion[i] < requiredVersion[i]) {
        compare = -1;
        break;
      } else if (currentVersion[i] > requiredVersion[i]) {
        compare = 1;
        break;
      }
    }

    return operation[operator]();
  }

  return {
    checkRequirements: function checkRequirements(key) {
      var _this = this;

      var list = "";
      plugins[key].required.forEach(function (_ref) {
        var name = _ref.name,
            version = _ref.version;

        if (!_this.isImported(name)) {
          list += "".concat(name, "\n");
        } else if (version) {
          var _version$split$revers = version.split(" ").reverse(),
              _version$split$revers2 = _slicedToArray(_version$split$revers, 2),
              requiredVersion = _version$split$revers2[0],
              operator = _version$split$revers2[1];

          if (!_this.checkVersion(name, operator, requiredVersion)) {
            list += "".concat(name, " needs to be ").concat(operator, " version ").concat(requiredVersion, "!\n");
          }
        }
      });

      if (list) {
        WAYModuleLoader.printError(list, key);
      }
    },
    printError: function printError(msg, key) {
      var strA = "Error loading ".concat(key, "\n\n");
      var strB = "The following plugins are required:\n".concat(msg, "\n");
      var strC = "Place the required plugins above ".concat(key, "!");
      console.error(strA + strB + strC); // eslint-disable-line no-console

      if (Utils.isNwjs() && Utils.isOptionValid("test")) {
        var gui = require("nw.gui"); //eslint-disable-line


        gui.Window.get().showDevTools();
      }

      SceneManager.stop();
    },
    checkVersion: function checkVersion(key, operator, requiredVersion) {
      if (this.isImported(key)) {
        var currentVersion = plugins[key].version;
        return compareVersions(currentVersion, operator, requiredVersion);
      }

      return false;
    },
    getModule: function getModule(key) {
      if (this.isImported(key)) {
        return plugins[key];
      }

      return false;
    },
    getPluginParameters: function getPluginParameters(key) {
      return window.$plugins.filter(function (p) {
        return p.description.indexOf("<".concat(key, ">")) > -1;
      })[0].parameters;
    },
    isImported: function isImported(key) {
      return typeof plugins[key] !== "undefined";
    },
    registerPlugin: function registerPlugin(key, version, author) {
      if (this.isImported(key)) {
        return false;
      }

      for (var _len = arguments.length, required = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        required[_key - 3] = arguments[_key];
      }

      plugins[key] = {
        alias: {},
        author: author,
        parameters: parseParameters(this.getPluginParameters(key)),
        required: required,
        version: version
      };
      Imported[key] = version;

      if (required) {
        this.checkRequirements(key);
      }

      return true;
    }
  };
}();

WAYModuleLoader.registerPlugin("WAY_Core", "2.0.0", "waynee95");
var WAYCore = window.WAYCore || {};
var WAY = WAYCore;

(function ($) {
  //==========================================================================
  // WAY.Util
  //==========================================================================
  WAY.Util = {
    difference: function difference(a, b) {
      return a.filter(function (element) {
        return b.indexOf(element) === -1;
      });
    },
    fillArray: function fillArray(item, length) {
      var arr = [];

      for (var i = 0; i < length; i++) {
        arr[i] = item;
      }

      return arr;
    },
    filterText: function filterText(text, re, action) {
      var result = [];
      var match = null;

      while (match = re.exec(text)) {
        if (action(match)) {
          result.push(match);
        }
      }

      return result;
    },
    floorRand: function floorRand(max) {
      return Math.floor(Math.random() * max);
    },
    getEventComments: function getEventComments(eventId) {
      var event = $dataMap.events[eventId];
      var pages = event.pages;
      var allComments = "";
      pages.forEach(function (page) {
        var comments = "";
        page.list.forEach(function (command) {
          if (command.code === 108 || command.code === 408) {
            comments += "".concat(command.parameters[0], "\n");
          }
        });
        allComments += comments;
      });
      return allComments;
    },
    getMultiLineNotetag: function getMultiLineNotetag(text, tag, defaultValue) {
      var _this2 = this;

      var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
        return true;
      };
      var result = [];
      var re = new RegExp("<(".concat(tag, ")>([\\s\\S]*?)<(\\/").concat(tag, ")>"), "gi");
      var matches = WAY.Util.filterText(text, re, function (match) {
        return match[1].toLowerCase() === tag.toLowerCase();
      });
      matches.forEach(function (group) {
        return result.push(func.call(_this2, group[2]));
      });
      return result.length > 0 ? result[0] : defaultValue;
    },
    getNotetag: function getNotetag(text, tag, defaultValue) {
      var _this3 = this;

      var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
        return true;
      };
      var result = [];
      var re = /<([^<>:]+)(:?)([^>]*)>/g;
      var matches = WAY.Util.filterText(text, re, function (match) {
        return match[1].toLowerCase() === tag.toLowerCase();
      });
      matches.forEach(function (group) {
        return result.push(func.call(_this3, group[3]));
      });
      return result.length > 0 ? result[0] : defaultValue;
    },
    getNotetagList: function getNotetagList(text, tag, func) {
      var _this4 = this;

      var result = [];
      var re = /<([^<>:]+)(:?)([^>]*)>/g;
      var matches = WAY.Util.filterText(text, re, function (match) {
        return match[1].toLowerCase() === tag.toLowerCase();
      });
      matches.forEach(function (group) {
        return result.push(func.call(_this4, group[3]));
      });
      return result;
    },
    intersect: function intersect(a, b) {
      return a.filter(function (element) {
        return b.indexOf(element) > -1;
      });
    },
    isArray: function isArray(obj) {
      return obj && Array.isArray(obj);
    },
    isBool: function isBool(value) {
      return value === true || value === false || /^(:?true|false)$/i.test(value);
    },
    isFloat: function isFloat(value) {
      return Number(value) === value && value % 1 !== 0;
    },
    isInt: function isInt(value) {
      return Number(value) === value && Math.floor(value) === value;
    },
    isJsonString: function isJsonString(string) {
      try {
        JsonEx.parse(string);
      } catch (e) {
        return false;
      }

      return true;
    },
    isNumber: function isNumber(value) {
      return WAY.Util.isInt(value) || WAY.Util.isFloat(value);
    },
    isObj: function isObj(obj) {
      return obj && _typeof(obj) === "object";
    },
    isPlaytest: function isPlaytest() {
      return Utils.isOptionValid("test");
    },
    isScene: function isScene(scene) {
      return SceneManager._scene instanceof scene;
    },
    log: function log() {
      if (WAY.Util.isPlaytest()) {
        var _console;

        (_console = console).log.apply(_console, arguments); // eslint-disable-line no-console

      }
    },
    parseParameters: function parseParameters(params) {
      var obj;

      try {
        obj = JsonEx.parse(WAY.Util.isObj(params) ? JsonEx.stringify(params) : params);
      } catch (e) {
        return params;
      }

      if (WAY.Util.isObj(obj)) {
        Object.keys(obj).forEach(function (key) {
          obj[key] = WAY.Util.parseParameters(obj[key]); // If the parameter has no value, meaning it's an empty string,
          // just set it to null

          if (obj[key] === "") {
            obj[key] = null;
          }
        });
      }

      return obj;
    },
    tryEval: function tryEval(text) {
      try {
        return eval(text); // eslint-disable-line
      } catch (err) {
        return null;
      }
    },
    toArray: function toArray(str) {
      if (str.contains("to")) {
        var _str$split = str.split("to"),
            _str$split2 = _slicedToArray(_str$split, 2),
            start = _str$split2[0],
            end = _str$split2[1];

        start = parseInt(start, 10);
        end = parseInt(end, 10);
        return Array.from(Array(end + 1 - start), function (e, index) {
          return start + index;
        });
      }

      return JSON.parse("[".concat(str, "]"));
    },
    toBool: function toBool(string) {
      if (/^true$/i.test(string)) {
        return true;
      } else if (/^false$/i.test(string)) {
        return false;
      }

      return null;
    },
    toInt: function toInt(value) {
      var num = parseInt(value, 10);
      return num - num % 1;
    },
    toObj: function toObj(string) {
      if (WAY.Util.isJsonString(string)) {
        return JsonEx.parse(string);
      }

      var createObjProperty = function createObjProperty(pair) {
        var _pair$split$map = pair.split(":").map(WAY.Util.trim),
            _pair$split$map2 = _slicedToArray(_pair$split$map, 2),
            key = _pair$split$map2[0],
            value = _pair$split$map2[1];

        if (WAY.Util.isNumber(parseInt(value, 10))) {
          return _defineProperty({}, key, Number(value, 10));
        } else if (WAY.Util.isBool(value)) {
          return _defineProperty({}, key, WAY.Util.toBool(value));
        }

        return _defineProperty({}, key, value);
      };

      return Object.assign.apply(Object, [{}].concat(_toConsumableArray(string.replace(/,/g, "\n").split(/[\r\n]+/).filter(function (key) {
        return key !== "";
      }).map(createObjProperty))));
    },
    trim: function trim(string) {
      return string.trim();
    }
  }; //==========================================================================
  // WAY.EventEmitter
  //==========================================================================

  WAY.EventEmitter = WAY.EventEmitter || new PIXI.utils.EventEmitter(); //==========================================================================
  // WAY.Window
  //==========================================================================

  WAY.Window = {
    TitleWindow: /*#__PURE__*/function (_Window_Base) {
      _inherits(TitleWindow, _Window_Base);

      var _super = _createSuper(TitleWindow);

      function TitleWindow() {
        var _this5;

        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Graphics.boxWidth;
        var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 72;

        _classCallCheck(this, TitleWindow);

        _this5 = _super.call(this, x, y, width, height);
        _this5._title = "";
        return _possibleConstructorReturn(_this5, _assertThisInitialized(_this5));
      }

      _createClass(TitleWindow, [{
        key: "setTitle",
        value: function setTitle(title) {
          this._title = title;
          this.refresh();
          return this;
        }
      }, {
        key: "refresh",
        value: function refresh() {
          this.contents.clear();
          var text = this._title;
          var dw = this.contents.width + this.textPadding();
          var tw = this.textWidthEx(text);
          var dx = Math.floor(Math.max(0, dw - tw) / 2);
          this.drawTextEx(text, this.textPadding() + dx, 0);
        }
      }]);

      return TitleWindow;
    }(Window_Base)
  }; //==========================================================================
  // Game_Interpreter
  //==========================================================================

  $.alias.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;

  DataManager.isDatabaseLoaded = function () {
    if (!$.alias.DataManager_isDatabaseLoaded.call(this)) {
      return false;
    }

    var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons, $dataArmors, $dataEnemies, $dataStates];
    list.forEach(function (objects, index) {
      return loadNotetags(objects, index);
    });
    return true;
  };

  $.alias.DataManager_onLoad = DataManager.onLoad;

  DataManager.onLoad = function (object) {
    $.alias.DataManager_onLoad.call(this, object);

    if (object === $dataMap) {
      WAY.EventEmitter.emit("load-map-notetags", $dataMap);
    }
  };

  function loadNotetags(objects, index) {
    var strings = ["actor", "class", "skill", "item", "weapon", "armor", "enemy", "state"];
    objects.forEach(function (data) {
      if (data) {
        WAY.EventEmitter.emit("load-".concat(strings[index], "-notetags"), data);
      }
    });
  } //==========================================================================
  // PluginManager
  //==========================================================================


  PluginManager._commands = {};

  PluginManager.addCommand = function (command, actions) {
    PluginManager._commands[command] = actions;
  };

  PluginManager.isCommand = function (command) {
    return typeof PluginManager._commands[command] !== "undefined";
  };

  PluginManager.getCommand = function (command) {
    if (this.isCommand(command)) {
      return PluginManager._commands[command];
    }

    return false;
  }; //==========================================================================
  // Game_Interpreter
  //==========================================================================


  $.alias.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    var actions = PluginManager.getCommand(command);

    if (actions) {
      var action = actions[args[0]];

      if (typeof action === "function") {
        action.apply(this, args.slice(1));
      }
    } else {
      $.alias.Game_Interpreter_pluginCommand.call(this, command, args);
    }
  }; //==========================================================================
  // Window_Base
  //==========================================================================


  if (!Window_Base.prototype.textWidthEx) {
    Window_Base.prototype.textWidthEx = function (text) {
      return this.drawTextEx(text, 0, this.contents.height);
    };
  }
})(WAYModuleLoader.getModule("WAY_Core"));
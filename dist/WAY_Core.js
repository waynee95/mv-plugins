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
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
*/

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Imported = window.Imported || {};

//=============================================================================
// WAYModuleLoader
//=============================================================================
var WAYModuleLoader = function () {
    var plugins = {};
    function parseParameters(params) {
        if (WAY === undefined) {
            return params;
        }
        return WAY.Util.parseParameters(params);
    }

    function compareVersions(currentVersion) {
        var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '==';
        var requiredVersion = arguments[2];

        var length = Math.max(currentVersion.length, requiredVersion.length);
        var compare = 0;
        var operation = {
            '<': function () {
                function _() {
                    return compare < 0;
                }

                return _;
            }(),
            '<=': function () {
                function _() {
                    return compare <= 0;
                }

                return _;
            }(),
            '==': function () {
                function _() {
                    return compare === 0;
                }

                return _;
            }(),
            '>': function () {
                function _() {
                    return compare > 0;
                }

                return _;
            }(),
            '>=': function () {
                function _() {
                    return compare >= 0;
                }

                return _;
            }()
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
        checkRequirements: function () {
            function checkRequirements(key) {
                var _this = this;

                var list = '';
                plugins[key].required.forEach(function (_ref) {
                    var name = _ref.name,
                        version = _ref.version;

                    if (!_this.isImported(name)) {
                        list += String(name) + '\n';
                    } else if (version) {
                        var _version$split$revers = version.split(' ').reverse(),
                            _version$split$revers2 = _slicedToArray(_version$split$revers, 2),
                            requiredVersion = _version$split$revers2[0],
                            operator = _version$split$revers2[1];

                        if (!_this.checkVersion(name, operator, requiredVersion)) {
                            list += String(name) + ' needs to be ' + String(operator) + ' version ' + String(requiredVersion) + '!\n';
                        }
                    }
                });
                if (list) {
                    WAYModuleLoader.printError(list, key);
                }
            }

            return checkRequirements;
        }(),
        printError: function () {
            function printError(msg, key) {
                var strA = 'Error loading ' + String(key) + '\n\n';
                var strB = 'The following plugins are required:\n' + String(msg) + '\n';
                var strC = 'Place the required plugins above ' + String(key) + '!';
                console.error(strA + strB + strC); //eslint-disable-line no-console
                if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                    var gui = require('nw.gui'); //eslint-disable-line
                    gui.Window.get().showDevTools();
                }
                SceneManager.stop();
            }

            return printError;
        }(),
        checkVersion: function () {
            function checkVersion(key, operator, requiredVersion) {
                if (this.isImported(key)) {
                    var currentVersion = plugins[key].version;
                    return compareVersions(currentVersion, operator, requiredVersion);
                }
                return false;
            }

            return checkVersion;
        }(),
        getModule: function () {
            function getModule(key) {
                if (this.isImported(key)) {
                    return plugins[key];
                }
                return false;
            }

            return getModule;
        }(),
        getPluginParameters: function () {
            function getPluginParameters(key) {
                return window.$plugins.filter(function (p) {
                    return p.description.indexOf('<' + String(key) + '>') > -1;
                })[0].parameters;
            }

            return getPluginParameters;
        }(),
        isImported: function () {
            function isImported(key) {
                return typeof plugins[key] !== 'undefined';
            }

            return isImported;
        }(),
        registerPlugin: function () {
            function registerPlugin(key, version, author) {
                for (var _len = arguments.length, required = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                    required[_key - 3] = arguments[_key];
                }

                if (this.isImported(key)) {
                    return false;
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

            return registerPlugin;
        }()
    };
}();

WAYModuleLoader.registerPlugin('WAY_Core', '2.0.0', 'waynee95');

var WAYCore = window.WAYCore || {};
var WAY = WAYCore;

(function ($) {
    //=============================================================================
    // WAY.Util
    //=============================================================================
    WAY.Util = {
        difference: function () {
            function difference(a, b) {
                return a.filter(function (element) {
                    return b.indexOf(element) === -1;
                });
            }

            return difference;
        }(),
        fillArray: function () {
            function fillArray(item, length) {
                return Array.apply(undefined, _toConsumableArray({
                    length: length
                })) // eslint-disable-line
                .map(function () {
                    return item;
                });
            }

            return fillArray;
        }(),
        filterText: function () {
            function filterText(text, re, action) {
                var result = [];
                var match = null;
                while (match = re.exec(text)) {
                    if (action(match)) {
                        result.push(match);
                    }
                }
                return result;
            }

            return filterText;
        }(),
        floorRand: function () {
            function floorRand(max) {
                return Math.floor(Math.random() * max);
            }

            return floorRand;
        }(),
        getEventComments: function () {
            function getEventComments(eventId) {
                var event = $dataMap.events[eventId];
                var pages = event.pages;

                var allComments = '';
                pages.forEach(function (page) {
                    var comments = '';
                    page.list.forEach(function (command) {
                        if (command.code === 108 || command.code === 408) {
                            comments += String(command.parameters[0]) + '\n';
                        }
                    });
                    allComments += comments;
                });

                return allComments;
            }

            return getEventComments;
        }(),
        getMultiLineNotetag: function () {
            function getMultiLineNotetag(text, tag, defaultValue) {
                var _this2 = this;

                var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
                    return true;
                };

                var result = [];
                var re = new RegExp('<(' + String(tag) + ')>([\\s\\S]*?)<(\\/' + String(tag) + ')>', 'gi');
                var matches = WAY.Util.filterText(text, re, function (match) {
                    return match[1].toLowerCase() === tag.toLowerCase();
                });
                matches.forEach(function (group) {
                    return result.push(func.call(_this2, group[2]));
                });
                return result.length > 0 ? result[0] : defaultValue;
            }

            return getMultiLineNotetag;
        }(),
        getNotetag: function () {
            function getNotetag(text, tag, defaultValue) {
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
            }

            return getNotetag;
        }(),
        getNotetagList: function () {
            function getNotetagList(text, tag, func) {
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
            }

            return getNotetagList;
        }(),
        intersect: function () {
            function intersect(a, b) {
                return a.filter(function (element) {
                    return b.indexOf(element) > -1;
                });
            }

            return intersect;
        }(),
        isArray: function () {
            function isArray(obj) {
                return obj && Array.isArray(obj);
            }

            return isArray;
        }(),
        isBool: function () {
            function isBool(value) {
                return value === true || value === false || /^(:?true|false)$/i.test(value);
            }

            return isBool;
        }(),
        isFloat: function () {
            function isFloat(value) {
                return Number(value) === value && value % 1 !== 0;
            }

            return isFloat;
        }(),
        isInt: function () {
            function isInt(value) {
                return Number(value) === value && Math.floor(value) === value;
            }

            return isInt;
        }(),
        isJsonString: function () {
            function isJsonString(string) {
                try {
                    JsonEx.parse(string);
                } catch (e) {
                    return false;
                }
                return true;
            }

            return isJsonString;
        }(),
        isNumber: function () {
            function isNumber(value) {
                return WAY.Util.isInt(value) || WAY.Util.isFloat(value);
            }

            return isNumber;
        }(),
        isObj: function () {
            function isObj(obj) {
                return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
            }

            return isObj;
        }(),
        isPlaytest: function () {
            function isPlaytest() {
                return Utils.isOptionValid('test');
            }

            return isPlaytest;
        }(),
        isScene: function () {
            function isScene(scene) {
                return SceneManager._scene instanceof scene;
            }

            return isScene;
        }(),
        log: function () {
            function log() {
                if (WAY.Util.isPlaytest()) {
                    var _console;

                    (_console = console).log.apply(_console, arguments); //eslint-disable-line no-console
                }
            }

            return log;
        }(),
        parseParameters: function () {
            function parseParameters(params) {
                var obj = void 0;
                try {
                    obj = JsonEx.parse(WAY.Util.isObj(params) ? JsonEx.stringify(params) : params);
                } catch (e) {
                    return params;
                }
                if (WAY.Util.isObj(obj)) {
                    Object.keys(obj).forEach(function (key) {
                        obj[key] = WAY.Util.parseParameters(obj[key]);

                        // If the parameter has no value, meaning it's an empty string,
                        // just set it to null
                        if (obj[key] === '') {
                            obj[key] = null;
                        }
                    });
                }
                return obj;
            }

            return parseParameters;
        }(),
        tryEval: function () {
            function tryEval(text) {
                try {
                    return eval(text); // eslint-disable-line
                } catch (err) {
                    return null;
                }
            }

            return tryEval;
        }(),
        toArray: function () {
            function toArray(str) {
                if (str.contains('to')) {
                    var _str$split = str.split('to'),
                        _str$split2 = _slicedToArray(_str$split, 2),
                        from = _str$split2[0],
                        to = _str$split2[1];

                    to = parseInt(to, 10);
                    from = parseInt(from, 10);
                    return WAY.Util.arrayFromRange(from, to);
                }
                return JSON.parse('[' + String(str) + ']');
            }

            return toArray;
        }(),
        toBool: function () {
            function toBool(string) {
                if (/^true$/i.test(string)) {
                    return true;
                } else if (/^false$/i.test(string)) {
                    return false;
                }
                return null;
            }

            return toBool;
        }(),
        toInt: function () {
            function toInt(value) {
                var num = parseInt(value, 10);
                return num - num % 1;
            }

            return toInt;
        }(),
        toObj: function () {
            function toObj(string) {
                if (WAY.Util.isJsonString(string)) {
                    return JsonEx.parse(string);
                }
                var createObjProperty = function () {
                    function createObjProperty(pair) {
                        var _pair$split$map = pair.split(':').map(WAY.Util.trim),
                            _pair$split$map2 = _slicedToArray(_pair$split$map, 2),
                            key = _pair$split$map2[0],
                            value = _pair$split$map2[1];

                        if (WAY.Util.isNumber(parseInt(value, 10))) {
                            return _defineProperty({}, key, Number(value, 10));
                        } else if (WAY.Util.isBool(value)) {
                            return _defineProperty({}, key, WAY.Util.toBool(value));
                        }
                        return _defineProperty({}, key, value);
                    }

                    return createObjProperty;
                }();
                return Object.assign.apply(Object, [{}].concat(_toConsumableArray(string.replace(/,/g, '\n').split(/[\r\n]+/).filter(function (key) {
                    return key !== '';
                }).map(createObjProperty))));
            }

            return toObj;
        }(),
        trim: function () {
            function trim(string) {
                return string.trim();
            }

            return trim;
        }()
    };

    //=============================================================================
    // WAY.EventEmitter
    //=============================================================================
    WAY.EventEmitter = WAY.EventEmitter || new PIXI.utils.EventEmitter();

    //=============================================================================
    // WAY.Window
    //=============================================================================
    WAY.Window = {
        TitleWindow: function (_Window_Base) {
            _inherits(TitleWindow, _Window_Base);

            function TitleWindow() {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Graphics.boxWidth;

                var _ret;

                var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 72;

                _classCallCheck(this, TitleWindow);

                var _this5 = _possibleConstructorReturn(this, (TitleWindow.__proto__ || Object.getPrototypeOf(TitleWindow)).call(this, x, y, width, height));

                _this5._title = '';
                return _ret = _this5, _possibleConstructorReturn(_this5, _ret);
            }

            _createClass(TitleWindow, [{
                key: 'setTitle',
                value: function () {
                    function setTitle(title) {
                        this._title = title;
                        this.refresh();
                        return this;
                    }

                    return setTitle;
                }()
            }, {
                key: 'refresh',
                value: function () {
                    function refresh() {
                        this.contents.clear();
                        var text = this._title;
                        var dw = this.contents.width + this.textPadding();
                        var tw = this.textWidthEx(text);
                        var dx = Math.floor(Math.max(0, dw - tw) / 2);
                        this.drawTextEx(text, this.textPadding() + dx, 0);
                    }

                    return refresh;
                }()
            }]);

            return TitleWindow;
        }(Window_Base)
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================
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
            WAY.EventEmitter.emit('load-map-notetags', $dataMap);
        }
    };

    function loadNotetags(objects, index) {
        var strings = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
        objects.forEach(function (data) {
            if (data) {
                WAY.EventEmitter.emit('load-' + String(strings[index]) + '-notetags', data);
            }
        });
    };

    //=============================================================================
    // PluginManager
    //=============================================================================
    PluginManager._commands = {};

    PluginManager.addCommand = function (command, actions) {
        PluginManager._commands[command] = actions;
    };

    PluginManager.isCommand = function (command) {
        return typeof PluginManager._commands[command] !== 'undefined';
    };

    PluginManager.getCommand = function (command) {
        if (this.isCommand(command)) {
            return PluginManager._commands[command];
        }
        return false;
    };

    //=============================================================================
    // Game_Interpreter
    //=============================================================================
    $.alias.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        var actions = PluginManager.getCommand(command);
        if (actions) {
            var action = actions[args[0]];
            if (typeof action === 'function') {
                action.apply(this, args.slice(1));
            }
        } else {
            $.alias.Game_Interpreter_pluginCommand.call(this, command, args);
        }
    };

    //=============================================================================
    // Window_Base
    //=============================================================================
    if (!Window_Base.prototype.textWidthEx) {
        Window_Base.prototype.textWidthEx = function (text) {
            return this.drawTextEx(text, 0, this.contents.height);
        };
    }
})(WAYModuleLoader.getModule('WAY_Core'));
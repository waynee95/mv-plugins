/* eslint no-use-before-define: 0 */
// ===========================================================================
// WAY_Core.js
// ===========================================================================
/*:
@plugindesc v1.5.1 WAY Core Utility Plugin. Place it above all WAY plugins. <WAY_Core>
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
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Imported = Imported || {};

var WAYModuleLoader = function () {
    var plugins = {};
    function parseStruct(params) {
        if (WAY === undefined) {
            return params;
        }
        return WAY.Util.parseStruct(params);
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

    function printError(msg, key) {
        var strA = 'Error loading' + String(key) + '\n\n';
        var strB = 'The following plugins are required:\n' + String(msg) + '\n';
        var strC = 'Place the required plugins above ' + String(key) + '!';
        console.error(strA + strB + strC); //eslint-disable-line no-console
        if (Utils.isNwjs() && Utils.isOptionValid('test')) {
            var gui = require('nw.gui'); //eslint-disable-line
            gui.Window.get().showDevTools();
        }
        SceneManager.stop();
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
                    printError(list, key);
                }
            }

            return checkRequirements;
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
                    parameters: parseStruct(this.getPluginParameters(key)),
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

WAYModuleLoader.registerPlugin('WAY_Core', '1.5.1', 'waynee95');

var WAYCore = WAYCore || {};
var WAY = WAYCore;

(function ($) {
    var Utilities = function () {
        function Utilities() {
            return {
                arrayFromRange: function () {
                    function arrayFromRange(start, end) {
                        return Array.apply(null, { length: end - start + 1 }) // eslint-disable-line
                        .map(function (e, index) {
                            return start + index;
                        });
                    }

                    return arrayFromRange;
                }(),
                arrayMax: function () {
                    function arrayMax(arr) {
                        return arr.reduce(function (acc, val) {
                            return acc > val ? acc : val;
                        });
                    }

                    return arrayMax;
                }(),
                arrayMin: function () {
                    function arrayMin(arr) {
                        return arr.reduce(function (acc, val) {
                            return acc < val ? acc : val;
                        });
                    }

                    return arrayMin;
                }(),
                average: function () {
                    function average(arr) {
                        return arr.reduce(function (acc, val) {
                            return acc + val;
                        }) / arr.length;
                    }

                    return average;
                }(),
                clean: function () {
                    function clean(arr) {
                        return arr.filter(function (element) {
                            return WAY.Util.exists(element);
                        });
                    }

                    return clean;
                }(),
                clip: function () {
                    function clip(num, lower, upper) {
                        return Math.max(lower, Math.min(num, upper));
                    }

                    return clip;
                }(),
                concatAll: function () {
                    function concatAll() {
                        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                            args[_key2] = arguments[_key2];
                        }

                        return args.reduce(function (acc, val) {
                            return [].concat(_toConsumableArray(acc), _toConsumableArray(val));
                        });
                    }

                    return concatAll;
                }(),
                difference: function () {
                    function difference(a, b) {
                        return a.filter(function (element) {
                            return b.indexOf(element) === -1;
                        });
                    }

                    return difference;
                }(),
                extend: function () {
                    function extend(obj, name, func) {
                        var orig = obj[name];
                        obj[name] = function () {
                            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                                args[_key3] = arguments[_key3];
                            }

                            orig.apply(this, args);
                            func.apply(this, args);
                        };
                    }

                    return extend;
                }(),
                exists: function () {
                    function exists(value) {
                        return value !== undefined && value !== null;
                    }

                    return exists;
                }(),
                filter: function () {
                    function filter(obj, func) {
                        if (WAY.Util.isArray(obj)) {
                            return obj.filter(function (element) {
                                return func(element);
                            });
                        }
                        return Object.keys(obj).filter(function (key) {
                            return func(obj[key]);
                        }).reduce(function (res, key) {
                            return Object.assign(res, _defineProperty({}, key, obj[key]));
                        }, {});
                    }

                    return filter;
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
                flatten: function () {
                    function flatten(arr) {
                        return arr.reduce(function (acc, val) {
                            return acc.concat(val);
                        }, []);
                    }

                    return flatten;
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
                    function getMultiLineNotetag(text, tag, defaultValue, func) {
                        var _this2 = this;

                        var result = [];
                        var re = new RegExp('<(' + String(tag) + ')>([\\s\\S]*?)<(\\/' + String(tag) + ')>', 'g');
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
                    function getNotetag(text, tag, defaultValue, func) {
                        var _this3 = this;

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
                insert: function () {
                    function insert(arr, item) {
                        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : arr.length;

                        arr.splice(index, 0, item);
                    }

                    return insert;
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
                        return Object.prototype.toString.apply(obj) === '[object Array]';
                    }

                    return isArray;
                }(),
                isBool: function () {
                    function isBool(value) {
                        return value === true || value === false || /^(:?true|false)$/i.test(value);
                    }

                    return isBool;
                }(),
                isEmpty: function () {
                    function isEmpty(obj) {
                        return WAY.Util.isObj(obj) && Object.keys(obj).length < 1;
                    }

                    return isEmpty;
                }(),
                isFloat: function () {
                    function isFloat(value) {
                        return Number(value) === value && value % 1 !== 0;
                    }

                    return isFloat;
                }(),
                isFunction: function () {
                    function isFunction(obj) {
                        return obj && {}.toString.call(obj) === '[object Function]';
                    }

                    return isFunction;
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
                isObject: function () {
                    function isObject(obj) {
                        return obj && Object.prototype.toString.apply(obj) === '[object Object]';
                    }

                    return isObject;
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
                map: function () {
                    function map(obj, func) {
                        if (WAY.Util.isArray(obj)) {
                            return obj.map(func);
                        }
                        return Object.assign.apply(Object, [{}].concat(_toConsumableArray(Object.keys(obj).map(function (key) {
                            return _defineProperty({}, key, func(obj[key]));
                        }))));
                    }

                    return map;
                }(),
                negate: function () {
                    function negate(num) {
                        return num * -1;
                    }

                    return negate;
                }(),
                parseStruct: function () {
                    function parseStruct(params) {
                        var parseKey = function () {
                            function parseKey(key) {
                                var value = params[key];
                                if (WAY.Util.isNumber(parseInt(value, 10))) {
                                    params[key] = Number(value);
                                } else if (WAY.Util.isBool(value)) {
                                    params[key] = WAY.Util.toBool(value);
                                } else {
                                    try {
                                        var obj = JsonEx.parse(value);
                                        if (WAY.Util.isObj(obj)) {
                                            params[key] = WAY.Util.parseStruct(obj);
                                        }
                                    } catch (e) {
                                        throw e.message;
                                    }
                                }
                            }

                            return parseKey;
                        }();
                        Object.keys(params).forEach(function (key) {
                            return parseKey(key);
                        });
                        return params;
                    }

                    return parseStruct;
                }(),
                pick: function () {
                    function pick(arr, index) {
                        if (index === undefined) {
                            return arr[WAY.Util.floorRand(arr.length)];
                        }
                        return arr[index];
                    }

                    return pick;
                }(),
                piper: function () {
                    function piper() {
                        for (var _len4 = arguments.length, steps = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                            steps[_key4] = arguments[_key4];
                        }

                        return function () {
                            var _this4 = this;

                            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                                args[_key5] = arguments[_key5];
                            }

                            var value = steps[0].apply(this, args);
                            steps.slice(1).forEach(function (step) {
                                return value = step.call(_this4, value);
                            });
                            return value;
                        };
                    }

                    return piper;
                }(),
                pluck: function () {
                    function pluck(key) {
                        return function (obj) {
                            return obj[key];
                        };
                    }

                    return pluck;
                }(),
                randomBetween: function () {
                    function randomBetween(min, max) {
                        return WAY.Util.floorRand(max + 1 - min) + min;
                    }

                    return randomBetween;
                }(),
                remove: function () {
                    function remove(arr, item) {
                        var index = arr.indexOf(item);
                        if (index > -1) {
                            arr.splice(index, 1);
                        }
                    }

                    return remove;
                }(),
                showError: function () {
                    function showError(msg) {
                        console.error(msg); //eslint-disable-line
                        if (Utils.isNwjs() && WAY.Util.isPlaytest()) {
                            var gui = require('nw.gui'); //eslint-disable-line
                            gui.Window.get().showDevTools();
                        }
                    }

                    return showError;
                }(),
                shuffle: function () {
                    function shuffle(arr) {
                        var temp = void 0;
                        var current = void 0;
                        var top = arr.length;
                        if (top) {
                            while (top--) {
                                current = WAY.Util.floorRand(top + 1);
                                temp = arr[current];
                                arr[current] = arr[top];
                                arr[top] = temp;
                            }
                        }
                        return arr;
                    }

                    return shuffle;
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
                        if (/^(:?true)$/i.test(string)) {
                            return true;
                        } else if (/^(:?false)$/i.test(string)) {
                            return false;
                        }
                        return null;
                    }

                    return toBool;
                }(),
                toInt: function () {
                    function toInt(value) {
                        return WAY.Util.piper(parseInt, function (num) {
                            return num - num % 1;
                        })(value);
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
                }(),
                unique: function () {
                    function unique(arr) {
                        return arr.filter(function (element, index) {
                            return arr.indexOf(element) === index;
                        });
                    }

                    return unique;
                }()
            };
        }

        return Utilities;
    }();
    WAY.Util = Utilities();

    var EventEmitter = function () {
        function EventEmitter() {
            return new PIXI.utils.EventEmitter();
        }

        return EventEmitter;
    }();
    WAY.EventEmitter = EventEmitter();

    (function (DataManager, alias) {
        var loadNotetags = function () {
            function loadNotetags(objects, index) {
                var strings = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
                objects.forEach(function (data) {
                    if (data) {
                        WAY.EventEmitter.emit('load-' + String(strings[index]) + '-notetags', data);
                    }
                });
            }

            return loadNotetags;
        }();
        alias.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
        DataManager.isDatabaseLoaded = function () {
            if (!alias.DataManager_isDatabaseLoaded.call(this)) {
                return false;
            }
            var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons, $dataArmors, $dataEnemies, $dataStates];
            list.forEach(function (objects, index) {
                return loadNotetags(objects, index);
            });
            return true;
        };
    })(DataManager, $.alias);

    (function (PluginManager) {
        var commands = {};
        PluginManager.addCommand = function (command, actions) {
            commands[command] = actions;
        };
        PluginManager.isCommand = function (command) {
            return typeof commands[command] !== 'undefined';
        };
        PluginManager.getCommand = function (command) {
            if (this.isCommand(command)) {
                return commands[command];
            }
            return false;
        };
    })(PluginManager);

    (function (GameInterpreter, alias) {
        alias.Game_Interpreter_pluginCommand = GameInterpreter.pluginCommand;
        WAY.Util.extend(Game_Interpreter.prototype, 'pluginCommand', function (command, args) {
            var actions = PluginManager.getCommand(command);
            if (actions) {
                var action = actions[args[0]];
                if (typeof action === 'function') {
                    action.apply(this, args.slice(1));
                }
            }
        });
    })(Game_Interpreter, $.alias);
})(WAYModuleLoader.getModule('WAY_Core'));

// Load data from save files
// Persist data through save files
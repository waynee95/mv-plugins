// ===========================================================================
// WAY_Core.js
// ===========================================================================
/**
 * @file WAY Core is a Utility plugin for RPG Maker MV Plugin Developement.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc WAY Core Utility Plugin. Place it above all WAY plugins. <WAY_Core>
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
TODO: Link to website

==============================================================================
 ■ Version History
==============================================================================
v1.0.0 - 23.10.2017 : Initial Release
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Imported = Imported || {};

var WAYModuleLoader = function () {
    function WAYModuleLoader() {
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
            var operation = {
                '<': function () {
                    function less() {
                        return compare < 0;
                    }

                    return less;
                }(),
                '<=': function () {
                    function lessEqual() {
                        return compare <= 0;
                    }

                    return lessEqual;
                }(),
                '==': function () {
                    function equal() {
                        return compare === 0;
                    }

                    return equal;
                }(),
                '>': function () {
                    function greater() {
                        return compare > 0;
                    }

                    return greater;
                }(),
                '>=': function () {
                    function greaterEqual() {
                        return compare >= 0;
                    }

                    return greaterEqual;
                }()
            };
            var compare = 0;
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
    }

    return WAYModuleLoader;
}()();

WAYModuleLoader.registerPlugin('WAY_Core', '0.0.0', 'waynee95');

var WAYCore = WAYCore || {};

var WAY = WAYCore;

(function ($) {
    var Utilities = function () {
        function Utilities() {
            return {
                arrayFromRange: function () {
                    function arrayFromRange(start, end) {
                        return Array.from(Array(end + 1 - start), function (e, index) {
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
                clean: function () {
                    function clean(arr) {
                        var _this2 = this;

                        return arr.filter(function (element) {
                            return _this2.exists(element);
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
                diffArray: function () {
                    function diffArray(a, b) {
                        return a.filter(function (element) {
                            return b.indexOf(element) === -1;
                        });
                    }

                    return diffArray;
                }(),
                executeCode: function () {
                    function executeCode(string) {
                        try {
                            eval(string); // eslint-disable-line no-eval
                        } catch (e) {
                            throw e.message;
                        }
                    }

                    return executeCode;
                }(),
                exists: function () {
                    function exists(value) {
                        return value !== undefined && value !== null;
                    }

                    return exists;
                }(),
                filter: function () {
                    function filter(obj, func) {
                        if (this.isArray(obj)) {
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
                getMultiLineNotetag: function () {
                    function getMultiLineNotetag(text, tag, defaultValue, func) {
                        var _this3 = this;

                        var result = [];
                        var re = /<([^<>]+)>([\s\S]*?)<(\/[^<>]+)>/g;
                        var matches = this.filterText(text, re, function (match) {
                            return match[1].toLowerCase() === tag.toLowerCase();
                        });
                        matches.forEach(function (group) {
                            return result.push(func.call(_this3, group[2]));
                        });
                        return result.length > 0 ? result[0] : defaultValue;
                    }

                    return getMultiLineNotetag;
                }(),
                getNotetag: function () {
                    function getNotetag(text, tag, defaultValue, func) {
                        var _this4 = this;

                        var result = [];
                        var re = /<([^<>:]+)(:?)([^>]*)>/g;
                        var matches = this.filterText(text, re, function (match) {
                            return match[1].toLowerCase() === tag.toLowerCase();
                        });
                        matches.forEach(function (group) {
                            return result.push(func.call(_this4, group[3]));
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
                intersectArray: function () {
                    function intersectArray(a, b) {
                        return a.filter(function (element) {
                            return b.indexOf(element) > -1;
                        });
                    }

                    return intersectArray;
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
                        return this.isObj(obj) && Object.keys(obj).length < 1;
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
                        return this.isInt(value) || this.isFloat(value);
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
                log: function () {
                    function log() {
                        if (this.isPlaytest()) {
                            var _console;

                            (_console = console).log.apply(_console, arguments); //eslint-disable-line no-console
                        }
                    }

                    return log;
                }(),
                map: function () {
                    function map(obj, func) {
                        if (this.isArray(obj)) {
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
                        var _this5 = this;

                        var parseKey = function () {
                            function parseKey(key) {
                                var value = params[key];
                                if (_this5.isNumber(parseInt(value, 10))) {
                                    params[key] = Number(value);
                                } else if (_this5.isBool(value)) {
                                    params[key] = _this5.toBool(value);
                                } else {
                                    try {
                                        var obj = JsonEx.parse(value);
                                        if (_this5.isObj(obj)) {
                                            params[key] = _this5.parseStruct(obj);
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
                            return arr[this.floorRand(arr.length)];
                        }
                        return arr[index];
                    }

                    return pick;
                }(),
                piper: function () {
                    function piper() {
                        for (var _len3 = arguments.length, steps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                            steps[_key3] = arguments[_key3];
                        }

                        return function () {
                            function pipe() {
                                var _this6 = this;

                                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                                    args[_key4] = arguments[_key4];
                                }

                                var value = steps[0].apply(this, args);
                                steps.slice(1).forEach(function (step) {
                                    return value = step.call(_this6, value);
                                });
                                return value;
                            }

                            return pipe;
                        }();
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
                        return this.floorRand(max + 1 - min) + min;
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
                        this.log(msg);
                        if (Utils.isNwjs() && this.isPlaytest()) {
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
                                current = this.floorRand(top + 1);
                                temp = arr[current];
                                arr[current] = arr[top];
                                arr[top] = temp;
                            }
                        }
                        return arr;
                    }

                    return shuffle;
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
                        return this.piper(parseInt, function (num) {
                            return num - num % 1;
                        })(value);
                    }

                    return toInt;
                }(),
                toObj: function () {
                    function toObj(string) {
                        var _this7 = this;

                        if (this.isJsonString(string)) {
                            return JsonEx.parse(string);
                        }
                        var createObjProperty = function () {
                            function createObjProperty(pair) {
                                var _pair$split$map = pair.split(':').map(_this7.trim),
                                    _pair$split$map2 = _slicedToArray(_pair$split$map, 2),
                                    key = _pair$split$map2[0],
                                    value = _pair$split$map2[1];

                                if (_this7.isNumber(parseInt(value, 10))) {
                                    return _defineProperty({}, key, Number(value, 10));
                                } else if (_this7.isBool(value)) {
                                    return _defineProperty({}, key, _this7.toBool(value));
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
                uniqueArray: function () {
                    function uniqueArray(arr) {
                        return arr.filter(function (element, index) {
                            return arr.indexOf(element) === index;
                        });
                    }

                    return uniqueArray;
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
            function isDatabaseLoaded() {
                if (!alias.DataManager_isDatabaseLoaded.call(this)) {
                    return false;
                }
                var list = [$dataActors, $dataClasses, $dataSkills, $dataItems, $dataWeapons, $dataArmors, $dataEnemies, $dataStates];
                list.forEach(function (objects, index) {
                    return loadNotetags(objects, index);
                });
                return ImageManager.isReady();
            }

            return isDatabaseLoaded;
        }();
    })(DataManager, $.alias);

    (function (PluginManager) {
        var commands = {};
        PluginManager.addCommand = function () {
            function addCommand(command, actions) {
                commands[command] = actions;
            }

            return addCommand;
        }();
        PluginManager.isCommand = function () {
            function isCommand(command) {
                return typeof commands[command] !== 'undefined';
            }

            return isCommand;
        }();
        PluginManager.getCommand = function () {
            function getCommand(command) {
                if (this.isCommand(command)) {
                    return commands[command];
                }
                return false;
            }

            return getCommand;
        }();
    })(PluginManager);

    (function (GameInterpreter, alias) {
        alias.Game_Interpreter_pluginCommand = GameInterpreter.pluginCommand;
        GameInterpreter.pluginCommand = function () {
            function pluginCommand(command, args) {
                var actions = PluginManager.getCommand(command);
                if (actions) {
                    var action = actions[args[0]];
                    if (typeof action === 'function') {
                        action.apply(this, args.slice(1));
                    }
                } else {
                    alias.Game_Interpreter_pluginCommand.call(this, command, args);
                }
            }

            return pluginCommand;
        }();
    })(Game_Interpreter.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_Core'));
/* eslint no-use-before-define: 0 */
// ===========================================================================
// WAY_Core.js
// ===========================================================================
/*:
@plugindesc v1.9.1 WAY Core Utility Plugin. Place it above all WAY plugins. <WAY_Core>
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Imported = window.Imported || {};

var WAYModuleLoader = function () {
    var plugins = {};
    function parseParameters(params) {
        if (WAY === undefined) {
            return params;
        }
        return WAY.Util.parseParameters(params);
    }

    function compareVersions(currentVersion) {
        var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '>=';
        var requiredVersion = arguments[2];

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
        var array = currentVersion.length > requiredVersion.length ? currentVersion : requiredVersion;
        array.split('.').every(function (num, i) {
            if (currentVersion[i] < requiredVersion[i]) {
                compare = -1;
                return false;
            } else if (currentVersion[i] > requiredVersion[i]) {
                compare = 1;
                return false;
            }
            return true;
        });
        return operation[operator]();
    }

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

WAYModuleLoader.registerPlugin('WAY_Core', '1.9.1', 'waynee95');

var WAYCore = window.WAYCore || {};
var WAY = WAYCore;

(function ($) {
    var Utilities = function Utilities() {
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
            cleanArray: function () {
                function cleanArray(arr) {
                    return arr.filter(function (element) {
                        return WAY.Util.exists(element);
                    });
                }

                return cleanArray;
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
            countWords: function () {
                function countWords(str, word) {
                    var subStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                    var re = subStr ? new RegExp('^' + String(word) + '$', 'g') : new RegExp(word, 'g');
                    return (str.match(re) || []).length;
                }

                return countWords;
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
            fillArray: function () {
                function fillArray(item, length) {
                    return Array.apply(null, { length: length }) // eslint-disable-line
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
                    return obj && typeof obj === 'function';
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
            mvVersion: function () {
                function mvVersion(requiredVersion) {
                    var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '>=';

                    var currentVersion = Utils.RPGMAKER_VERSION;
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
                    var array = currentVersion.length > requiredVersion.length ? currentVersion : requiredVersion;
                    array.split('.').every(function (num, i) {
                        if (currentVersion[i] < requiredVersion[i]) {
                            compare = -1;
                            return false;
                        } else if (currentVersion[i] > requiredVersion[i]) {
                            compare = 1;
                            return false;
                        }
                        return true;
                    });
                    return operation[operator]();
                }

                return mvVersion;
            }(),
            negate: function () {
                function negate(num) {
                    return num * -1;
                }

                return negate;
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
                        var _this5 = this;

                        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                            args[_key5] = arguments[_key5];
                        }

                        var value = steps[0].apply(this, args);
                        steps.slice(1).forEach(function (step) {
                            return value = step.call(_this5, value);
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
            repeat: function () {
                function repeat(times, func) {
                    var n = times;
                    while (n-- > 0) {
                        func();
                    }
                }

                return repeat;
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
            sumArray: function () {
                function sumArray(arr) {
                    return arr.reduce(function (acc, val) {
                        return acc + val;
                    }, 0);
                }

                return sumArray;
            }(),
            textWidthEx: function () {
                function textWidthEx(text) {
                    var x = 0;
                    var y = 0;
                    var win = new Window_Base();
                    var textState = { index: 0, x: x, y: y, left: x };
                    textState.text = win.convertEscapeCharacters(text);
                    textState.height = win.calcTextHeight(textState, false);
                    while (textState.index < textState.text.length) {
                        win.processCharacter(textState);
                    }
                    return Math.ceil(textState.x - x);
                }

                return textWidthEx;
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
    };
    WAY.Util = Utilities();

    var EventEmitter = function EventEmitter() {
        return new PIXI.utils.EventEmitter();
    };
    WAY.EventEmitter = WAY.EventEmitter || EventEmitter();

    var Windows = function Windows() {
        var TitleWindow = function (_Window_Base) {
            _inherits(TitleWindow, _Window_Base);

            function TitleWindow() {
                var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
                var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Graphics.boxWidth;
                var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 72;

                _classCallCheck(this, TitleWindow);

                var _this6 = _possibleConstructorReturn(this, (TitleWindow.__proto__ || Object.getPrototypeOf(TitleWindow)).call(this, x, y, width, height));

                _this6._title = '';
                return _this6;
            }

            _createClass(TitleWindow, [{
                key: 'setTitle',
                value: function () {
                    function setTitle(title) {
                        this._title = title;
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
        }(Window_Base);

        return { TitleWindow: TitleWindow };
    };
    WAY.Window = Windows();

    (function (DataManager, alias) {
        var loadNotetags = function loadNotetags(objects, index) {
            var strings = ['actor', 'class', 'skill', 'item', 'weapon', 'armor', 'enemy', 'state'];
            objects.forEach(function (data) {
                if (data) {
                    WAY.EventEmitter.emit('load-' + String(strings[index]) + '-notetags', data);
                }
            });
        };
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

        alias.DataManager_onLoad = DataManager.onLoad;
        WAY.Util.extend(DataManager, 'onLoad', function (object) {
            if (object === $dataMap) {
                WAY.EventEmitter.emit('load-map-notetags', $dataMap);
            }
        });
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
        WAY.Util.extend(Game_Interpreter, 'pluginCommand', function (command, args) {
            var actions = PluginManager.getCommand(command);
            if (actions) {
                var action = actions[args[0]];
                if (typeof action === 'function') {
                    action.apply(this, args.slice(1));
                }
            }
        });
    })(Game_Interpreter.prototype, $.alias);

    (function (Window_Base) {
        Window_Base.textWidthEx = function (text) {
            return this.drawTextEx(text, 0, this.contents.height);
        };
    })(Window_Base.prototype);
})(WAYModuleLoader.getModule('WAY_Core'));

// Load data from save files
// Persist data through save files
// Create game obects stuff, load save stuff
// Add filter to parseParameter so "headers" are not parsed

/*paramRef = {'mhp': 0,'mmp': 1,'atk': 2,'def': 3,'mat': 4,'mdf': 5,'agi': 6,'luk': 7};
xparamRef = {'hit': 0,'eva': 1,'cri': 2,'cev': 3,'mev': 4,'mrf': 5,'cnt': 6,'hrg': 7,'mrg': 8,'trg': 9};
sparamRef = {'tgr': 0,'grd': 1,'rec': 2,'pha': 3,'mcr': 4,'tcr': 5,'pdr': 6,'mdr': 7,'fdr': 8,'exr': 9};*/
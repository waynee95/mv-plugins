/* eslint no-use-before-define: 0 */
// ===========================================================================
// WAY_Core.js
// ===========================================================================
/*:
@plugindesc v1.5.0 WAY Core Utility Plugin. Place it above all WAY plugins. <WAY_Core>
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

const Imported = Imported || {};

const WAYModuleLoader = (function() {
    const plugins = {};
    function parseStruct(params) {
        if (WAY === undefined) {
            return params;
        }
        return WAY.Util.parseStruct(params);
    }

    function compareVersions(currentVersion, operator = '==', requiredVersion) {
        const length = Math.max(currentVersion.length, requiredVersion.length);
        let compare = 0;
        const operation = {
            '<': function() {
                return compare < 0;
            },
            '<=': function() {
                return compare <= 0;
            },
            '==': function() {
                return compare === 0;
            },
            '>': function() {
                return compare > 0;
            },
            '>=': function() {
                return compare >= 0;
            }
        };
        for (let i = 0; i < length; i += 1) {
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
        const strA = `Error loading${key}\n\n`;
        const strB = `The following plugins are required:\n${msg}\n`;
        const strC = `Place the required plugins above ${key}!`;
        console.error(strA + strB + strC); //eslint-disable-line no-console
        if (Utils.isNwjs() && Utils.isOptionValid('test')) {
            const gui = require('nw.gui'); //eslint-disable-line
            gui.Window.get().showDevTools();
        }
        SceneManager.stop();
    }
    return {
        checkRequirements(key) {
            let list = '';
            plugins[key].required.forEach(({ name, version }) => {
                if (!this.isImported(name)) {
                    list += `${name}\n`;
                } else if (version) {
                    const [requiredVersion, operator] = version.split(' ').reverse();
                    if (!this.checkVersion(name, operator, requiredVersion)) {
                        list += `${name} needs to be ${operator} version ${requiredVersion}!\n`;
                    }
                }
            });
            if (list) {
                printError(list, key);
            }
        },
        checkVersion(key, operator, requiredVersion) {
            if (this.isImported(key)) {
                const currentVersion = plugins[key].version;
                return compareVersions(currentVersion, operator, requiredVersion);
            }
            return false;
        },
        getModule(key) {
            if (this.isImported(key)) {
                return plugins[key];
            }
            return false;
        },
        getPluginParameters(key) {
            return window.$plugins.filter(p => p.description.indexOf(`<${key}>`) > -1)[0]
                .parameters;
        },
        isImported(key) {
            return typeof plugins[key] !== 'undefined';
        },
        registerPlugin(key, version, author, ...required) {
            if (this.isImported(key)) {
                return false;
            }
            plugins[key] = {
                alias: {},
                author,
                parameters: parseStruct(this.getPluginParameters(key)),
                required,
                version
            };
            Imported[key] = version;
            if (required) {
                this.checkRequirements(key);
            }
            return true;
        }
    };
})();

WAYModuleLoader.registerPlugin('WAY_Core', '1.5.0', 'waynee95');

const WAYCore = WAYCore || {};
const WAY = WAYCore;

($ => {
    const Utilities = function() {
        return {
            arrayFromRange(start, end) {
                return Array.apply(null, { length: end - start + 1 }) // eslint-disable-line
                    .map((e, index) => start + index);
            },
            arrayMax(arr) {
                return arr.reduce((acc, val) => (acc > val ? acc : val));
            },
            arrayMin(arr) {
                return arr.reduce((acc, val) => (acc < val ? acc : val));
            },
            average(arr) {
                return arr.reduce((acc, val) => acc + val) / arr.length;
            },
            clean(arr) {
                return arr.filter(element => WAY.Util.exists(element));
            },
            clip(num, lower, upper) {
                return Math.max(lower, Math.min(num, upper));
            },
            concatAll(...args) {
                return args.reduce((acc, val) => [...acc, ...val]);
            },
            difference(a, b) {
                return a.filter(element => b.indexOf(element) === -1);
            },
            extend(obj, name, func) {
                const orig = obj[name];
                obj[name] = (...args) => {
                    orig.apply(obj, args);
                    func.apply(obj, args);
                };
            },
            exists(value) {
                return value !== undefined && value !== null;
            },
            filter(obj, func) {
                if (WAY.Util.isArray(obj)) {
                    return obj.filter(element => func(element));
                }
                return Object.keys(obj)
                    .filter(key => func(obj[key]))
                    .reduce(
                        (res, key) =>
                            Object.assign(res, {
                                [key]: obj[key]
                            }),
                        {}
                    );
            },
            filterText(text, re, action) {
                const result = [];
                let match = null;
                while ((match = re.exec(text))) {
                    if (action(match)) {
                        result.push(match);
                    }
                }
                return result;
            },
            flatten(arr) {
                return arr.reduce((acc, val) => acc.concat(val), []);
            },
            floorRand(max) {
                return Math.floor(Math.random() * max);
            },
            getEventComments(eventId) {
                const event = $dataMap.events[eventId];
                const { pages } = event;
                let allComments = '';
                pages.forEach(page => {
                    let comments = '';
                    page.list.forEach(command => {
                        if (command.code === 108 || command.code === 408) {
                            comments += `${command.parameters[0]}\n`;
                        }
                    });
                    allComments += comments;
                });

                return allComments;
            },
            getMultiLineNotetag(text, tag, defaultValue, func) {
                const result = [];
                const re = new RegExp(`<(${tag})>([\\s\\S]*?)<(\\/${tag})>`, 'g');
                const matches = WAY.Util.filterText(
                    text,
                    re,
                    match => match[1].toLowerCase() === tag.toLowerCase()
                );
                matches.forEach(group => result.push(func.call(this, group[2])));
                return result.length > 0 ? result[0] : defaultValue;
            },
            getNotetag(text, tag, defaultValue, func) {
                const result = [];
                const re = /<([^<>:]+)(:?)([^>]*)>/g;
                const matches = WAY.Util.filterText(
                    text,
                    re,
                    match => match[1].toLowerCase() === tag.toLowerCase()
                );
                matches.forEach(group => result.push(func.call(this, group[3])));
                return result.length > 0 ? result[0] : defaultValue;
            },
            insert(arr, item, index = arr.length) {
                arr.splice(index, 0, item);
            },
            intersect(a, b) {
                return a.filter(element => b.indexOf(element) > -1);
            },
            isArray(obj) {
                return Object.prototype.toString.apply(obj) === '[object Array]';
            },
            isBool(value) {
                return value === true || value === false || /^(:?true|false)$/i.test(value);
            },
            isEmpty(obj) {
                return WAY.Util.isObj(obj) && Object.keys(obj).length < 1;
            },
            isFloat(value) {
                return Number(value) === value && value % 1 !== 0;
            },
            isFunction(obj) {
                return obj && {}.toString.call(obj) === '[object Function]';
            },
            isInt(value) {
                return Number(value) === value && Math.floor(value) === value;
            },
            isJsonString(string) {
                try {
                    JsonEx.parse(string);
                } catch (e) {
                    return false;
                }
                return true;
            },
            isNumber(value) {
                return WAY.Util.isInt(value) || WAY.Util.isFloat(value);
            },
            isObject(obj) {
                return obj && Object.prototype.toString.apply(obj) === '[object Object]';
            },
            isPlaytest() {
                return Utils.isOptionValid('test');
            },
            isScene(scene) {
                return SceneManager._scene instanceof scene;
            },
            log(...string) {
                if (WAY.Util.isPlaytest()) {
                    console.log(...string); //eslint-disable-line no-console
                }
            },
            map(obj, func) {
                if (WAY.Util.isArray(obj)) {
                    return obj.map(func);
                }
                return Object.assign(
                    {},
                    ...Object.keys(obj).map(key => ({
                        [key]: func(obj[key])
                    }))
                );
            },
            negate(num) {
                return num * -1;
            },
            parseStruct(params) {
                const parseKey = key => {
                    const value = params[key];
                    if (WAY.Util.isNumber(parseInt(value, 10))) {
                        params[key] = Number(value);
                    } else if (WAY.Util.isBool(value)) {
                        params[key] = WAY.Util.toBool(value);
                    } else {
                        try {
                            const obj = JsonEx.parse(value);
                            if (WAY.Util.isObj(obj)) {
                                params[key] = WAY.Util.parseStruct(obj);
                            }
                        } catch (e) {
                            throw e.message;
                        }
                    }
                };
                Object.keys(params).forEach(key => parseKey(key));
                return params;
            },
            pick(arr, index) {
                if (index === undefined) {
                    return arr[WAY.Util.floorRand(arr.length)];
                }
                return arr[index];
            },
            piper(...steps) {
                return function(...args) {
                    let value = steps[0].apply(this, args);
                    steps.slice(1).forEach(step => (value = step.call(this, value)));
                    return value;
                };
            },
            pluck(key) {
                return obj => obj[key];
            },
            randomBetween(min, max) {
                return WAY.Util.floorRand(max + 1 - min) + min;
            },
            remove(arr, item) {
                const index = arr.indexOf(item);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            },
            showError(msg) {
                console.error(msg); //eslint-disable-line
                if (Utils.isNwjs() && WAY.Util.isPlaytest()) {
                    const gui = require('nw.gui'); //eslint-disable-line
                    gui.Window.get().showDevTools();
                }
            },
            shuffle(arr) {
                let temp;
                let current;
                let top = arr.length;
                if (top) {
                    while (top--) {
                        current = WAY.Util.floorRand(top + 1);
                        temp = arr[current];
                        arr[current] = arr[top];
                        arr[top] = temp;
                    }
                }
                return arr;
            },
            toArray(str) {
                if (str.contains('to')) {
                    let [from, to] = str.split('to');
                    to = parseInt(to, 10);
                    from = parseInt(from, 10);
                    return WAY.Util.arrayFromRange(from, to);
                }
                return JSON.parse(`[${str}]`);
            },
            toBool(string) {
                if (/^(:?true)$/i.test(string)) {
                    return true;
                } else if (/^(:?false)$/i.test(string)) {
                    return false;
                }
                return null;
            },
            toInt(value) {
                return WAY.Util.piper(parseInt, num => num - num % 1)(value);
            },
            toObj(string) {
                if (WAY.Util.isJsonString(string)) {
                    return JsonEx.parse(string);
                }
                const createObjProperty = pair => {
                    const [key, value] = pair.split(':').map(WAY.Util.trim);
                    if (WAY.Util.isNumber(parseInt(value, 10))) {
                        return {
                            [key]: Number(value, 10)
                        };
                    } else if (WAY.Util.isBool(value)) {
                        return {
                            [key]: WAY.Util.toBool(value)
                        };
                    }
                    return {
                        [key]: value
                    };
                };
                return Object.assign(
                    {},
                    ...string
                        .replace(/,/g, '\n')
                        .split(/[\r\n]+/)
                        .filter(key => key !== '')
                        .map(createObjProperty)
                );
            },
            trim(string) {
                return string.trim();
            },
            unique(arr) {
                return arr.filter((element, index) => arr.indexOf(element) === index);
            }
        };
    };
    WAY.Util = Utilities();

    const EventEmitter = function() {
        return new PIXI.utils.EventEmitter();
    };
    WAY.EventEmitter = EventEmitter();

    ((DataManager, alias) => {
        const loadNotetags = function(objects, index) {
            const strings = [
                'actor',
                'class',
                'skill',
                'item',
                'weapon',
                'armor',
                'enemy',
                'state'
            ];
            objects.forEach(data => {
                if (data) {
                    WAY.EventEmitter.emit(`load-${strings[index]}-notetags`, data);
                }
            });
        };
        alias.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
        DataManager.isDatabaseLoaded = function() {
            if (!alias.DataManager_isDatabaseLoaded.call(this)) {
                return false;
            }
            const list = [
                $dataActors,
                $dataClasses,
                $dataSkills,
                $dataItems,
                $dataWeapons,
                $dataArmors,
                $dataEnemies,
                $dataStates
            ];
            list.forEach((objects, index) => loadNotetags(objects, index));
            return true;
        };
    })(DataManager, $.alias);

    (PluginManager => {
        const commands = {};
        PluginManager.addCommand = function(command, actions) {
            commands[command] = actions;
        };
        PluginManager.isCommand = function(command) {
            return typeof commands[command] !== 'undefined';
        };
        PluginManager.getCommand = function(command) {
            if (this.isCommand(command)) {
                return commands[command];
            }
            return false;
        };
    })(PluginManager);

    ((GameInterpreter, alias) => {
        alias.Game_Interpreter_pluginCommand = GameInterpreter.pluginCommand;
        WAY.Util.extend(Game_Interpreter.prototype, 'pluginCommand', function(command, args) {
            const actions = PluginManager.getCommand(command);
            if (actions) {
                const action = actions[args[0]];
                if (typeof action === 'function') {
                    action.apply(this, args.slice(1));
                }
            }
        });
    })(Game_Interpreter, $.alias);
})(WAYModuleLoader.getModule('WAY_Core'));

// Load data from save files
// Persist data through save files

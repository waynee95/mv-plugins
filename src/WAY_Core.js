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

const Imported = window.Imported || {};

//============================================================================
// WAYModuleLoader
//============================================================================
const WAYModuleLoader = (function() {
  const plugins = {};
  function parseParameters(params) {
    if (WAY === undefined) {
      return params;
    }
    return WAY.Util.parseParameters(params);
  }

  function compareVersions(currentVersion, operator = "==", requiredVersion) {
    const length = Math.max(currentVersion.length, requiredVersion.length);
    let compare = 0;
    const operation = {
      "<": function() {
        return compare < 0;
      },
      "<=": function() {
        return compare <= 0;
      },
      "==": function() {
        return compare === 0;
      },
      ">": function() {
        return compare > 0;
      },
      ">=": function() {
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

  return {
    checkRequirements(key) {
      let list = "";
      plugins[key].required.forEach(({ name, version }) => {
        if (!this.isImported(name)) {
          list += `${name}\n`;
        } else if (version) {
          const [requiredVersion, operator] = version.split(" ").reverse();
          if (!this.checkVersion(name, operator, requiredVersion)) {
            list += `${name} needs to be ${operator} version ${requiredVersion}!\n`;
          }
        }
      });
      if (list) {
        WAYModuleLoader.printError(list, key);
      }
    },
    printError(msg, key) {
      const strA = `Error loading ${key}\n\n`;
      const strB = `The following plugins are required:\n${msg}\n`;
      const strC = `Place the required plugins above ${key}!`;
      console.error(strA + strB + strC); // eslint-disable-line no-console
      if (Utils.isNwjs() && Utils.isOptionValid("test")) {
        const gui = require("nw.gui"); //eslint-disable-line
        gui.Window.get().showDevTools();
      }
      SceneManager.stop();
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
      return window.$plugins.filter(
        p => p.description.indexOf(`<${key}>`) > -1
      )[0].parameters;
    },
    isImported(key) {
      return typeof plugins[key] !== "undefined";
    },
    registerPlugin(key, version, author, ...required) {
      if (this.isImported(key)) {
        return false;
      }
      plugins[key] = {
        alias: {},
        author,
        parameters: parseParameters(this.getPluginParameters(key)),
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

WAYModuleLoader.registerPlugin("WAY_Core", "2.0.0", "waynee95");

const WAYCore = window.WAYCore || {};
const WAY = WAYCore;

($ => {
  //==========================================================================
  // WAY.Util
  //==========================================================================
  WAY.Util = {
    difference(a, b) {
      return a.filter(element => b.indexOf(element) === -1);
    },
    fillArray(item, length) {
      const arr = [];
      for (let i = 0; i < length; i++) {
        arr[i] = item;
      }
      return arr;
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
    floorRand(max) {
      return Math.floor(Math.random() * max);
    },
    getEventComments(eventId) {
      const event = $dataMap.events[eventId];
      const { pages } = event;
      let allComments = "";
      pages.forEach(page => {
        let comments = "";
        page.list.forEach(command => {
          if (command.code === 108 || command.code === 408) {
            comments += `${command.parameters[0]}\n`;
          }
        });
        allComments += comments;
      });

      return allComments;
    },
    getMultiLineNotetag(text, tag, defaultValue, func = () => true) {
      const result = [];
      const re = new RegExp(`<(${tag})>([\\s\\S]*?)<(\\/${tag})>`, "gi");
      const matches = WAY.Util.filterText(
        text,
        re,
        match => match[1].toLowerCase() === tag.toLowerCase()
      );
      matches.forEach(group => result.push(func.call(this, group[2])));
      return result.length > 0 ? result[0] : defaultValue;
    },
    getNotetag(text, tag, defaultValue, func = () => true) {
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
    getNotetagList(text, tag, func) {
      const result = [];
      const re = /<([^<>:]+)(:?)([^>]*)>/g;
      const matches = WAY.Util.filterText(
        text,
        re,
        match => match[1].toLowerCase() === tag.toLowerCase()
      );
      matches.forEach(group => result.push(func.call(this, group[3])));
      return result;
    },
    intersect(a, b) {
      return a.filter(element => b.indexOf(element) > -1);
    },
    isArray(obj) {
      return obj && Array.isArray(obj);
    },
    isBool(value) {
      return (
        value === true || value === false || /^(:?true|false)$/i.test(value)
      );
    },
    isFloat(value) {
      return Number(value) === value && value % 1 !== 0;
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
    isObj(obj) {
      return obj && typeof obj === "object";
    },
    isPlaytest() {
      return Utils.isOptionValid("test");
    },
    isScene(scene) {
      return SceneManager._scene instanceof scene;
    },
    log(...string) {
      if (WAY.Util.isPlaytest()) {
        console.log(...string); // eslint-disable-line no-console
      }
    },
    parseParameters(params) {
      let obj;
      try {
        obj = JsonEx.parse(
          WAY.Util.isObj(params) ? JsonEx.stringify(params) : params
        );
      } catch (e) {
        return params;
      }
      if (WAY.Util.isObj(obj)) {
        Object.keys(obj).forEach(key => {
          obj[key] = WAY.Util.parseParameters(obj[key]);

          // If the parameter has no value, meaning it's an empty string,
          // just set it to null
          if (obj[key] === "") {
            obj[key] = null;
          }
        });
      }
      return obj;
    },
    tryEval(text) {
      try {
        return eval(text); // eslint-disable-line
      } catch (err) {
        return null;
      }
    },
    toArray(str) {
      if (str.contains("to")) {
        let [from, to] = str.split("to");
        to = parseInt(to, 10);
        from = parseInt(from, 10);
        return WAY.Util.arrayFromRange(from, to);
      }
      return JSON.parse(`[${str}]`);
    },
    toBool(string) {
      if (/^true$/i.test(string)) {
        return true;
      } else if (/^false$/i.test(string)) {
        return false;
      }
      return null;
    },
    toInt(value) {
      const num = parseInt(value, 10);
      return num - (num % 1);
    },
    toObj(string) {
      if (WAY.Util.isJsonString(string)) {
        return JsonEx.parse(string);
      }
      const createObjProperty = pair => {
        const [key, value] = pair.split(":").map(WAY.Util.trim);
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
          .replace(/,/g, "\n")
          .split(/[\r\n]+/)
          .filter(key => key !== "")
          .map(createObjProperty)
      );
    },
    trim(string) {
      return string.trim();
    }
  };

  //==========================================================================
  // WAY.EventEmitter
  //==========================================================================
  WAY.EventEmitter = WAY.EventEmitter || new PIXI.utils.EventEmitter();

  //==========================================================================
  // WAY.Window
  //==========================================================================
  WAY.Window = {
    TitleWindow: class TitleWindow extends Window_Base {
      constructor(x = 0, y = 0, width = Graphics.boxWidth, height = 72) {
        super(x, y, width, height);
        this._title = "";
        return this;
      }
      setTitle(title) {
        this._title = title;
        this.refresh();
        return this;
      }
      refresh() {
        this.contents.clear();
        const text = this._title;
        const dw = this.contents.width + this.textPadding();
        const tw = this.textWidthEx(text);
        const dx = Math.floor(Math.max(0, dw - tw) / 2);
        this.drawTextEx(text, this.textPadding() + dx, 0);
      }
    }
  };

  //==========================================================================
  // Game_Interpreter
  //==========================================================================
  $.alias.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    if (!$.alias.DataManager_isDatabaseLoaded.call(this)) {
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

  $.alias.DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    $.alias.DataManager_onLoad.call(this, object);
    if (object === $dataMap) {
      WAY.EventEmitter.emit("load-map-notetags", $dataMap);
    }
  };

  function loadNotetags(objects, index) {
    const strings = [
      "actor",
      "class",
      "skill",
      "item",
      "weapon",
      "armor",
      "enemy",
      "state"
    ];
    objects.forEach(data => {
      if (data) {
        WAY.EventEmitter.emit(`load-${strings[index]}-notetags`, data);
      }
    });
  }

  //==========================================================================
  // PluginManager
  //==========================================================================
  PluginManager._commands = {};

  PluginManager.addCommand = function(command, actions) {
    PluginManager._commands[command] = actions;
  };

  PluginManager.isCommand = function(command) {
    return typeof PluginManager._commands[command] !== "undefined";
  };

  PluginManager.getCommand = function(command) {
    if (this.isCommand(command)) {
      return PluginManager._commands[command];
    }
    return false;
  };

  //==========================================================================
  // Game_Interpreter
  //==========================================================================
  $.alias.Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    const actions = PluginManager.getCommand(command);
    if (actions) {
      const action = actions[args[0]];
      if (typeof action === "function") {
        action.apply(this, args.slice(1));
      }
    } else {
      $.alias.Game_Interpreter_pluginCommand.call(this, command, args);
    }
  };

  //==========================================================================
  // Window_Base
  //==========================================================================
  if (!Window_Base.prototype.textWidthEx) {
    Window_Base.prototype.textWidthEx = function(text) {
      return this.drawTextEx(text, 0, this.contents.height);
    };
  }
})(WAYModuleLoader.getModule("WAY_Core"));

/* globals WAY, WAYModuleLoader, Game_SpawnEvent */
// ===========================================================================
// WAY_YEP_RegionRestrictions.js
// ===========================================================================
/*:
@plugindesc v1.2.1 Addon to Yanfly's RegionRestrictions Plugin. <WAY_YEP_RegionRestrictions>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
---Event:
<Bypass Restriction: x>
<Bypass Restriction: x, x, ...>

Use this notetag in the event's notebox and the event can bypass the specified
region.

<Force Restriction: x>
<Force Restriction: x, x...>

When you use this notetag and the event has the through flag, it will check
the setting for the specified region ids first instead of going "through"
no matter what.

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

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line
    gui.Window.get().showDevTools();
  }
  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin(
    "WAY_YEP_RegionRestrictions",
    "1.2.1",
    "waynee95"
  );
}

($ => {
  const { getNotetag, toArray } = WAY.Util;

  //==========================================================================
  // DataManager
  //==========================================================================
  $.alias.DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function(object) {
    $.alias.DataManager_extractMetadata.call(this, object);
    if (object === $dataMap) {
      const { events } = $dataMap;

      events.forEach(event => {
        if (event) {
          event._bypassRestriction = getNotetag(
            event.note,
            "Bypass Restriction",
            [],
            toArray
          );
          event._forceRestriction = getNotetag(
            event.note,
            "Force Restriction",
            [],
            toArray
          );
        }
      });
    }
  };

  //==========================================================================
  // Game_CharacterBase
  //==========================================================================
  $.alias.Game_CharacterBase_isEventRegionForbid =
    Game_CharacterBase.prototype.isEventRegionForbid;
  $.alias.Game_CharacterBase_isEventRegionAllow =
    Game_CharacterBase.prototype.isEventRegionAllow;
  $.alias.Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;

  Game_CharacterBase.prototype.isEventRegionForbid = function(x, y, d) {
    const regionId = this.getRegionId(x, y, d);
    const event = this.isEvent() ? this.event() : null;
    if (
      event &&
      event._bypassRestriction &&
      event._bypassRestriction.contains(regionId)
    ) {
      return false;
    }
    if (this.isPlayer()) return false;
    if (this.isThrough()) {
      if (
        event &&
        event._forceRestriction &&
        event._forceRestriction.contains(regionId)
      ) {
        return $gameMap.restrictEventRegions().contains(regionId);
      }
      return false;
    }
    if (regionId === 0) return false;
    if ($gameMap.restrictEventRegions().contains(regionId)) return true;
    return false;
  };

  Game_CharacterBase.prototype.isEventRegionAllow = function(x, y, d) {
    const regionId = this.getRegionId(x, y, d);
    const event = this.isEvent() ? this.event() : null;
    if (
      event &&
      event._bypassRestriction &&
      event._bypassRestriction.contains(regionId)
    ) {
      return true;
    }
    if (this.isPlayer()) return false;
    if (regionId === 0) return false;
    if ($gameMap.allowEventRegions().contains(regionId)) return true;
    return false;
  };

  Game_CharacterBase.prototype.canPass = function(x, y, d) {
    const x2 = $gameMap.roundXWithDirection(x, d);
    const y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
      return false;
    }
    const isThrough = this.isThrough() || this.isDebugThrough();
    if (isThrough && this.getRegionId(x, y, d) === 0) {
      return true;
    }
    if (!this.isMapPassable(x, y, d) || this.isCollidedWithCharacters(x2, y2)) {
      return false;
    }
    return true;
  };

  /* Compatability with Galv_EventSpawner */
  if (Imported.Galv_EventSpawner) {
    $.alias.Game_SpawnEvent_init = Game_SpawnEvent.prototype.initialize;

    Game_SpawnEvent.prototype.initialize = function(...args) {
      $.alias.Game_SpawnEvent_init.apply(this, args);
      const event = this.event();
      event._bypassRestriction = getNotetag(
        event.note,
        "Bypass Restriction",
        [],
        toArray
      );
      event._forceRestriction = getNotetag(
        event.note,
        "Force Restriction",
        [],
        toArray
      );
    };
  }
})(WAYModuleLoader.getModule("WAY_YEP_RegionRestrictions"));

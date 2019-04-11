/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_TransferOnRegion.js
// ===========================================================================

/*:
@plugindesc v1.0.2 Transfer the player when he touches a certain region id.
<WAY_TransferOnRegion>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Map:

<Region Transfer: regionId, mapId, targetX, targetY, direction, fadeType>

regionId  - Id of the region, that will trigger the transfer

mapId     - mapId of the map the player will be transferred to

targetX   - player x position on new map

targetY   - player y position on new map

direction - facing direction of the player after moving (optional)

For the direction, use one of the following numbers:
    0 = retain
    2 = down
    4 = left
    6 = right
    8 = up

fadeType  - type of the screen transition after moving (optional)

For the fadeType, use one of the following numbers:
    0 = black transition
    1 = white transition
    2 = no transition effect

>>> If there is no direction specified, the plyer will retain it's current
facing direction.

>>> If there is no fadeType specified, the screen transition will be black.

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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

if (typeof WAY === "undefined") {
  console.error("You need to install WAY_Core!"); // eslint-disable-line no-console

  if (Utils.isNwjs() && Utils.isOptionValid("test")) {
    var gui = require("nw.gui"); //eslint-disable-line


    gui.Window.get().showDevTools();
  }

  SceneManager.stop();
} else {
  WAYModuleLoader.registerPlugin("WAY_TransferOnRegion", "1.0.2", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

(function ($) {
  var _WAY$Util = WAY.Util,
      getNotetagList = _WAY$Util.getNotetagList,
      toInt = _WAY$Util.toInt;
  WAY.EventEmitter.on("load-map-notetags", function (map) {
    map._transferData = {};
    getNotetagList(map.note, "Region Transfer", function (data) {
      var _data$split$map = data.split(",").map(toInt),
          _data$split$map2 = _slicedToArray(_data$split$map, 6),
          regionId = _data$split$map2[0],
          mapId = _data$split$map2[1],
          targetX = _data$split$map2[2],
          targetY = _data$split$map2[3],
          _data$split$map2$ = _data$split$map2[4],
          direction = _data$split$map2$ === void 0 ? 0 : _data$split$map2$,
          _data$split$map2$2 = _data$split$map2[5],
          fadeType = _data$split$map2$2 === void 0 ? 0 : _data$split$map2$2;

      var transferDataObject = {
        regionId: regionId,
        mapId: mapId,
        targetX: targetX,
        targetY: targetY,
        direction: direction,
        fadeType: fadeType
      };
      map._transferData[regionId] = transferDataObject;
    });
  }); //==========================================================================
  //  Game_Player
  //==========================================================================

  $.alias.Game_Player_moveStraight = Game_Player.prototype.moveStraight;

  Game_Player.prototype.moveStraight = function (d) {
    $.alias.Game_Player_moveStraight.call(this, d);
    var transferDataObject = $dataMap ? $dataMap._transferData[this.regionId()] : null;

    if (transferDataObject) {
      var mapId = transferDataObject.mapId,
          targetX = transferDataObject.targetX,
          targetY = transferDataObject.targetY,
          direction = transferDataObject.direction,
          fadeType = transferDataObject.fadeType;
      $gamePlayer.reserveTransfer(mapId, targetX, targetY, direction, fadeType);
    }
  };
})(WAYModuleLoader.getModule("WAY_TransferOnRegion"));
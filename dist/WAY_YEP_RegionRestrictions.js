/* globals WAY, WAYModuleLoader, Game_SpawnEvent */
// ============================================================================
// WAY_YEP_RegionRestrictions.js
// ============================================================================
/**
 * @file Addon to Yanfly's RegionRestrictions Plugin.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc Addon to Yanfly's RegionRestrictions Plugin. <WAY_YEP_RegionRestrictions>
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

==============================================================================
 ■ Terms of Use
==============================================================================
Credit must be given to: waynee95
Please don't share my plugins anywhere, except if you have my permissions.

My plugins may be used in commercial and non-commercial products.
*/

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

if (WAY === undefined) {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_RegionRestrictions', '1.0.0', 'waynee95');
}

(function ($) {
    var extend = WAY.Util.extend;


    $.alias.DataManager_extractMetadata = DataManager.extractMetadata;
    extend(DataManager, 'extractMetadata', function (object) {
        if (object === $dataMap) {
            var _$dataMap = $dataMap,
                events = _$dataMap.events;

            var re = /<BYPASS RESTRICTION:[ ](\d+(?:\s*,\s*\d+)*)>/i;

            events.forEach(function (event) {
                if (event) {
                    var note = event.note;

                    event._bypassRestriction = [];
                    if (note.match(re)) {
                        var _event$_bypassRestric;

                        var array = JSON.parse('[' + String(RegExp.$1.match(/\d+/g)) + ']');
                        (_event$_bypassRestric = event._bypassRestriction).push.apply(_event$_bypassRestric, _toConsumableArray(array));
                    }
                }
            });
        }
    });

    $.alias.Game_CharacterBase_isEventRegionForbid = Game_CharacterBase.prototype.isEventRegionForbid;
    Game_CharacterBase.prototype.isEventRegionForbid = function (x, y, d) {
        var regionId = this.getRegionId(x, y, d);
        var event = this.isEvent() ? this.event() : null;
        if (event && event._bypassRestriction && event._bypassRestriction.contains(regionId)) {
            return false;
        }
        return $.alias.Game_CharacterBase_isEventRegionForbid.apply(this, arguments);
    };

    $.alias.Game_CharacterBase_isEventRegionAllow = Game_CharacterBase.prototype.isEventRegionAllow;
    Game_CharacterBase.prototype.isEventRegionAllow = function (x, y, d) {
        var regionId = this.getRegionId(x, y, d);
        var event = this.isEvent() ? this.event() : null;
        if (event && event._bypassRestriction && event._bypassRestriction.contains(regionId)) {
            return true;
        }
        return $.alias.Game_CharacterBase_isEventRegionAllow.apply(this, arguments);
    };

    /* Compatability with Galv_EventSpawner */
    if (Imported.Galv_EventSpawner) {
        $.alias.Game_SpawnEvent_init = Game_SpawnEvent.prototype.initialize;
        extend(Game_SpawnEvent.prototype, 'initialize', function () {
            var re = /<BYPASS RESTRICTION:[ ](\d+(?:\s*,\s*\d+)*)>/i;
            var event = undefined.event();
            var note = event.note;

            event._bypassRestriction = [];
            if (note.match(re)) {
                var _event$_bypassRestric2;

                var array = JSON.parse('[' + String(RegExp.$1.match(/\d+/g)) + ']');
                (_event$_bypassRestric2 = event._bypassRestriction).push.apply(_event$_bypassRestric2, _toConsumableArray(array));
            }
        });
    }
})(WAYModuleLoader.getModule('WAY_YEP_RegionRestrictions'));
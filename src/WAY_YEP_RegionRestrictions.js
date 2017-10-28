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

($ => {
    const { extend } = WAY.Util;

    $.alias.DataManager_extractMetadata = DataManager.extractMetadata;
    extend(DataManager, 'extractMetadata', object => {
        if (object === $dataMap) {
            const { events } = $dataMap;
            const re = /<BYPASS RESTRICTION:[ ](\d+(?:\s*,\s*\d+)*)>/i;

            events.forEach(event => {
                if (event) {
                    const { note } = event;
                    event._bypassRestriction = [];
                    if (note.match(re)) {
                        const array = JSON.parse(`[${RegExp.$1.match(/\d+/g)}]`);
                        event._bypassRestriction.push(...array);
                    }
                }
            });
        }
    });

    $.alias.Game_CharacterBase_isEventRegionForbid =
        Game_CharacterBase.prototype.isEventRegionForbid;
    Game_CharacterBase.prototype.isEventRegionForbid = function(x, y, d) {
        const regionId = this.getRegionId(x, y, d);
        const event = this.isEvent() ? this.event() : null;
        if (event && event._bypassRestriction && event._bypassRestriction.contains(regionId)) {
            return false;
        }
        return $.alias.Game_CharacterBase_isEventRegionForbid.apply(this, arguments);
    };

    $.alias.Game_CharacterBase_isEventRegionAllow = Game_CharacterBase.prototype.isEventRegionAllow;
    Game_CharacterBase.prototype.isEventRegionAllow = function(x, y, d) {
        const regionId = this.getRegionId(x, y, d);
        const event = this.isEvent() ? this.event() : null;
        if (event && event._bypassRestriction && event._bypassRestriction.contains(regionId)) {
            return true;
        }
        return $.alias.Game_CharacterBase_isEventRegionAllow.apply(this, arguments);
    };

    /* Compatability with Galv_EventSpawner */
    if (Imported.Galv_EventSpawner) {
        $.alias.Game_SpawnEvent_init = Game_SpawnEvent.prototype.initialize;
        extend(Game_SpawnEvent.prototype, 'initialize', () => {
            const re = /<BYPASS RESTRICTION:[ ](\d+(?:\s*,\s*\d+)*)>/i;
            const event = this.event();
            const { note } = event;
            event._bypassRestriction = [];
            if (note.match(re)) {
                const array = JSON.parse(`[${RegExp.$1.match(/\d+/g)}]`);
                event._bypassRestriction.push(...array);
            }
        });
    }
})(WAYModuleLoader.getModule('WAY_YEP_RegionRestrictions'));

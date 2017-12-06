/* globals WAY, WAYModuleLoader, Game_SpawnEvent */
// ============================================================================
// WAY_YEP_RegionRestrictions.js
// ============================================================================
/*:
@plugindesc v1.1.0 Addon to Yanfly's RegionRestrictions Plugin. <WAY_YEP_RegionRestrictions>
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
    WAYModuleLoader.registerPlugin('WAY_YEP_RegionRestrictions', '1.1.0', 'waynee95');
}

($ => {
    const { extend, getNotetag, toArray } = WAY.Util;

    $.alias.DataManager_extractMetadata = DataManager.extractMetadata;
    extend(DataManager, 'extractMetadata', object => {
        if (object === $dataMap) {
            const { events } = $dataMap;

            events.forEach(event => {
                if (event) {
                    event._bypassRestriction = getNotetag(
                        event.note,
                        'Bypass Restriction',
                        [],
                        toArray
                    );
                    event._forceRestriction = getNotetag(
                        event.note,
                        'Force Restriction',
                        [],
                        toArray
                    );
                }
            });
        }
    });

    ((Game_CharacterBase, alias) => {
        alias.Game_CharacterBase_isEventRegionForbid = Game_CharacterBase.isEventRegionForbid;
        alias.Game_CharacterBase_isEventRegionAllow = Game_CharacterBase.isEventRegionAllow;
        alias.Game_CharacterBase_canPass = Game_CharacterBase.canPass;

        /* Override */
        Game_CharacterBase.isEventRegionForbid = function(x, y, d) {
            const regionId = this.getRegionId(x, y, d);
            const event = this.isEvent() ? this.event() : null;
            if (event && event._bypassRestriction.contains(regionId)) {
                return false;
            }
            if (this.isPlayer()) return false;
            if (this.isThrough()) {
                if (event && event._forceRestriction.contains(regionId)) {
                    return $gameMap.restrictEventRegions().contains(regionId);
                }
                return false;
            }
            if (regionId === 0) return false;
            if ($gameMap.restrictEventRegions().contains(regionId)) return true;
            return false;
        };

        /* Override */
        Game_CharacterBase.isEventRegionAllow = function(x, y, d) {
            const regionId = this.getRegionId(x, y, d);
            const event = this.isEvent() ? this.event() : null;
            if (event && event._bypassRestriction.contains(regionId)) {
                return true;
            }
            if (this.isPlayer()) return false;
            if (regionId === 0) return false;
            if ($gameMap.allowEventRegions().contains(regionId)) return true;
            return false;
        };

        /* Override */
        Game_CharacterBase.canPass = function(x, y, d) {
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
    })(Game_CharacterBase.prototype, $.alias);

    /* Compatability with Galv_EventSpawner */
    if (Imported.Galv_EventSpawner) {
        $.alias.Game_SpawnEvent_init = Game_SpawnEvent.prototype.initialize;
        extend(Game_SpawnEvent.prototype, 'initialize', () => {
            const event = this.event();
            event._bypassRestriction = getNotetag(event.note, 'Bypass Restriction', [], toArray);
            event._forceRestriction = getNotetag(event.note, 'Force Restriction', [], toArray);
        });
    }
})(WAYModuleLoader.getModule('WAY_YEP_RegionRestrictions'));

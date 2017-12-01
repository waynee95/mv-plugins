/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_EquipCore.js
// ============================================================================
/*:
@plugindesc v1.1.0 Addon to Yanfly's Equip Core Plugin. <WAY_YEP_EquipCore>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Weapons and Armors Notetag:
<Restrict Slot: x>
<Restrict Slot: x, x, x>
<Restrict Slot: x to y>

Items with that notetag can only be equipped to the specified slots.

==============================================================================
 ■ Scriptcalls
==============================================================================
actor.sealEquipSlot(slotId)
- Seal the equip slot with slotId. The actor cannot change or equip on this slot.

actor.unsealEquipSlot(slotId)
- Unseal the equip slot with slotId.

actor.isEquipSlotSealed(slotId)
- Checks wether the slot with slotId is sealed.

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
    WAYModuleLoader.registerPlugin('WAY_YEP_EquipCore', '1.1.0', 'waynee95');
}

(function ($) {
    var _WAY$Util = WAY.Util,
        extend = _WAY$Util.extend,
        getNotetag = _WAY$Util.getNotetag,
        toArray = _WAY$Util.toArray;


    var parseNotetags = function parseNotetags(obj) {
        obj.restrictSlots = getNotetag(obj.note, 'Restrict Slots', [], toArray);
    };

    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    var isItemRestricted = function isItemRestricted(item, slotId) {
        return item && item.restrictSlots.length > 0 && !item.restrictSlots.contains(slotId);
    };

    (function (Game_Actor, alias) {
        alias.Game_Actor_setup = Game_Actor.setup;
        extend(Game_Actor, 'setup', function () {
            var _this = this;

            this._sealedEquipSlots = [];
            this.equipSlots().forEach(function (slot) {
                return _this._sealedEquipSlots[slot] === false;
            });
        });

        alias.Game_Actor_isEquipChangeOk = Game_Actor.isEquipChangeOk;
        extend(Game_Actor, 'isEquipChangeOk', function (slotId) {
            if (this.isEquipSlotSealed(slotId)) {
                return false;
            }
            return Game_Actor.isEquipChangeOk.call(this, slotId);
        });

        Game_Actor.sealEquipSlot = function (slotId) {
            this._sealedEquipSlots[slotId] = true;
        };

        Game_Actor.unsealEquipSlot = function (slotId) {
            this._sealedEquipSlots[slotId] = false;
        };

        Game_Actor.isEquipSlotSealed = function (slotId) {
            return this._sealedEquipSlots[slotId];
        };

        alias.Game_Actor_changeEquip = Game_Actor.changeEquip;
        Game_Actor.changeEquip = function (slotId, item) {
            if (isItemRestricted(item, slotId)) {
                return;
            }
            alias.Game_Actor_changeEquip.call(this, slotId, item);
        };
    })(Game_Actor.prototype, $.alias);

    (function (Window_EquipSlot, alias) {
        alias.Window_EquipSlot_isEnabled = Window_EquipSlot.isEnabled;
        extend(Window_EquipSlot, 'isEnabled', function (index) {
            if (this._actor.isEquipSlotSealed(index)) {
                return false;
            }
            return Window_EquipSlot.isEnabled.call(this, index);
        });
    })(Window_EquipSlot.prototype, $.alias);

    (function (Window_EquipItem, alias) {
        alias.Window_EquipItem.isEnabled = Window_EquipItem.isEnabled;
        Window_EquipItem.isEnabled = function (item) {
            if (isItemRestricted(item, this._slotId)) {
                return false;
            }
            return alias.Window_EquipItem.isEnabled.call(this, item);
        };
    })(Window_EquipItem.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_EquipCore'));
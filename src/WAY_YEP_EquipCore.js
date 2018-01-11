/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_EquipCore.js
// ============================================================================
/*:
@plugindesc v1.2.0 Addon to Yanfly's Equip Core Plugin. <WAY_YEP_EquipCore>

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
- Seal the equip slot with slotId. The actor cannot change or equip on this 
*   slot.

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

==============================================================================
 ■ Contact Information
==============================================================================
Forum Link: https://forums.rpgmakerweb.com/index.php?members/waynee95.88436/
Website: http://waynee95.me/
Discord Name: waynee95#4261
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
    WAYModuleLoader.registerPlugin('WAY_YEP_EquipCore', '1.2.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

($ => {
    const { getNotetag, toArray } = WAY.Util;

    const parseNotetags = obj => {
        obj.restrictSlots = getNotetag(obj.note, 'Restrict Slots', [], toArray);
    };

    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    const isItemRestricted = (item, slotId) =>
        item && item.restrictSlots.length > 0 && !item.restrictSlots.contains(slotId);

    //=============================================================================
    // Game_Actor
    //=============================================================================
    $.alias.Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function (...args) {
        $.alias.Game_Actor_setup.call(this, args);
        this._sealedEquipSlots = [];
        this.equipSlots().forEach(slot => {
            this._sealedEquipSlots[slot] = false
        });
    };

    $.alias.Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
    Game_Actor.prototype.changeEquip = function (slotId, item) {
        if (isItemRestricted(item, slotId)) {
            return;
        }
        $.alias.Game_Actor_changeEquip.call(this, slotId, item);
    };

    $.alias.Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function (slotId) {
        if (this.isEquipSlotSealed(slotId)) {
            return false;
        }
        return $.alias.Game_Actor_isEquipChangeOk.call(this, slotId);
    };

    Game_Actor.prototype.sealEquipSlot = function (slotId) {
        this._sealedEquipSlots[slotId] = true;
    };

    Game_Actor.prototype.unsealEquipSlot = function (slotId) {
        this._sealedEquipSlots[slotId] = false;
    };

    Game_Actor.prototype.isEquipSlotSealed = function (slotId) {
        return this._sealedEquipSlots[slotId] || false;
    };

    //=============================================================================
    // Window_EquipSlot
    //=============================================================================
    $.alias.Window_EquipSlot_isEnabled = Window_EquipSlot.prototype.isEnabled;
    Window_EquipSlot.prototype.isEnabled = function (index) {
        if (this._actor.isEquipSlotSealed(index)) {
            return false;
        }
        return $.alias.Window_EquipSlot_isEnabled.call(this, index);
    };
})(WAYModuleLoader.getModule('WAY_YEP_EquipCore'));

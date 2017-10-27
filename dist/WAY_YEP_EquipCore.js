/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_EquipCore.js
// ============================================================================
/**
 * @file Addon to Yanfly's Equip Core Plugin.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc Addon to Yanfly's Equip Core Plugin. <WAY_YEP_EquipCore>
@author waynee95

@help
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
    WAYModuleLoader.registerPlugin('WAY_YEP_EquipCore', '1.0.0', 'waynee95');
}

(function ($) {
    var extend = WAY.Util.extend;


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
})(WAYModuleLoader.getModule('WAY_YEP_EquipCore'));
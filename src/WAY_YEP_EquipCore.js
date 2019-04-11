/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_EquipCore.js
// ===========================================================================
/*:
@plugindesc v1.2.1 Addon to Yanfly's Equip Core Plugin. <WAY_YEP_EquipCore>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Weapons and Armors Notetag:
<Restrict Slot: x>
<Restrict Slot: x, x, x>

Items with that notetag can only be equipped to the specified slots.

Example:
Let's say you have the following Equip Slots.

<Equip Slot>
Weapon
Weapon
Armor
Accessory
</Equip Slot>

If you want to restrict Two-Handed-Weapons to only be equipable in the first
slot, then you can give the Axe the following notetag:

*   <Restrict Slot: 0>

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
  WAYModuleLoader.registerPlugin("WAY_YEP_EquipCore", "1.2.1", "waynee95", {
    name: "WAY_Core",
    version: ">= 2.0.0"
  });
}

($ => {
  const { getNotetag, toArray } = WAY.Util;

  const parseNotetags = obj => {
    obj.restrictSlots = getNotetag(obj.note, "Restrict Slots", null, toArray);
  };

  WAY.EventEmitter.on("load-weapon-notetags", parseNotetags);
  WAY.EventEmitter.on("load-armor-notetags", parseNotetags);

  //==========================================================================
  // Game_Actor
  //==========================================================================
  $.alias.Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(...args) {
    $.alias.Game_Actor_setup.call(this, args);
    this._sealedEquipSlots = [];
    this.equipSlots().forEach(slot => {
      this._sealedEquipSlots[slot] = false;
    });
  };

  $.alias.Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
  Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    if (this.isEquipSlotSealed(slotId)) {
      return false;
    }
    return $.alias.Game_Actor_isEquipChangeOk.call(this, slotId);
  };

  Game_Actor.prototype.sealEquipSlot = function(slotId) {
    this._sealedEquipSlots[slotId] = true;
  };

  Game_Actor.prototype.unsealEquipSlot = function(slotId) {
    this._sealedEquipSlots[slotId] = false;
  };

  Game_Actor.prototype.isEquipSlotSealed = function(slotId) {
    return this._sealedEquipSlots[slotId] || false;
  };

  //==========================================================================
  // Window_EquipSlot
  //==========================================================================
  $.alias.Window_EquipSlot_isEnabled = Window_EquipSlot.prototype.isEnabled;
  Window_EquipSlot.prototype.isEnabled = function(index) {
    if (this._actor.isEquipSlotSealed(index)) {
      return false;
    }
    return $.alias.Window_EquipSlot_isEnabled.call(this, index);
  };

  //==========================================================================
  // Window_EquipItem
  //==========================================================================
  $.alias.Window_EquipItem_isEnabled = Window_EquipItem.prototype.isEnabled;
  Window_EquipItem.prototype.isEnabled = function(item) {
    if (item && item.restrictSlots) {
      return item.restrictSlots.contains(this._slotId);
    }

    return $.alias.Window_EquipItem_isEnabled.call(this, item);
  };
})(WAYModuleLoader.getModule("WAY_YEP_EquipCore"));

/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_CustomOnEquipEval.js
// ============================================================================
/*:
@plugindesc v1.0.0 Run code when an actor equips or unequips an item. <WAY_CustomOnEquipEval>
@author waynee95

@help
==============================================================================
 ■ Compatibility 
==============================================================================
This plugin needs to be below YEP EquipCore and Ramza_DualWield, if you are 
using said plugins!

==============================================================================
 ■ Lunatic Mode - Custom On Equip Eval
==============================================================================
Weapon and Armor Notetag:

<Custom On Equip Eval>
code
</Custom On Equip Eval>
This code will run when an actor equips the item. You can use 'user' or 'a' to
reference the actor who equipped the item. To reference the item you can use
'item'. Also you can use shortcuts for referencing switches, variables and 
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

<Custom On Remove Equip Eval>
code
</Custom On Remove Equip Eval>
This code will run when an actor unequips the item. You can use 'user' or 'a' to
reference the actor who unequipped the item. To reference the item you can use
'item'. Also you can use shortcuts for referencing switches, variables and 
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

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
    WAYModuleLoader.registerPlugin('WAY_CustomOnEquipEval', '1.0.0', 'waynee95');
}

($ => {
    const { getMultiLineNotetag, showError, trim } = WAY.Util;
    const CUSTOM_ON_EQUIP_EVAL = 'customOnEquipEval';
    const CUSTOM_ON_REMOVE_EQUIP_EVAL = 'customOnRemoveEquipEval';

    const parseNotetags = obj => {
        obj.customOnEquipEval = getMultiLineNotetag(obj.note, 'Custom On Equip Eval', null, trim);
        obj.customOnRemoveEquipEval = getMultiLineNotetag(
            obj.note,
            'Custom On Remove Equip Eval',
            null,
            trim
        );
    };

    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    const evalCode = (user, item, type) => {
        if (item && item[type]) {
            const a = user;
            const s = $gameSwitches._data;
            const v = $gameVariables._data;
            const p = $gameParty;
            const code = item[type];
            try {
                return eval(code);
            } catch (e) {
                showError(e);
            }
        }

        return false;
    };

    ((Game_Actor, alias) => {
        alias.Game_Actor_changeEquip = Game_Actor.changeEquip;
        Game_Actor.changeEquip = function(...args) {
            const equips = this.equips();
            alias.Game_Actor_changeEquip.apply(this, args);
            this.equips().forEach((item, slotId) => {
                if (item !== equips[slotId]) {
                    evalCode(this, item, CUSTOM_ON_EQUIP_EVAL);
                    evalCode(this, equips[slotId], CUSTOM_ON_REMOVE_EQUIP_EVAL);
                }
            });
        };

        if (!window.Imported.YEP_EquipCore) {
            alias.Game_Actor_initEquips = Game_Actor.initEquips;
            Game_Actor.initEquips = function(equips) {
                alias.Game_Actor_initEquips.call(this, equips);
                this.equips().forEach(item => {
                    evalCode(this, item, CUSTOM_ON_EQUIP_EVAL);
                });
            };
        } else {
            const _Game_Actor_equipInitEquips = Game_Actor.equipInitEquips;
            Game_Actor.equipInitEquips = function(equips) {
                _Game_Actor_equipInitEquips.call(this, equips);
                this.equips().forEach(item => {
                    evalCode(this, item, CUSTOM_ON_EQUIP_EVAL);
                });
            };
        }
    })(Game_Actor.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_CustomOnEquipEval'));

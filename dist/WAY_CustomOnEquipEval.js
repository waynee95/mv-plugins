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

(function ($) {
    var _WAY$Util = WAY.Util,
        extend = _WAY$Util.extend,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        trim = _WAY$Util.trim;

    var CUSTOM_ON_EQUIP_EVAL = 'customOnEquipEval';
    var CUSTOM_ON_REMOVE_EQUIP_EVAL = 'customOnRemoveEquipEval';

    var parseNotetags = function () {
        function parseNotetags(obj) {
            obj.customOnEquipEval = getMultiLineNotetag(obj.note, 'Custom On Equip Eval', null, trim);
            obj.customOnRemoveEquipEval = getMultiLineNotetag(obj.note, 'Custom On Remove Equip Eval', null, trim);
        }

        return parseNotetags;
    }();

    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    var evalCode = function () {
        function evalCode(user, item, type) {
            if (item && item[type]) {
                var a = user;
                var s = $gameSwitches._data;
                var v = $gameVariables._data;
                var p = $gameParty;
                var code = item[type];
                try {
                    return eval(code);
                } catch (e) {
                    throw e;
                }
            }

            return false;
        }

        return evalCode;
    }();

    (function (Game_Actor, alias) {
        alias.Game_Actor_changeEquip = Game_Actor.changeEquip;

        /* Override */
        Game_Actor.changeEquip = function () {
            var _this = this;

            var equips = this.equips();

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            alias.Game_Actor_changeEquip.apply(this, args);
            this.equips().forEach(function (item, slotId) {
                if (item !== equips[slotId]) {
                    evalCode(_this, item, CUSTOM_ON_EQUIP_EVAL);
                    evalCode(_this, equips[slotId], CUSTOM_ON_REMOVE_EQUIP_EVAL);
                }
            });
        };

        if (!window.Imported.YEP_EquipCore) {
            alias.Game_Actor_initEquips = Game_Actor.initEquips;
            extend(Game_Actor, 'initEquips', function () {
                var _this2 = this;

                this.equips().forEach(function (item) {
                    evalCode(_this2, item, CUSTOM_ON_EQUIP_EVAL);
                });
            });
        } else {
            alias.Game_Actor_equipInitEquips = Game_Actor.equipInitEquips;
            extend(Game_Actor, 'equipInitEquips', function () {
                var _this3 = this;

                this.equips().forEach(function (item) {
                    evalCode(_this3, item, CUSTOM_ON_EQUIP_EVAL);
                });
            });
        }
    })(Game_Actor.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_CustomOnEquipEval'));
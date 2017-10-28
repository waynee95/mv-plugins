/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_ItemCore.js
// ===========================================================================
/**
 * @file Addon to Yanfly's Item Core Plugin.
 * @author waynee95
 * @version 1.0.1
 */
/*:
@plugindesc Addon to Yanfly's Item Core Plugin. <WAY_YEP_ItemCore>
@author waynee95

@help
=============================================================================
 ■ Notetags
==============================================================================
-- Items, Weapons, Armors, Skills Notetag:
<Icon Background: x>

Specify an icon index that will show a certain icon behind the normal icon.

==============================================================================
 ■ Lunatic Mode - Custom Name Eval
==============================================================================
For those who would like to have different items to have the name based on
certain conditions:

Item, Weapon, Armor and Skill Notetag:
<Custom Name Eval>
name = "Holy Sword +" + v[42]
</Custom Name Eval>

==============================================================================
 ■ Lunatic Mode - Custom TextColor Eval
==============================================================================
For those who would like to have different text colors of certain items based
on an eval:

Item, Weapon, Armor and Skill Notetag:
<Custom TextColor Eval>
var sum = item.params.reduce(function (a, b) {
    return a + b;
    }, 0);
if (sum < 20) {
    textColor = 14;
} else {
    textColor = 27;
}
</Custom TextColor Eval>

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
    WAYModuleLoader.registerPlugin('WAY_YEP_ItemCore', '1.0.1', 'waynee95');
}

(function () {
    var _WAY$Util = WAY.Util,
        getNotetag = _WAY$Util.getNotetag,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        showError = _WAY$Util.showError,
        trim = _WAY$Util.trim,
        toInt = _WAY$Util.toInt;


    var parseNotetags = function parseNotetags(obj) {
        obj.customNameEval = getMultiLineNotetag(obj.note, 'Custom Name Eval', null, trim);
        obj.customTextColorEval = getMultiLineNotetag(obj.note, 'custom textcolor eval', null, trim);
        obj.iconBackground = getNotetag(obj.note, 'Icon Background', null, toInt);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-skill-notetags', parseNotetags);

    (function (Window_Base) {
        var evalCustomName = function evalCustomName(item) {
            var customNameEval = item.customNameEval;

            if (!customNameEval || customNameEval === '') return item.name;
            var name = ''; // eslint-disable-line prefer-const
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            var p = $gameParty;
            try {
                eval(customNameEval);
            } catch (e) {
                showError(e.message);
            }
            return name;
        };

        var evalCustomTextColor = function evalCustomTextColor(item) {
            var customTextColorEval = item.customTextColorEval;

            if (!customTextColorEval || customTextColorEval === '') return 0;
            var textColor = 0; // eslint-disable-line prefer-const
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            var p = $gameParty;
            try {
                eval(customTextColorEval);
            } catch (e) {
                showError(e.message);
            }
            return textColor;
        };

        Window_Base.prototype.setItemTextColorEval = function (item) {
            if (!item) return;
            this._resetTextColor = evalCustomTextColor(item) || item.textColor;
        };

        Window_Base.prototype.drawItemName = function (item, x, y) {
            var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 312;

            if (item) {
                this.setItemTextColor(item);
                this.setItemTextColorEval(item);
                var iconBoxWidth = Window_Base._iconWidth + 4;
                if (item.iconBackground) {
                    this.drawIcon(item.iconBackground, x + 2, y + 2);
                }
                this.drawIcon(item.iconIndex, x + 2, y + 2);
                var itemName = evalCustomName(item);
                this.resetTextColor();
                this.drawText(itemName, x + iconBoxWidth, y, width - iconBoxWidth);
                this._resetTextColor = undefined;
                this.resetTextColor();
            }
        };
    })(Window_Base);
})(WAYModuleLoader.getModule('WAY_YEP_ItemCore'));
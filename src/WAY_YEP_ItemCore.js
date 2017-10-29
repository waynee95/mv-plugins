/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_ItemCore.js
// ===========================================================================
/*:
@plugindesc v1.0.1 Addon to Yanfly's Item Core Plugin. <WAY_YEP_ItemCore>
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

(() => {
    const { getNotetag, getMultiLineNotetag, showError, trim, toInt } = WAY.Util;

    const parseNotetags = obj => {
        obj.customNameEval = getMultiLineNotetag(obj.note, 'Custom Name Eval', null, trim);
        obj.customTextColorEval = getMultiLineNotetag(
            obj.note,
            'custom textcolor eval',
            null,
            trim
        );
        obj.iconBackground = getNotetag(obj.note, 'Icon Background', null, toInt);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);
    WAY.EventEmitter.on('load-skill-notetags', parseNotetags);

    (Window_Base => {
        const evalCustomName = item => {
            const { customNameEval } = item;
            if (!customNameEval || customNameEval === '') return item.name;
            let name = ''; // eslint-disable-line prefer-const
            const s = $gameSwitches._data;
            const v = $gameVariables._data;
            const p = $gameParty;
            try {
                eval(customNameEval);
            } catch (e) {
                showError(e.message);
            }
            return name;
        };

        const evalCustomTextColor = item => {
            const { customTextColorEval } = item;
            if (!customTextColorEval || customTextColorEval === '') return 0;
            let textColor = 0; // eslint-disable-line prefer-const
            const s = $gameSwitches._data;
            const v = $gameVariables._data;
            const p = $gameParty;
            try {
                eval(customTextColorEval);
            } catch (e) {
                showError(e.message);
            }
            return textColor;
        };

        Window_Base.prototype.setItemTextColorEval = function(item) {
            if (!item) return;
            this._resetTextColor = evalCustomTextColor(item) || item.textColor;
        };

        Window_Base.prototype.drawItemName = function(item, x, y, width = 312) {
            if (item) {
                this.setItemTextColor(item);
                this.setItemTextColorEval(item);
                const iconBoxWidth = Window_Base._iconWidth + 4;
                if (item.iconBackground) {
                    this.drawIcon(item.iconBackground, x + 2, y + 2);
                }
                this.drawIcon(item.iconIndex, x + 2, y + 2);
                const itemName = evalCustomName(item);
                this.resetTextColor();
                this.drawText(itemName, x + iconBoxWidth, y, width - iconBoxWidth);
                this._resetTextColor = undefined;
                this.resetTextColor();
            }
        };
    })(Window_Base);
})(WAYModuleLoader.getModule('WAY_YEP_ItemCore'));

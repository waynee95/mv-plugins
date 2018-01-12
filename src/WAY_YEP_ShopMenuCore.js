/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_ShopMenuCore.js
// ============================================================================
/*:
@plugindesc v1.0.1 Addon to Yanfly's Shop Menu Core Plugin. <WAY_YEP_ShopMenuCore>
@author waynee95

@help
==============================================================================
 ■ Lunatic Mode - Custom Shop Show Requirements
==============================================================================

For those who would like to show certain items only if a certain condition
is met. Use the following Lunatic Code:

Item Notetag:
<Custom Buy Show Eval>
visible = !$gameParty.hasItem(item);
</Custom Buy Show Eval>

If the visible is set to false, the item will not appear in the shop.

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

if (typeof WAY === 'undefined') {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_ShopMenuCore', '1.0.1', 'waynee95');
}

($ => {
    const { getMultiLineNotetag, trim } = WAY.Util;

    const parseNotetags = obj => {
        obj.customBuyShowEval = getMultiLineNotetag(obj.note, 'Custom Buy Show Eval', null, trim);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    ((Window_ShopBuy, alias) => {
        const meetsCustomBuyShowEval = item => {
            if (!item || item.customBuyShowEval === '') {
                return true;
            }
            const visible = true;
            const s = $gameSwitches._data;
            const v = $gameVariables._data;
            const p = $gameParty;
            try {
                eval(item.customBuyShowEval);
            } catch (e) {
                throw e;
            }
            return visible;
        };

        const getContainer = num => {
            switch (num) {
            case 0:
                return $dataItems;
            case 1:
                return $dataWeapons;
            case 2:
                return $dataArmors;
            default:
                return [];
            }
        };

        alias.Window_ShopBuy_initialize = Window_ShopBuy.initialize;
        Window_ShopBuy.initialize = function () {
            alias.Window_ShopBuy_initialize.call(this, arguments);
            this._shopGoods = this._shopGoods.filter(([itemType, itemId]) =>
                meetsCustomBuyShowEval(getContainer(itemType)[itemId])
            );
        };
    })(Window_ShopBuy.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_ShopMenuCore'));

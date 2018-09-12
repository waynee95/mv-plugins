/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_ShopMenuCore.js
// ============================================================================
/*:
@plugindesc v1.1.1 Addon to Yanfly's Shop Menu Core Plugin. <WAY_YEP_ShopMenuCore>
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

<Custom Buy Enable Eval>
enable = $gameSwitches.value(1);
</Custom Buy Enable Eval>

If enable is set to false, the item will be greyed out in the shop.

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
    WAYModuleLoader.registerPlugin('WAY_YEP_ShopMenuCore', '1.1.1', 'waynee95');
}

($ => {
    const {
        getMultiLineNotetag,
        trim
    } = WAY.Util;

    const parseNotetags = obj => {
        obj.customBuyShowEval = getMultiLineNotetag(obj.note, 'Custom Buy Show Eval', null, trim);
        obj.customBuyEnableEval = getMultiLineNotetag(obj.note, 'Custom Buy Enable Eval', null, trim);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    const meetsCustomBuyShowEval = item => {
        if (!item || item.customBuyShowEval === null) {
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

    const meetsCustomBuyEnableEval = item => {
        if (!item || item.customBuyEnableEval === null) {
            return true;
        }
        const enable = true;
        const s = $gameSwitches._data;
        const v = $gameVariables._data;
        const p = $gameParty;
        try {
            eval(item.customBuyEnableEval);
        } catch (e) {
            throw e;
        }
        return enable;
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

    $.alias.Window_ShopBuy_initialize = Window_ShopBuy.prototype.initialize;
    Window_ShopBuy.prototype.initialize = function (x, y, height, shopGoods) {
        $.alias.Window_ShopBuy_initialize.call(this, x, y, height, shopGoods);
    };

    $.alias.Window_ShopBuy_makeItemList = Window_ShopBuy.prototype.makeItemList;
    Window_ShopBuy.prototype.makeItemList = function() {
        $.alias.Window_ShopBuy_makeItemList.call(this);
        this._data = this._data.filter(item => meetsCustomBuyShowEval(item));
    };

    $.alias.Window_ShopBuy_isEnabled = Window_ShopBuy.prototype.isEnabled;
    Window_ShopBuy.prototype.isEnabled = function (item) {
        const condition = $.alias.Window_ShopBuy_isEnabled.call(this, item);
        return condition && meetsCustomBuyEnableEval(item);
    };

    $.alias.Scene_Shop_onBuyOk = Scene_Shop.prototype.onBuyOk;
    Scene_Shop.prototype.onBuyOk = function () {
        $.alias.Scene_Shop_onBuyOk.call(this);
        this._buyWindow.refresh();
    };
       
})(WAYModuleLoader.getModule('WAY_YEP_ShopMenuCore'));

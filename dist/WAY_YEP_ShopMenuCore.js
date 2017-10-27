/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_ShopMenuCore.js
// ============================================================================
/**
 * @file Addon to Yanfly's Shop Menu Core Plugin.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc Addon to Yanfly's Shop Menu Core Plugin. <WAY_YEP_ShopMenuCore>
@author waynee95

@help
==============================================================================
 ■ Lunatic Mode - Custom Shop Show Requirements
==============================================================================

For those who would like to show certain items only if a certain condition
is met. Use the following Lunatic Code:

Item Notetag:
<Custom Buy Show Eval>
if (!$gameParty.hasItem(item)) {
visible = true;
} else {
visible = false;
}
</Custom Buy Show Eval>

If the visible is set to false, the item will not appear in the shop.

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
    WAYModuleLoader.registerPlugin('WAY_YEP_ShopMenuCore', '1.0.0', 'waynee95');
}

(function () {
    var _WAY$Util = WAY.Util,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        showError = _WAY$Util.showError,
        trim = _WAY$Util.trim;


    var parseNotetags = function parseNotetags(obj) {
        obj.customNameEval = getMultiLineNotetag(obj.note, 'Custom Buy Show Eval', null, trim);
    };

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    function meetsCustomBuyShowEval(item) {
        if (!item || item.customBuyShowEval === '') {
            return true;
        }
        var visible = true; // eslint-disable-line prefer-const
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        var p = $gameParty;
        try {
            eval(item.customBuyShowEval);
        } catch (e) {
            showError(e.message);
        }
        return visible;
    }

    Window_ShopBuy.prototype.makeItemList = function () {
        var _this = this;

        this._data = [];
        this._price = [];
        this._shopGoods.forEach(function (goods) {
            var item = null;
            switch (goods[0]) {
                case 0:
                    item = $dataItems[goods[1]];
                    break;
                case 1:
                    item = $dataWeapons[goods[1]];
                    break;
                case 2:
                    item = $dataArmors[goods[1]];
                    break;
                default:
                    break;
            }
            if (item && meetsCustomBuyShowEval(item)) {
                _this._data.push(item);
                _this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        });
    };
})(WAYModuleLoader.getModule('WAY_YEP_ShopMenuCore'));
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
*/

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

if (WAY === undefined) {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_YEP_ShopMenuCore', '1.0.1', 'waynee95');
}

(function ($) {
    var _WAY$Util = WAY.Util,
        extend = _WAY$Util.extend,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        showError = _WAY$Util.showError,
        trim = _WAY$Util.trim;


    var parseNotetags = function () {
        function parseNotetags(obj) {
            obj.customBuyShowEval = getMultiLineNotetag(obj.note, 'Custom Buy Show Eval', null, trim);
        }

        return parseNotetags;
    }();

    WAY.EventEmitter.on('load-item-notetags', parseNotetags);
    WAY.EventEmitter.on('load-weapon-notetags', parseNotetags);
    WAY.EventEmitter.on('load-armor-notetags', parseNotetags);

    (function (Window_ShopBuy, alias) {
        var meetsCustomBuyShowEval = function () {
            function meetsCustomBuyShowEval(item) {
                if (!item || item.customBuyShowEval === '') {
                    return true;
                }
                var visible = true;
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

            return meetsCustomBuyShowEval;
        }();

        var getContainer = function () {
            function getContainer(num) {
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
            }

            return getContainer;
        }();

        alias.Window_ShopBuy_makeItemList = Window_ShopBuy.makeItemList;
        extend(Window_ShopBuy, 'initialize', function () {
            this._shopGoods = this._shopGoods.filter(function (_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    itemType = _ref2[0],
                    itemId = _ref2[1];

                return meetsCustomBuyShowEval(getContainer(itemType)[itemId]);
            });
        });
    })(Window_ShopBuy.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_ShopMenuCore'));
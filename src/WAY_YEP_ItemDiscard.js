/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_ItemDiscard.js
// ===========================================================================
/*:
@plugindesc v1.0.0 Addon to Yanfly's Item Discard Plugin. <WAY_YEP_ItemDiscard>

@author waynee95

@help
==============================================================================
 ■ Lunatic Mode - Custom On Discard Eval
==============================================================================
Item, Weapon and Armor Notetag:

<Custom On Discard Eval>
code
</Custom On Discard Eval>

Example:
<Custom On Discard Eval>
var rate = Math.random();
var value = Math.floor(rate * item.price);
$gameParty.gainGold(value);
</Custom On Discard Eval>

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

'use strict'

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!') // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line
    gui.Window.get().showDevTools()
  }
  SceneManager.stop()
} else {
  WAYModuleLoader.registerPlugin('WAY_YEP_ItemDiscard', '1.0.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

($ => {
  const {
    getMultiLineNotetag,
    trim
  } = WAY.Util

  const parseNotetags = obj => {
    obj.customOnDiscardEval = getMultiLineNotetag(obj.note, 'Custom On Discard Eval', null, trim)
    console.log(obj.customOnDiscardEval)
  }

  WAY.EventEmitter.on('load-item-notetags', parseNotetags)
  WAY.EventEmitter.on('load-weapon-notetags', parseNotetags)
  WAY.EventEmitter.on('load-armor-notetags', parseNotetags)

  $.alias.Scene_Item_performDiscardItem = Scene_Item.prototype.performDiscardItem
  Scene_Item.prototype.performDiscardItem = function (item, quantity) {
    if ($gameParty.numItems(item) > 0 && item.customOnDiscardEval) {
      for (let i = 0; i < quantity; i++) {
        eval(item.customOnDiscardEval) // eslint-disable-line no-eval
      }
    }
    $.alias.Scene_Item_performDiscardItem.call(this, item, quantity)
  }
})(WAYModuleLoader.getModule('WAY_YEP_ItemDiscard'))

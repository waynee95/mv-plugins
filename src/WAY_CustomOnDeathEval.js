/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_CustomOnDeathEval.js
// ===========================================================================
/*:
@plugindesc v1.1.0 Run code when a battler dies. <WAY_CustomOnDeathEval>

@author waynee95

@help
==============================================================================
■ Lunatic Mode - Custom On Death Eval
==============================================================================
-- Actor, Class, Enemy, Weapon, Armor, State notetag:

<Custom On Death Eval>
code
</Custom On Death Eval>

This will run when the battler dies. You can use 'user' or 'a' to reference the
died battler. You can use 'killer' or 'b' to reference the battler who killed
the user. Also you can use shortcuts for referencing switches, variables and
the game party. Instead of using $gameSwitches, $gameVariables and $gameParty,
you can just use s, v, and p.

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

'use strict'

if (typeof WAY === 'undefined') {
  console.error('You need to install WAY_Core!') // eslint-disable-line no-console
  if (Utils.isNwjs() && Utils.isOptionValid('test')) {
    var gui = require('nw.gui'); //eslint-disable-line
    gui.Window.get().showDevTools()
  }
  SceneManager.stop()
} else {
  WAYModuleLoader.registerPlugin('WAY_CustomOnDeathEval', '1.1.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

($ => {
  const { getMultiLineNotetag, trim } = WAY.Util

  const parseNotetags = obj => {
    obj.customOnDeathEval = getMultiLineNotetag(obj.note, 'Custom On Death Eval', null, trim)
  }

  WAY.EventEmitter.on('load-actor-notetags', parseNotetags)
  WAY.EventEmitter.on('load-class-notetags', parseNotetags)
  WAY.EventEmitter.on('load-enemy-notetags', parseNotetags)
  WAY.EventEmitter.on('load-armor-notetags', parseNotetags)
  WAY.EventEmitter.on('load-weapon-notetags', parseNotetags)
  WAY.EventEmitter.on('load-state-notetags', parseNotetags)

  const byCustomDeathEval = obj => obj ? obj.customOnDeathEval : ''
  const toCustomDeathEvalCode = (acc, obj) => `${acc}\n${obj.customOnDeathEval || ''}`

  const evalCustomOnDeathEval = function (code, user, killer) {
    /* eslint-disable */
    const a = user;
    const b = killer;
    const s = $gameSwitches;
    const v = $gameVariables;
    const p = $gameParty;
    try {
      eval(code);
      /* eslint-enable */
    } catch (e) {
      throw e
    }
  }

  //==========================================================================
  // Game_Battler
  //==========================================================================
  Game_Battler.prototype.customOnDeathEval = function () {
    return this.states().filter(byCustomDeathEval).reduce(toCustomDeathEvalCode, '')
  }

  //==========================================================================
  // Game_Actor
  //==========================================================================
  Game_Actor.prototype.customOnDeathEval = function () {
    let code = Game_Battler.prototype.customOnDeathEval.call(this)
    code += this.equips().filter(byCustomDeathEval).reduce(toCustomDeathEvalCode, '')
    code += `\n${this.currentClass().customOnDeathEval}` || ''
    code += `\n${this.actor().customOnDeathEval}` || ''
    return code
  }

  //==========================================================================
  // Game_Enemy
  //==========================================================================
  Game_Enemy.prototype.customOnDeathEval = function () {
    let code = Game_Battler.prototype.customOnDeathEval.call(this)
    code += `\n${this.enemy().customOnDeathEval}` || ''
    return code
  }

  //==========================================================================
  // Game_Action
  //==========================================================================
  $.alias.Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage
  Game_Action.prototype.executeHpDamage = function (target, value) {
    $.alias.Game_Action_executeHpDamage.call(this, target, value)
    if (target.hp < 1 || target.isDead()) {
      evalCustomOnDeathEval(target.customOnDeathEval(), target, this.subject())
    }
  }
})(WAYModuleLoader.getModule('WAY_CustomOnDeathEval'))

/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_DamageFormulaMacros.js
// ===========================================================================
/*:
@plugindesc v1.1.0 Define macros for damage formulas. <WAY_DamageFormulaMacros>

@author waynee95

@param macros
@text Formula Macros
@desc Add different macros here.
@type struct<macro>[]
@default []

@help
==============================================================================
 ■ Usage
==============================================================================
1. Open the plugin in the Plugin-Manager.
2. Click on formula macros.
3. Click on a free row.
4. Put in a name and a formula.
5. Now you can use that name in every formula you want. It will be replaced
with the formula.

You can use different macros in one formula or the same macro as many times
you want.

Examples:
myMacro * 10

a.atk + 3 + myMacro + 5

(a.atk > a.mat) ? myMacro1 : myMacro2

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
  WAYModuleLoader.registerPlugin('WAY_DamageFormulaMacros', '1.1.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

($ => {
  const $dataMacros = $.parameters.macros

  const replaceMacros = obj => {
    $dataMacros.forEach(({ name, formula }) => {
      if (obj.damage.formula.indexOf(name) > -1) {
        const regex = new RegExp(name, 'g')
        obj.damage.formula = obj.damage.formula.replace(regex, formula)
      }
    })
  }

  WAY.EventEmitter.on('load-item-notetags', replaceMacros)
  WAY.EventEmitter.on('load-skill-notetags', replaceMacros)
})(WAYModuleLoader.getModule('WAY_DamageFormulaMacros'))

/*~struct~macro:
@param name
@text Macro Name
@desc Name of the macro. Put this name into the damage formula.
@type text

@param formula
@text Formula
@desc The formula the macro will be replaced with.
@type text
*/

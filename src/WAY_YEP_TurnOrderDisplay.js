/* globals WAY, WAYModuleLoader, Window_TurnOrderIcon */
// ===========================================================================
// WAY_YEP_TurnOrderDisplay.js
// ===========================================================================
/*:
@plugindesc v1.2.0 Addon to Yanfly's Turn Order Display Plugin. <WAY_YEP_TurnOrderDisplay>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Enemy

<Turn Order Image: filename, index>

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
  WAYModuleLoader.registerPlugin('WAY_YEP_TurnOrderDisplay', '1.2.0', 'waynee95', {
    name: 'WAY_Core',
    version: '>= 2.0.0'
  })
}

($ => {
  const { getNotetag } = WAY.Util

  WAY.EventEmitter.on('load-enemy-notetags', enemy => {
    getNotetag(enemy.note, 'Turn Order Image', null, str => {
      let [filename, faceIndex] = str.split(',')
      filename = filename.trim()
      faceIndex = parseInt(faceIndex, 10)
      enemy.turnOrderImage = { filename, faceIndex }
    })
  })

  //==========================================================================
  // Game_Enemy
  //==========================================================================
  $.alias.Game_Enemy_turnOrderDisplayBitmap = Game_Enemy.prototype.turnOrderDisplayBitmap
  Game_Enemy.prototype.turnOrderDisplayBitmap = function () {
    if (this.enemy().turnOrderImage) {
      return ImageManager.loadFace(this.enemy().turnOrderImage.fileName)
    }
    return $.alias.Game_Enemy_turnOrderDisplayBitmap.call(this)
  }

  //==========================================================================
  // Window_TurnOrderIcon
  //==========================================================================
  $.alias.Window_TurnOrderIcon_drawBattler = Window_TurnOrderIcon.prototype.drawBattler
  Window_TurnOrderIcon.prototype.drawBattler = function () {
    if (this.battler().isEnemy() && this.battler().enemy().turnOrderImage) {
      this.drawEnemyFace()
    } else {
      $.alias.Window_TurnOrderIcon_drawBattler.call(this)
    }
  }

  $.alias.Window_TurnOrderIcon_updateDestinationX =
        Window_TurnOrderIcon.prototype.updateDestinationX
  Window_TurnOrderIcon.prototype.updateDestinationX = function () {
    $.alias.Window_TurnOrderIcon_updateDestinationX.call(this)
    if (this._destinationX === undefined) this._destinationX = this.x
  }

  Window_TurnOrderIcon.prototype.drawEnemyFace = function () {
    const { filename, faceIndex } = this.battler().enemy().turnOrderImage
    const bitmap = ImageManager.loadFace(filename)
    bitmap.addLoadListener(() => {
      const sw = Window_Base._faceWidth
      const sh = Window_Base._faceHeight
      const dx = 0
      const dy = 0
      const sx = (faceIndex % 4) * sw
      const sy = Math.floor(faceIndex / 4) * sh
      const dw = this.contents.width - 8
      const dh = this.contents.height - 8
      this.contents.blt(bitmap, sx, sy, sw, sh, dx + 4, dy + 4, dw, dh)
      this.drawLetter()
    })
  }
})(WAYModuleLoader.getModule('WAY_YEP_TurnOrderDisplay'))

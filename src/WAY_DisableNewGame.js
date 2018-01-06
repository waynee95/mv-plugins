/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_DisableNewGame.js
// ============================================================================
/*:
@plugindesc v1.0.0 Disable the New Game Command, if all Savefiles are in use. <WAY_DisableNewGame>

@author waynee95

===============================================================================
 ■ Terms of Use
===============================================================================
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
    WAYModuleLoader.registerPlugin('WAY_DisableNewGame', '1.0.0', 'waynee95');
}

($ => {
    Scene_Title.prototype.isNewGameEnabled = function () {
        const globalInfo = DataManager.loadGlobalInfo();
        const numSavefiles = Math.max(0, globalInfo.length - 1);
        return numSavefiles < DataManager.maxSavefiles();
    };

    Scene_Title.prototype.createCommandWindow = function () {
        this._commandWindow = new Window_TitleCommand();
        this._commandWindow.setHandler('newGame', this.commandNewGame.bind(this),
            this.isNewGameEnabled());
        this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    };
})(WAYModuleLoader.getModule('WAY_DisableNewGame'));

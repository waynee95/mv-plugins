/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_EventMiniLabel.js
// ============================================================================
/*:
@plugindesc v1.1.0 Addon to Yanfly's Event Mini Label Plugin. <WAY_YEP_EventMiniLabel>

@author waynee95

@help
===============================================================================
 ■ Plugin Commands
===============================================================================
-- MiniLabelText set id text
MiniLabelText - Main Command Identifier
set  - Command to set Label Text
id   - Event id
text - New Label Text (optional, leave blank for deleting the Label Text)

===============================================================================
 ■ Terms of Use
===============================================================================
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
    WAYModuleLoader.registerPlugin('WAY_YEP_EventMiniLabel', '1.1.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

(() => {
    //=============================================================================
    // PluginManager
    //=============================================================================
    PluginManager.addCommand('MiniLabelText', {
        set(eventId, ...miniLabelText) {
            const spriteset = SceneManager._scene._spriteset;
            if (!spriteset) {
                return;
            }
            const event = $gameMap.event(eventId);
            if (!event) {
                return;
            }
            const miniLabel = spriteset._characterSprites.filter(
                sprite => sprite._character === event
            )[0]._miniLabel;
            if (!miniLabel) {
                return;
            }
            miniLabel.setText(miniLabelText.toString().replace(/,/g, ' '));
        }
    });
})(WAYModuleLoader.getModule('WAY_YEP_EventMiniLabel'));

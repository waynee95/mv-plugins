/* globals WAY, WAYModuleLoader */
// ===========================================================================
// WAY_YEP_EventMiniLabel.js
// ===========================================================================
/**
 * @file Addon to Yanfly's Event Mini Label Plugin.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc Addon to Yanfly's Event Mini Label Plugin. <WAY_YEP_EventMiniLabel>
@author waynee95

@help
==============================================================================
 ■ Plugin Commands
==============================================================================
-- MiniLabelText set [id] [text]

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
    WAYModuleLoader.registerPlugin('WAY_YEP_EventMiniLabel', '1.0.0', 'waynee95');
}

(function () {
    PluginManager.addPluginCommand('MiniLabelText', {
        add: function () {
            function add(eventId, text) {
                console.log(eventId, text);
                /*var eventId = args[0];
                const miniLabelText = args.slice(1, args.length).toString().replace(/,/g, ' ');
                if (!SceneManager._scene._spriteset) { return; }
                const event = $gameMap._events[eventId];
                if (!event) { return; }
                const miniLabel = SceneManager._scene._spriteset._characterSprites.filter(sprite => sprite._character == event)[0]._miniLabel;
                if (!miniLabel) { return; }
                miniLabel.setText(miniLabelText);*/
            }

            return add;
        }()
    });
})(WAYModuleLoader.getModule('WAY_YEP_EventMiniLabel'));
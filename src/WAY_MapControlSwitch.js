/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_MapControlSwitch.js
// ============================================================================
/*:
@plugindesc v1.0.0 Control switches for each map through notetags. <WAY_MapControlSwitch>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Map:
<Control Switch: switchId, value>

This will turn on a certain switch, when the map is entered.

Example:
<Control Switch: 1, on>
<Control Switch: 2, off>

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
    WAYModuleLoader.registerPlugin('WAY_MapControlSwitch', '1.0.0', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 1.8.0'
    });
}

(() => {
    const { getNotetagList, toInt, trim } = WAY.Util;

    WAY.EventEmitter.on('load-map-notetags', map => {
        map.switches = getNotetagList(map.note, 'Control Switch', data => {
            let [switchId, value] = data.split(',').map(trim);
            switchId = toInt(switchId);
            value = value === 'on';
            return { switchId, value };
        });
        map.switches.forEach(({ switchId, value }) => {
            $gameSwitches.setValue(switchId, value);
        });
    });
})(WAYModuleLoader.getModule('WAY_MapControlSwitch'));

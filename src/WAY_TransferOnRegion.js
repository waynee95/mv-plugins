/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_TransferOnRegion.js
// ============================================================================
/*:
@plugindesc v1.0.2 Transfer the player when he touches a certain region id.
<WAY_TransferOnRegion>

@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================
-- Map:

<Region Transfer: regionId, mapId, targetX, targetY, direction, fadeType>

regionId  - Id of the region, that will trigger the transfer

mapId     - mapId of the map the player will be transferred to

targetX   - player x position on new map

targetY   - player y position on new map

direction - facing direction of the player after moving (optional)

For the direction, use one of the following numbers:
    0 = retain 
    2 = down
    4 = left
    6 = right
    8 = up

fadeType  - type of the screen transition after moving (optional)

For the fadeType, use one of the following numbers:
    0 = black transition
    1 = white transition
    2 = no transition effect

>>> If there is no direction specified, the plyer will retain it's current
facing direction.

>>> If there is no fadeType specified, the screen transition will be black.

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

'use strict';

if (typeof WAY === 'undefined') {
    console.error('You need to install WAY_Core!'); //eslint-disable-line no-console
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
        var gui = require('nw.gui'); //eslint-disable-line
        gui.Window.get().showDevTools();
    }
    SceneManager.stop();
} else {
    WAYModuleLoader.registerPlugin('WAY_TransferOnRegion', '1.0.2', 'waynee95', {
        name: 'WAY_Core',
        version: '>= 2.0.0'
    });
}

($ => {
    const { getNotetagList, toInt } = WAY.Util;

    WAY.EventEmitter.on('load-map-notetags', map => {
        map._transferData = {};
        getNotetagList(map.note, 'Region Transfer', data => {
            const [regionId,
                mapId,
                targetX,
                targetY,
                direction = 0,
                fadeType = 0] = data.split(',').map(toInt);
            const transferDataObject = { regionId, mapId, targetX, targetY, direction, fadeType };
            map._transferData[regionId] = transferDataObject;
        });
    });

    //=============================================================================
    //  Game_Player
    //=============================================================================
    $.alias.Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function (d) {
        $.alias.Game_Player_moveStraight.call(this, d);
        const transferDataObject = $dataMap ? $dataMap._transferData[this.regionId()] : null;
        if (transferDataObject) {
            const { mapId, targetX, targetY, direction, fadeType } = transferDataObject;
            $gamePlayer.reserveTransfer(mapId, targetX, targetY, direction, fadeType);

        }
    };

})(WAYModuleLoader.getModule('WAY_TransferOnRegion'));

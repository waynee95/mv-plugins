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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

(function () {
    var _WAY$Util = WAY.Util,
        getNotetagList = _WAY$Util.getNotetagList,
        toInt = _WAY$Util.toInt,
        trim = _WAY$Util.trim;


    WAY.EventEmitter.on('load-map-notetags', function (map) {
        map.switches = getNotetagList(map.note, 'Control Switch', function (data) {
            var _data$split$map = data.split(',').map(trim),
                _data$split$map2 = _slicedToArray(_data$split$map, 2),
                switchId = _data$split$map2[0],
                value = _data$split$map2[1];

            switchId = toInt(switchId);
            value = value === 'on';
            return { switchId: switchId, value: value };
        });
        map.switches.forEach(function (_ref) {
            var switchId = _ref.switchId,
                value = _ref.value;

            $gameSwitches.setValue(switchId, value);
        });
    });
})(WAYModuleLoader.getModule('WAY_MapControlSwitch'));
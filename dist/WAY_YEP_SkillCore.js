/* globals WAY, WAYModuleLoader */
// ============================================================================
// WAY_YEP_SkillCore.js
// ============================================================================
/**
 * @file Addon to Yanfly's Skill Core Plugin.
 * @author waynee95
 * @version 1.0.0
 */
/*:
@plugindesc Addon to Yanfly's Skill Core Plugin. <WAY_YEP_SkillCore>
@author waynee95

@help
==============================================================================
 ■ Notetags
==============================================================================

-- Actor Notetag:
<Hide SType: x>
<Hide SType: x, x, x>
<Hide SType: x to y>
This will hide the skillTypes in the Actor Command Window.

-- Skill Notetag:
<Custom HP Cost Text Eval>
if (user.hp >= 0.2 * user.mhp) {
*    text = "\\fs[20]" + "\\c[18]" + 3 + "%" + "\\i[162]";
} else {
*    text = "\\fs[20]" + "\\c[18]" + cost + "\\i[162]";
}
</Custom HP Cost Text Eval>
This will override the normal HP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill hp cost.

<Custom MP Cost Text Eval>
if (user.mp >= 0.2 * user.mmp) {
*    text = "\\fs[20]" + "\\c[23]" + 3 + "%" + "\\i[160]";
} else {
*    text = "\\fs[20]" + "\\c[23]" + cost + "\\i[160]";
}
</Custom MP Cost Text Eval>
This will override the normal MP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

<Custom TP Cost Text Eval>
if (user.tp >= 0.2 * user.maxTp()) {
*    text = "\\fs[20]" + "\\c[29]" + 3 + "%" + "\\i[164]";
} else {
*    text = "\\fs[20]" + "\\c[29]" + cost + "\\i[164]";
}
</Custom TP Cost Text Eval>
This will override the normal TP Cost Text for that skill. You can use any text code,
you want. However, you need to add a second \ before every text code. The 'cost' variable
refers to the actual skill mp cost.

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
    WAYModuleLoader.registerPlugin('WAY_YEP_SkillCore', '1.0.0', 'waynee95');
}

(function ($) {
    var _WAY$Util = WAY.Util,
        getMultiLineNotetag = _WAY$Util.getMultiLineNotetag,
        getNotetag = _WAY$Util.getNotetag,
        toArray = _WAY$Util.toArray,
        trim = _WAY$Util.trim,
        difference = _WAY$Util.difference;


    WAY.EventEmitter.on('load-actor-notetags', function (actor) {
        actor.hiddenSTypes = getNotetag(actor.note, 'Hide SType', [], toArray);
    });

    WAY.EventEmitter.on('load-skill-notetags', function (skill) {
        skill.customHpCostTextEval = getMultiLineNotetag(skill.note, 'Custom HP Cost Text Eval', null, trim);
        skill.customMpCostTextEval = getMultiLineNotetag(skill.note, 'Custom MP Cost Text Eval', null, trim);
        skill.customTpCostTextEval = getMultiLineNotetag(skill.note, 'Custom TP Cost Text Eval', null, trim);
    });

    (function (Window_ActorCommand, alias) {
        alias.Window_ActorCommand_addSkillCommands = Window_ActorCommand.addSkillCommands;
        Window_ActorCommand.addSkillCommands = function () {
            var _this = this;

            var hiddenSTypes = this._actor.actor().hideSTypes;
            var skillTypes = this._actor.addedSkillTypes();
            skillTypes = difference(skillTypes, hiddenSTypes);

            skillTypes.sort(function (a, b) {
                return a - b;
            });
            skillTypes.forEach(function (stypeId) {
                var name = $dataSystem.skillTypes[stypeId];
                _this.addCommand(name, 'skill', true, stypeId);
            });
        };
    })(Window_ActorCommand.prototype, $.alias);
})(WAYModuleLoader.getModule('WAY_YEP_SkillCore'));